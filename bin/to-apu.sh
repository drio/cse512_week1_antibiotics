#!/bin/bash

DST="/usr/local/www/drio.org/public/v/cse512_week1_antibiotics"
ssh apu "rm -rf $DST; mkdir -p $DST"
scp -r dist/* apu:$DST/
