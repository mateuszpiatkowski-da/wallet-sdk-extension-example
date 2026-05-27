# Wallet SDK Extension Example

**A demonstration project showcasing how to create extensions for the Canton Network Wallet SDK.**

This repository serves as a practical example of building a custom Wallet SDK extension/plugin. It demonstrates the complete workflow from DAR file management to TypeScript code generation and plugin implementation using Canton Network utility contracts.

## Overview

This project demonstrates how to:

- **Extend the Wallet SDK** with custom functionality through the plugin system
- **Integrate Daml smart contracts** by wrapping DAR packages with TypeScript
- **Generate TypeScript bindings** from DAR files using DPM (Daml Package Manager)
- **Implement command execution** patterns for ledger operations
- **Test plugin integrations** with the Wallet SDK

The example implementation focuses on **Transfer Preapproval** functionality from Canton's utility contracts, chosen for presentation purposes to illustrate the extension development pattern.

## Requirements

- **Yarn**: ≥4.0.0 (package manager)
- **Node.js**: ≥18.0.0 (runtime)
- **DPM** (Daml Package Manager): Required for generating TypeScript code from DAR files

## Installation

```bash
# Install dependencies && generate codegen from DAR files
yarn install
```

## Project Structure

```text
wallet-sdk-utilities-extension/
├── dar/                    # Daml Archive files (.dar)
│   ├── utility-registry-app-v0-*.dar
│   ├── utility-credential-app-v0-*.dar
│   ├── utility-commercials-v0-*.dar
│   └── utility-settlement-app-v1-*.dar
├── scripts/
│   ├── generate-codegen.sh # Generates TypeScript from latest DARs
│   └── latest-dars.sh      # Identifies latest version of each DAR
├── src/
│   ├── codegen/            # Auto-generated TypeScript code (gitignored)
│   ├── extension.ts        # Main plugin implementation
│   └── uploadDar.ts        # DAR upload utility
├── index.test.ts           # Integration tests
└── package.json
```

## Development

### Scripts

- **`yarn generate:codegen`** - Regenerate TypeScript code from the latest DAR versions
- **`yarn dev`** - Run tests in watch mode during development

### Code Generation Workflow

The project uses a versioned DAR approach:

1. DAR files are stored in the `/dar` directory with semantic versioning
2. `latest-dars.sh` identifies the newest version of each utility package
3. `generate-codegen.sh` runs DPM codegen on the latest DARs
4. Generated TypeScript code is placed in `/src/codegen/`

### Running Tests

```bash
# Run tests once
yarn test

# Watch mode (for development)
yarn dev
```
