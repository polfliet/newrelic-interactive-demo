#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Specify the hostname, for example: ./loadgen.sh 3000"
    exit
fi

HOST=192.168.99.100
PORT=$1
  
for i in {1..10000}
do
        echo -n "$i - "
        /usr/bin/time curl http://$HOST:$PORT/action &
        sleep 0.05
done
