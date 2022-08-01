### PingMonitor

```bash
docker build -t pingmonitor .
docker run --rm pingmonitor \
    -v $PWD/ping.csv:/app/ping.csv
```