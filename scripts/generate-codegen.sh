#!/bin/bash
set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
DAR_DIR="$PROJECT_ROOT/dar"
OUTPUT_DIR="$PROJECT_ROOT/src/codegen"

latest_dars=$(bash "$SCRIPT_DIR/latest-dars.sh")

if [ -z "$latest_dars" ]; then
  echo "No DAR files found!"
  exit 1
fi

echo -e "\nLatest DAR files:"
echo "$latest_dars" | sed 's/^/  - /'

# Generate code
mkdir -p "$OUTPUT_DIR"
echo -e "\nGenerating TypeScript code to $OUTPUT_DIR..."

for dar in $latest_dars; do
  echo "Processing $dar..."
  dpm codegen-js "$DAR_DIR/$dar" -o "$OUTPUT_DIR"
done

echo -e "\n✓ Complete!"