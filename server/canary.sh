#!/bin/bash

## Script to Deploy the App server to Production ##
redis_ip=$(node provision/digitalocean.js)
echo "[appserver]" > canary_inventory
echo 'node ansible_ssh_host='$app_ip' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa' >> canary_inventory

## Deploy
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i canary_inventory configure_canary.yml --limit "appserver"

redis_ip=$(cat config.json | jq '.REDIS_IP')

#set canary_on = true on redis server
redis-cli -h $redis_ip set canary_on true
