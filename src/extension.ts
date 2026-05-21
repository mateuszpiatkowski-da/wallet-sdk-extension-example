import { SDKPlugin, type PreparedCommand, type SDKContext } from '@canton-network/wallet-sdk';
import { Utility } from './codegen/utility-registry-app-v0-0.7.0/lib';

export const WalletSDKUtilitiesPluginName = 'utilities';

export class WalletSDKUtilitiesPlugin extends SDKPlugin {
  constructor(protected override readonly ctx: SDKContext) {
    super(WalletSDKUtilitiesPluginName, ctx);
  }

  public preapprovalTransfer = {
    create: (
      args: Utility.Registry.App.V0.Model.TransferPreapproval.TransferPreapproval,
    ): PreparedCommand<'CreateCommand'> => {
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

      return [transferPreapprovalCommand, []];
    },
  };
}
