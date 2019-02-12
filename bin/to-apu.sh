#!/bin/bash

ssh apu "rm -rf /usr/local/www/drio.org/public/cse512/week1/*"
scp -r dist/* apu:/usr/local/www/drio.org/public/cse512/week1/
