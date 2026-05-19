import { SDKPlugin, type PreparedCommand, type SDKContext } from '@canton-network/wallet-sdk';
import { Utility } from './codegen/utility-registry-app-v0-0.7.0/lib';
import type { Ops } from '@canton-network/core-provider-ledger';

export const WalletSDKUtilitiesPluginName = 'utilities';

export class WalletSDKUtilitiesPlugin extends SDKPlugin {
  constructor(protected override readonly ctx: SDKContext) {
    super(WalletSDKUtilitiesPluginName, ctx);
  }

  public preapprovalTransfer = {
    create: async (args: Utility.Registry.App.V0.Model.TransferPreapproval.TransferPreapproval) => {
      const transferPreapprovalCommand: PreparedCommand<'CreateCommand'>[0] = {
        CreateCommand: {
          templateId: Utility.Registry.App.V0.Model.TransferPreapproval.TransferPreapproval.templateId,
          createArguments: args,
        },
      };

      this.logger.info(
        {
          timestamp: new Date().toISOString(),
          command: transferPreapprovalCommand,
        },
        'Successfully created transfer preapproval command. Executing...',
      );

      return await this.ctx.ledgerProvider.request<Ops.PostV2CommandsSubmitAndWaitForTransaction>({
        method: 'ledgerApi',
        params: {
          resource: '/v2/commands/submit-and-wait-for-transaction',
          requestMethod: 'post',
          body: {
            commands: {
              commands: [transferPreapprovalCommand],
              commandId: Bun.randomUUIDv7(),
              actAs: [args.receiver],
            },
          },
        },
      });
    },
  };
}
