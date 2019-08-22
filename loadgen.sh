#!/bin/bash
if [ "$#" -ne 3 ]; then
    echo "Specify the hostname, port and sleep time, for example: ./loadgen.sh adc1ada716a8211e9a59d060b5087792-676580527.eu-west-1.elb.amazonaws.com 3000 0.2"
    exit
fi

HOST=$1
PORT=$2
SLEEP=$3
USER_AGENT="Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Mobile Safari/537.36"
  
for i in {1..10000}
do
        echo -n "$i - "
        /usr/bin/time curl -A "$USER_AGENT" http://$HOST:$PORT/action &
        sleep $SLEEP
done
