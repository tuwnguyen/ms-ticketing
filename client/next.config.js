module.exports = {
  webpack: (config) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
    }
    return config
  },
}