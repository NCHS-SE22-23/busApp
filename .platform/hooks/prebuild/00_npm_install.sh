#!/bin/bash
cd /var/app/staging
sudo -u webapp mkdir node_modules
sudo -u webapp npm install --omit=dev