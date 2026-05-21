import { localNetStaticConfig, SDK, type TokenProviderConfig } from '@canton-network/wallet-sdk';
import { WalletSDKUtilitiesPlugin, WalletSDKUtilitiesPluginName } from './src/extension';
import { expect, test } from 'bun:test';
import path from 'path';
import { readFile } from 'fs/promises';
import { $ } from 'bun';

test(
  'plugin connection',
  async () => {
    const auth: TokenProviderConfig = {
      method: 'self_signed',
      issuer: 'unsafe-auth',
      credentials: {
        clientId: localNetStaticConfig.LOCALNET_USER_ID,
        clientSecret: 'unsafe',
        audience: 'https://canton.network.global',
        scope: '',
      },
    };

    const sdk = (
      await SDK.create({
        auth,
        ledgerClientUrl: localNetStaticConfig.LOCALNET_APP_USER_LEDGER_URL,
      })
    ).registerPlugins({
      [WalletSDKUtilitiesPluginName]: WalletSDKUtilitiesPlugin,
    });

    const darFiles = await Promise.all(
      (await $`bash ./scripts/latest-dars.sh`.text())
        .split('\n')
        .filter(Boolean)
        .map(async (file) => ({
          file: path.join(import.meta.dir, 'dar', file),
          packageId: (await import(path.join(import.meta.dir, 'src', 'codegen', file.replace('.dar', '')))).packageId,
        })),
    );

    for await (const { file, packageId } of darFiles) {
      const bytes = new Uint8Array(await readFile(file));
      await sdk.ledger.dar.upload(bytes, packageId);
    }

    const createParty = async (partyHint: string) => {
      const keys = sdk.keys.generate();

      const party = await sdk.party.external
        .create(keys.publicKey, {
          partyHint,
        })
        .sign(keys.privateKey)
        .execute();

      return { keys, party };
    };

    const receiver = await createParty('receiver');
    const operator = await createParty('operator');
    const instrumentAdmin = await createParty('instrumentAdmin');

    const [preapprovalCommand, preapprovalDc] = sdk[WalletSDKUtilitiesPluginName].preapprovalTransfer.create({
      receiver: receiver.party.partyId,
      operator: operator.party.partyId,
      instrumentAdmin: instrumentAdmin.party.partyId,
      instrumentAllowances: [
        {
          id: 'instr',
        },
      ],
    });

    const result = await sdk.ledger
      .prepare({
        partyId: receiver.party.partyId,
        commands: preapprovalCommand,
        disclosedContracts: preapprovalDc,
      })
      .sign(receiver.keys.privateKey)
      .execute({
        partyId: receiver.party.partyId,
      });

    expect(result).toHaveProperty('updateId');
  },
  1000 * 60,
);
