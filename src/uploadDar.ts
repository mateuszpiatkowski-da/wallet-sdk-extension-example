import type { SDKInterface } from '@canton-network/wallet-sdk';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptsDir = path.join(__dirname, '..', 'scripts');
const darDir = path.join(__dirname, '..', 'dar');
const codegenDir = path.join(__dirname, 'codegen');
const latestDarsScript = path.join(scriptsDir, 'latest-dars.sh');

const latestDarsResult = await execa('bash', [latestDarsScript]);
const latestDars = latestDarsResult.stdout.split('\n');

const availableDars: Record<
  string,
  {
    dar: string;
    codegen: string;
  }
> = {};

for await (const dar of latestDars) {
  if (dar.length) {
    const extensionlessDarName = dar.replace('.dar', '');

    availableDars[extensionlessDarName] = {
      dar: path.join(darDir, dar),
      codegen: path.join(codegenDir, extensionlessDarName, 'lib', 'index.js'),
    };
  }
}

export async function uploadDar(sdk: SDKInterface, selectedDars?: string[]) {
  const darsToUpload = selectedDars ?? Object.keys(availableDars);

  for (const darName of darsToUpload) {
    if (!availableDars[darName]) {
      console.warn(`Couldn't find ${darName} in available dars, skipping...`);
      continue;
    }
    const darBytes = await fs.readFile(availableDars[darName].dar);
    const packageId = (await import(availableDars[darName].codegen)).packageId;
    console.log(packageId);
    await sdk.ledger.dar.upload(darBytes, packageId);
  }
}
