#!/usr/bin/env bash

if [ "$(whoami)" != "www-data" ]; then
  echo "Do not run this script directly"
  exit 1
fi

build="$(pwd)/build"
if [ ! -d "$build" ]; then
  echo "Build directory could not be found, only run this script from the project root"
  exit 1
fi

cd /var/www/combo # Destination

# Copy in the files
cp -r $build/* ./

echo "Deploy Complete!"
