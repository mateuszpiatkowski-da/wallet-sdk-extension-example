import type { SDKInterface } from '@canton-network/wallet-sdk';
import { $ } from 'bun';
import path from 'path';
import fs from 'fs/promises';

const scriptsDir = path.join(import.meta.dir, '..', 'scripts');
const darDir = path.join(import.meta.dir, '..', 'dar');
const codegenDir = path.join(import.meta.dir, 'codegen');
const latestDarsScript = path.join(scriptsDir, 'latest-dars.sh');

const latestDars = $`bash ${latestDarsScript}`.lines();

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
