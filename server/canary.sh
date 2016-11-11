#!/bin/bash

## Script to Deploy the App server to Production ##
app_ip=$(node AWS_main.js | tr -d '"')
echo "[appserver]" > canary_inventory
echo 'node ansible_ssh_host='$app_ip' ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./key/privateKey.key' >> canary_inventory

## Deploy
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i canary_inventory configure_canary.yml --limit "appserver"

redis_ip=$(cat config.json | jq '.REDIS_IP')

#set canary_on = true on redis server
redis-cli -h redis_ip set canary_on true
