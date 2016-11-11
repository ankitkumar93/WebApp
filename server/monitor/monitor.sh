# Script to Monitor Health of Instance
# Sends Emails on Increased Load

# Globals
CPU_LIMIT=50
MEM_LIMIT=80
# Monitor
# Reference Taken from : # http://stackoverflow.com/questions/9229333/how-to-get-overall-cpu-usage-e-g-57-on-linux
# redis_ip=$(cat config.json | jq '.REDIS_IP' | tr -d '"')
while [ true ]; do
		# CPU Usage
		cpu_usage=$(top -bn1 | grep "Cpu(s)" | cut -d ',' -f4 | sed "s/\([0-9.]*\)* id/\1/" | sed -r "s/\s+//")
		cpu_usage=${cpu_usage/.*}
		if [ $cpu_usage -gt $CPU_LIMIT ]; then
			echo $cpu_usage

			node sendMail.js c

			_autoscale

			exit
		fi

		# Memory Usage
		mem_use=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2 }')
		mem_use=${mem_use/.*}
		if [ $mem_use -gt $MEM_LIMIT ]; then
			echo $mem_use
			echo $MEM_LIMIT

			node sendMail.js m

			exit
		fi
done

_autoscale() {
	app_ip=$(node provision/digitalocean.js)
	echo "[appserver]" > inventory
	echo 'node ansible_ssh_host='$app_ip' ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa' >> inventory

	sleep 120

	cp '../config.json' './config.json'

	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory configure_prod.yml --limit "appserver"
}

# End of Script
