const User = require('../../app/models/User')
const { hash } = require('bcryptjs')

async function createUser() {
  const password = await hash('12345', 8)

  const firstUser = {
    name: 'Maykao Brito',
    email: 'maykao.da.massa@rocketseat.com.br',
    password,
    is_admin: true
  }

  await User.create(firstUser)
}

async function init() {
  await createUser()
}

init()