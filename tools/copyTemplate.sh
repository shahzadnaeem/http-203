#!/bin/bash

set -u

# Usage:
# From anywhere
#
# $ path/to/tools/copyTemplate.sh Target
#
# Copies Template to new name Target

# Parameters
SCRIPT_DIR=$(dirname $0)
TEMPLATE=$(dirname $SCRIPT_DIR)/Template

TARGET=${1:-''}

if [ ! "${TARGET}" ]; then
    echo "ERROR: No target repo name provided!"
    exit 1
fi

# Info
echo "  HERE=${SCRIPT_DIR}"
echo "  TEMPLATE=${TEMPLATE}"
echo "  TARGET=${TARGET}"

# Check for existing
if [ -d "${TARGET}" ]; then
    echo "ERROR: Target already exists - '${TARGET}'. Choose another one"
fi

# Do what's needed

# Copy repo to target
cp -a ${TEMPLATE} ${TARGET}

# Tweak index.html

TARGET_NAME=$(basename ${TARGET})
sed -i -e "'s/Template Document/${TARGET_NAME}/g'" ${TARGET}/index.html

# Done

echo "  '${TARGET}' created from template"
