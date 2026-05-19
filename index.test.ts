import { localNetStaticConfig, SDK, type TokenProviderConfig } from '@canton-network/wallet-sdk';
import { WalletSDKUtilitiesPlugin, WalletSDKUtilitiesPluginName } from './src/extension';
import { expect, test, spyOn } from 'bun:test';

test('plugin connection', async () => {
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

  // Set up Bun spy on ledgerProvider.request
  const plugin = sdk[WalletSDKUtilitiesPluginName];
  const ledgerProvider = (plugin as any).ctx.ledgerProvider;
  const ledgerRequestSpy = spyOn(ledgerProvider, 'request');

  const preapprovalCommandExecutionResult = await sdk[WalletSDKUtilitiesPluginName].preapprovalTransfer.create({
    receiver: receiver.party.partyId,
    operator: operator.party.partyId,
    instrumentAdmin: instrumentAdmin.party.partyId,
    instrumentAllowances: [
      {
        id: 'instr',
      },
    ],
  });

  console.log(preapprovalCommandExecutionResult);

  // Assert that ledgerProvider.request was called
  expect(ledgerRequestSpy).toHaveBeenCalledTimes(1);
  expect(ledgerRequestSpy).toHaveBeenCalledWith({
    method: 'ledgerApi',
    params: expect.objectContaining({
      resource: '/v2/commands/submit-and-wait-for-transaction',
      requestMethod: 'post',
    }),
  });
});
