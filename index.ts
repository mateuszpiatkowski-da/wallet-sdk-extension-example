import { localNetStaticConfig, SDK, type TokenProviderConfig } from '@canton-network/wallet-sdk';
import { WalletSDKUtilitiesPlugin } from './src/extension';

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

const utilities = new WalletSDKUtilitiesPlugin();

const sdk = (
  await SDK.create({
    auth,
    ledgerClientUrl: localNetStaticConfig.LOCALNET_APP_USER_LEDGER_URL,
  })
).registerPlugins([utilities]);

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

const preapprovalCommandExecutionResult = await utilities.preapprovalTransfer.create({
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
