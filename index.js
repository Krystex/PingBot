const INTERVAL = 1000  // Execute every second

const schedule = (func) => {
  const exec = () => {
    // Calculate difference to next executing
    diff = INTERVAL - (new Date().getTime() % INTERVAL)
    setTimeout(_ => {
      // Recursively plan next executing
      exec()
      // Round time (because we don't care about milliseconds difference) and execute actual function
      const time = Math.round(new Date().getTime() / INTERVAL) * INTERVAL
      func(time)
    }, diff)
  }
  exec()
}

// Main entrypoint
schedule(time => {
  console.log(time)
})