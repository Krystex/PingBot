const INTERVAL = 1000  // Execute every second

const schedule = (func) => {
  const exec = () => {
    ms = new Date().getTime() % INTERVAL
    setTimeout(_ => {
      exec()
      func()
    }, INTERVAL - ms)
  }
  exec()
}

schedule(_ => {
  console.log(new Date().getTime())
})