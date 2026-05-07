import { localNetStaticConfig, SDK, type TokenProviderConfig } from '@canton-network/wallet-sdk';

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

const sdk = SDK.create({
  auth,
  ledgerClientUrl: localNetStaticConfig.LOCALNET_APP_USER_LEDGER_URL,
});
