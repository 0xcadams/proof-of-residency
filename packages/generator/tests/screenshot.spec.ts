import { chromium, Page, test } from '@playwright/test';
import path from 'path';
import { GetAllTokensResponse } from '../src/types';

// Run tests with custom timeout
test.setTimeout(24 * 60 * 60 * 1000);

// test("export previews", async ({ page }) => {
// test.use({ viewport: { width: 6000, height: 6000 } });
//   const tokenIds = getTokenIdForAllCountries();

//   for (const tokenId of tokenIds) {
//     await page.goto(`http://localhost:3000/${tokenId.id}`);
//     await new Promise((resolve) => setTimeout(resolve, 500)); // yes, waits are the devil
//     await page.screenshot({
//       type: "png",
//       path: path.join(
//         process.cwd(),
//         `public/previews/${Number(tokenId.numeric)}.png`
//       ),
//     });
//   }
// });

let tokenIds: GetAllTokensResponse;
let indexOne: number = 0;
let indexTwo: number = 0;
let indexThree: number = 0;
let indexFour: number = 0;

test.use({ viewport: { width: 2000, height: 2000 } });

test.beforeAll(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://proofofresidency.xyz');
  tokenIds = await page.evaluate(async () => {
    const res = await fetch('https://proofofresidency.xyz/api/tokens');
    const tokens: GetAllTokensResponse = await res.json();

    return tokens;
  });
  await browser.close();

  console.log(`Generating for ${tokenIds.length} tokens`);

  indexOne = Math.round(tokenIds.length / 5);
  indexTwo = Math.round(indexOne * 2);
  indexThree = Math.round(indexOne * 3);
  indexFour = Math.round(indexOne * 4);
});

test.describe.parallel('export token images', () => {
  const screenshot = async (page: Page, chain: number, tokenId: string) => {
    await page.goto(`https://generator.proofofresidency.xyz/${chain}/${tokenId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // yes, waits are the devil
    await page.screenshot({
      type: 'png',
      path: path.join(process.cwd(), `public/token/${tokenId}.png`)
    });
  };

  test('export parallel 1', async ({ page }) => {
    for (const { id, chain } of tokenIds.slice(0, indexOne)) {
      await screenshot(page, chain, id);
    }
  });
  test('export parallel 2', async ({ page }) => {
    for (const { id, chain } of tokenIds.slice(indexOne, indexTwo)) {
      await screenshot(page, chain, id);
    }
  });
  test('export parallel 3', async ({ page }) => {
    for (const { id, chain } of tokenIds.slice(indexTwo, indexThree)) {
      await screenshot(page, chain, id);
    }
  });
  test('export parallel 4', async ({ page }) => {
    for (const { id, chain } of tokenIds.slice(indexThree, indexFour)) {
      await screenshot(page, chain, id);
    }
  });
  test('export parallel 5', async ({ page }) => {
    for (const { id, chain } of tokenIds.slice(indexFour)) {
      await screenshot(page, chain, id);
    }
  });
});

// test("export random images", async ({ page }) => {
//   const tokenIds = ["124000000000000002"];
// test.use({ viewport: { width: 6000, height: 6000 } });

//   for (const tokenId of tokenIds) {
//     await page.goto(`https://generator.proofofresidency.xyz/${tokenId}`);
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // yes, waits are the devil
//     await page.screenshot({
//       type: "png",
//       path: path.join(process.cwd(), `./${tokenId}.png`),
//     });
//   }
// });
