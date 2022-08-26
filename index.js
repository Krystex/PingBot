const { exec } = require("child_process")
const { open } = require("node:fs/promises")
const process = require("process")

const INTERVAL = process.env.INTERVAL || 10000  // Execute every 10 seconds
const PING_COMMAND = process.env.PING_COMMAND || "ping -c1 google.com"

/**
 * Schedule a function you want to execute in a specific interval
 * @param {number} interval interval in milliseconds
 * @param {Function} function function you want to execute in interval 
 */
const schedule = (interval, func) => {
  const exec = () => {
    // Calculate difference to next executing
    diff = interval - (new Date().getTime() % interval)
    setTimeout(_ => {
      // Recursively plan next execution
      exec()
      // Calculate and round time (because we don't care about milliseconds difference)
      const time = Math.round(new Date().getTime() / interval) * interval
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
  // if regex failed, return NaN
  if ((reg === null) || (reg.length < 2)) return NaN
  else return reg[1]
}

process.on("SIGINT", _ => process.exit())

// Main entrypoint
console.log("Started pingbot")
schedule(INTERVAL, timestamp => {
  exec(PING_COMMAND, async (error, stdout, stderr) => {
    if (error) console.error(error)
    const time = pingParser(stdout)
    const f = await open("./ping.csv", "a")
    await f.appendFile(`${timestamp},${time}\n`)
    await f.close()
  })
})
