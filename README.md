# PingBot

**PingBot** is a dependency-less node app which constantly pings some host and saves the response time to a CSV-file.

Configuration through environment variables:
| Environment variable | Default | Purpose
| -------------------- | ------- | -------
| `INTERVAL` | `10000` | Millisecond interval in which ping gets executed
| `PING_COMMAND` | `ping -c1 google.com` | Exact ping command


### Developing locally
```bash
docker network create --driver bridge pingbot-dev
docker run -d --rm --name pingbot-influx-dev \
    --network pingbot-dev\
    -p 8086:8086\
    -e INFLUXDB_ADMIN_USER=username\
    -e INFLUXDB_ADMIN_PASSWORD=password\
    -e INFLUXDB_DB=main\
    influxdb:1.8.10-alpine
docker run --rm --name pingbot-dev -it -v $PWD:/app/ \
    --network pingbot-dev\
    -e INFLUX_HOST=http://pingbot-influx-dev:8086\
    -e INFLUX_USER=username\
    -e INFLUX_PASS=password\
    -e INFLUX_DB=main\
    node:18-alpine sh -c "cd /app;sh"
node index.js  # Execute in container
```
