module.exports = {
  beforeDeploy(config) {
    return new Promise(function _callback(resolve, reject) {
      console.log('beforeDeploy', config)
      resolve()
    })
  },
  afterDeploy(config) {
    return new Promise(function _callback(resolve, reject) {
      console.log('afterDeploy', config)
      resolve()
    })
  },
}
