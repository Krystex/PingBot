const { exec } = require("child_process")
const { open } = require("node:fs/promises")
const process = require("process")

const INTERVAL = process.env.INTERVAL || 10000  // Execute every 10 seconds
const PING_COMMAND = process.env.PING_COMMAND || "ping -c1 google.com"
const MODE = process.env.MODE || "influx"
const INFLUX_HOST = process.env.INFLUX_HOST || "http://localhost:8086"
const INFLUX_DB = process.env.INFLUX_DB || "main"
const INFLUX_USER = process.env.INFLUX_USER
const INFLUX_PASS = process.env.INFLUX_PASS


/**
 * Schedule a function you want to execute in a specific interval
 * @param {number} interval interval in milliseconds
 * @param {Function} function function you want to execute in interval 
 * @param {boolean} precision_seconds specifies if function will be called with current time in seconds (true) of milliseconds (false)
 */
const schedule = (interval, func, precision_seconds=true) => {
  const exec = () => {
    // Calculate difference to next executing
    diff = interval - (new Date().getTime() % interval)
    setTimeout(_ => {
      // Recursively plan next execution
      exec()
      // Calculate and round time (because we don't care about milliseconds difference)
      let time = Math.round(new Date().getTime() / interval) * interval
      // If time should be returned in seconds, divide it by 1000
      if (precision_seconds) time = Math.round(time / 1000)
      // Call used-defined function
      func(time)
    }, diff)
  }
  exec()
}

/**
 * Function which parses the ping command
 * @param {string} stdout output of ping command
 * @returns {number} response time
 */
const pingParser = (stdout) => {
  const lines = stdout.split("\n")
  // Return if not enough lines are supplied
  if (lines.length < 2) return NaN
  // Execute regex
  const reg = /time=(\d*\.\d*)/.exec(lines[1])
  // if regex failed, return -1
  if ((reg === null) || (reg.length < 2)) return -1
  else return parseFloat(reg[1])
}

const saveToCSV = async (timestamp, time) => {
  const f = await open("./ping.csv", "a")
  await f.appendFile(`${timestamp},${time}\n`)
  await f.close()
}

const saveToInflux = async (timestamp, time) => {
  // Thanks to https://github.com/robinmanuelthiel/speedtest/ :)
  const url = `${INFLUX_HOST}/write?db=${INFLUX_DB}&precision=s&u=${INFLUX_USER}&p=${INFLUX_PASS}`
  let payload = `ping response_time=${time} ${timestamp}`
  if (time === -1) {
    // If endpoint is not reachable, set `error` tag for influx
    payload = `ping,error=error response_time=-1 ${timestamp}`
  }
  const res = await fetch(url, {method: "POST", body: payload})
  if (res.body !== null) {
    const json = await res.json()
    console.error(json)
  }
}

process.on("SIGINT", _ => process.exit())

// Main entrypoint
const main = () => {
  // TODO: Check if mode is correct
  console.log("Started pingbot")
  schedule(INTERVAL, timestamp => {
    exec(PING_COMMAND, async (error, stdout, _stderr) => {
      if (error) console.error(error)
      const time = pingParser(stdout)

      if (MODE === "csv") await saveToCSV(timestamp, time)
      else if (MODE === "influx") await saveToInflux(timestamp, time)
    })
  })
}
main()