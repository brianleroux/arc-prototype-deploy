module.exports = {
  beforeDeploy(config) {
    return new Promise(function _callback(resolve, reject) {
      console.log('PLUGIN BEFORE DEPLOY CALLED WITH', config)
      resolve()
    })
  }
}
