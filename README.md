# PingBot

**PingBot** is a dependency-less node app which constantly pings some host and saves the response time to a CSV-file.

Configuration through environment variables:
| Environment variable | Default | Purpose
| -------------------- | ------- | -------
| `INTERVAL` | `10000` | Millisecond interval in which ping gets executed
| `PING_COMMAND` | `ping -c1 google.com` | Exact ping command

```bash
# Build and run PingBot locally
touch ping.csv
docker build -t pingbot .
docker run --rm --name pingbot -v $PWD/ping.csv:/app/ping.csv pingbot
```
