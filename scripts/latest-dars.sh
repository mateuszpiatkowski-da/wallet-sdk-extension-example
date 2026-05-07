#!/bin/bash
set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DAR_DIR="$SCRIPT_DIR/../dar"

# Find all DARs, group by package name, keep only the latest version
latest_dars=$(
  ls "$DAR_DIR"/*.dar 2>/dev/null | 
  grep -v "Terms" |
  sed 's|.*/||' |  # Get basename
  sort -t'-' -k1,1 -k2,2V |  # Sort by package name and version
  awk -F'-v' '{pkg=$1} pkg!=prev {print; prev=pkg}' RS='\n'
)

echo "$latest_dars"