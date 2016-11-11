# Script to Monitor Health of Instance
# Sends Emails on Increased Load

# Globals
CPU_LIMIT=50
MEM_LIMIT=80
ADMIN_EMAIL=""
redis_ip=$(cat config.json | jq '.REDIS_IP')
# Monitor
# Reference Taken from : # http://stackoverflow.com/questions/9229333/how-to-get-overall-cpu-usage-e-g-57-on-linux
while [ true ]; do
		# CPU Usage
		cpu_usage=$(top -bn1 | grep "Cpu(s)" | cut -d ',' -f4 | sed "s/\([0-9.]*\)* id/\1/" | sed -r "s/\s+//")
		#cpu_usage = $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
		cpu_usage=${cpu_usage/.*}
		cpu_usage=$((100-cpu_usage))
		if [ $cpu_usage -gt $CPU_LIMIT ]; then
			echo $cpu_usage

			node sendSMS.js c
		fi

		# Memory Usage
		mem_use=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2 }')
		mem_use=${mem_use/.*}
		if [ $mem_use -gt $MEM_LIMIT ]; then
			echo $mem_use
			echo $MEM_LIMIT

			node sendSMS.js m
		fi
done

# End of Script
