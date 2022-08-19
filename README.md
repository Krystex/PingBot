### PingBot

```bash
docker build -t pingbot .
docker run --rm --name pingbot -v $PWD/ping.csv:/app/ping.csv pingbot
```
