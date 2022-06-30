import { promises as fs } from 'fs';
import path from 'path';
import { contractMetadata, getMetadata } from '../metadata';
import { getCacheableTokenIds } from '../token';

export const exportMetadata = async () => {
  await fs.mkdir('metadata-output/', { recursive: true });

  const tokens = await getCacheableTokenIds();

  await Promise.all(
    tokens.map(async ({ id, chain }) => {
      // TODO map across all chains
      const metadataOutput = await getMetadata(String(chain), id);

      const outputFile = path.join(process.cwd(), `metadata-output/${chain}/${id}`);

      await fs.writeFile(outputFile, JSON.stringify(metadataOutput, null, 2));
    })
  );

  const outputFile = path.join(process.cwd(), `metadata-output/contract`);

  await fs.writeFile(outputFile, JSON.stringify(contractMetadata, null, 2));
};

exportMetadata().then(() => console.log('Exported!'));
