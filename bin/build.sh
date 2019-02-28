#!/bin/bash

npm run build
echo "DRD> Copying src to dist/ ..."
cp -r ./src dist/ && echo "DRD> It went well!"
