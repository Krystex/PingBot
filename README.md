# PingBot

**PingBot** is a dependency-less node app which constantly pings some host and saves the response time to a CSV-file.

```bash
touch ping.csv
docker build -t pingbot .
docker run --rm --name pingbot -v $PWD/ping.csv:/app/ping.csv pingbot
```
