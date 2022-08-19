const { exec } = require("child_process")

const INTERVAL = 1000  // Execute every second

const schedule = (interval, func) => {
  const exec = () => {
    // Calculate difference to next executing
    diff = interval - (new Date().getTime() % interval)
    setTimeout(_ => {
      // Recursively plan next executing
      exec()
      // Round time (because we don't care about milliseconds difference) and execute actual function
      const time = Math.round(new Date().getTime() / interval) * interval
      func(time)
    }, diff)
  }
  exec()
}

const timeParser = (lines) => {
  // Return if not enough lines are supplied
  if (lines.length < 2) return NaN
  // Execute regex
  const reg = /time=(\d*\.\d*)/.exec(lines[1])
  // if regex failed, return NaN
  if ((reg === null) || (reg.length < 2)) return NaN
  else return reg[1]
}

// Main entrypoint
schedule(INTERVAL, timestamp => {
  exec("ping -c1 google.com", (error, stdout, stderr) => {
    // console.error(error)
    const lines = stdout.split("\n")
    const time = timeParser(lines)
    console.log(time)
  })
})