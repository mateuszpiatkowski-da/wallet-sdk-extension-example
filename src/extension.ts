import type { SDKContext } from '@canton-network/wallet-sdk';
import { Utility } from './codegen/utility-registry-app-v0-0.7.0/lib';

export class WalletSDKUtilitiesExtension {
  constructor(private readonly ctx: SDKContext) {}

  public commands = {
    createTransferPreapproval: (args: Utility.Registry.App.V0.Model.TransferPreapproval.TransferPreapproval) => {
      const { receiver, operator, instrumentAdmin, instrumentAllowances } = args;
      return [
        {
          CreateCommand: {
            templateId: Utility.Registry.App.V0.Model.TransferPreapproval.TransferPreapproval.templateId,
            createArguments: {
              operator,
              receiver,
              instrumentAdmin,
              instrumentAllowances,
            },
          },
        },
      ];
    },
  };
}
