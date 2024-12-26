module.exports = {
  apps: [{ name: 'log-analytics', script: './dist/server.js', instances: 'max', exec_mode: 'cluster' }]
}
