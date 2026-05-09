module.exports = {
  apps: [
    {
      name: 'url-shortener-1',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    },
    {
      name: 'url-shortener-2',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3002
      }
    },
    {
      name: 'url-shortener-3',
      script: 'server.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      }
    }
  ]
}