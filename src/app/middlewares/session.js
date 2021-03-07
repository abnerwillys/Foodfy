const User = require('../models/User')

function onlyUsers(req, res, next) {
  if (!req.session.userId) 
    return res.redirect('/session/login')

  next()
}

async function onlyAdm(req, res, next) {
  try {
    const { userId: id } = req.session
  
    const user = await User.findById(id)
    if(!user.is_admin) {
      return res.redirect('/admin/profile')
    }

    next()
  } catch (error) {
    console.error(error)
  }
}

async function isAdmRedirectToAdmRoute(req, res, next) {
  try {
    const { userId: id } = req.session
  
    const user = await User.findById(id)
    if(user.is_admin) {
      return res.redirect('/admin/users')
    }

    next()
  } catch (error) {
    console.error(error)
  }
}

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) 
    return res.redirect('/admin/profile')

  next()
}

module.exports = {
  onlyUsers,
  onlyAdm,
  isAdmRedirectToAdmRoute,
  isLoggedRedirectToUsers,
}
