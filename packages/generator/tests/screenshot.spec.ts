import { chromium, Page, test } from '@playwright/test';
import fs from 'fs';
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

let tokenIds: {
  chain: number;
  id: string;
  outputFilename: string;
}[];

test.use({ viewport: { width: 2000, height: 2000 } });

test.beforeAll(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://proofofresidency.xyz');
  tokenIds = (
    await page.evaluate(async () => {
      const res = await fetch('https://proofofresidency.xyz/api/tokens');
      const tokens: GetAllTokensResponse = await res.json();

      return tokens;
    })
  ).map((t) => ({
    ...t,
    outputFilename: path.join(process.cwd(), `public/token/${t.chain}/${t.id}.png`)
  }));
  await browser.close();

  tokenIds = tokenIds.filter((t) => !fs.existsSync(t.outputFilename));

  console.log(`Generating for ${tokenIds.length} tokens`);
});

test.describe.parallel('export token images', () => {
  const screenshot = async (page: Page, chain: number, tokenId: string, outputFilename: string) => {
    await page.goto(`https://generator.proofofresidency.xyz/${chain}/${tokenId}`);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // yes, waits are the devil
    await page.screenshot({
      type: 'png',
      path: outputFilename
    });
  };

  test('export', async ({ page }) => {
    for (const { id, chain, outputFilename } of tokenIds) {
      await screenshot(page, chain, id, outputFilename);
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
