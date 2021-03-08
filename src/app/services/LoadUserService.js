const User = require('../models/User')

const LoadService = {
  load(service, filters) {
    this.filters = filters
    return this[service]()
  },
  async user() {
    try {
      const user = await User.findOne(this.filters)

      return user
    } catch (error) {
      console.error(error)
    }
  },
  async users() {
    try {
      const users = (await User.findAll())
      .sort((a,b) => a.name.localeCompare(b.name))

      return users
    } catch (error) {
      console.error(error)
    }
  },
}

module.exports = LoadService