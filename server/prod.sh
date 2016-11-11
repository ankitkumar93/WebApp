#!/bin/bash
## Script to Deploy the Redis server to Production ##
redis_ip=$(node provision/digitalocean.js)
echo '{"REDIS_IP":"'$redis_ip'"}' > config.json
echo "[redisserver]" > inventory
echo 'node1 ansible_ssh_host='$redis_ip' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa' >> inventory

# Script to Deploy the Proxy server to Production ##
proxy_ip=$(node provision/digitalocean.js)
echo "[proxyserver]" >> inventory
echo 'node2 ansible_ssh_host='$proxy_ip' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa' >> inventory

# Script to Deploy the App server to Production ##
app_ip=$(node provision/digitalocean.js)
echo "[appserver]" >> inventory
echo 'node3 ansible_ssh_host='$app_ip' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa' >> inventory

sleep 60

## Deploy
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory configure_prod.yml