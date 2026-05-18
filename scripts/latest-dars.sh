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
  sort -V |  # Version sort the entire filename
  awk -F'-v' '{
    pkg = $1
    latest[pkg] = $0
  }
  END {
    for (pkg in latest) {
      print latest[pkg]
    }
  }' |
  sort
)

echo "$latest_dars"