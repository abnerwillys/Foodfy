function onlyUsers(req, res, next) {
  if (!req.session.user) 
    return res.redirect('/session/login')

  next()
}

async function onlyAdm(req, res, next) {
  const { user } = req.session
  
  if(!user.isAdmin) {
    return res.redirect('/admin/profile')
  }

  next()
}

async function isAdmRedirectToAdmRoute(req, res, next) {
  const { user } = req.session
  
  if(user.isAdmin) {
    return res.redirect('/admin/users')
  }

  next()
}

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.user) 
    return res.redirect('/admin/profile')

  next()
}

module.exports = {
  onlyUsers,
  onlyAdm,
  isAdmRedirectToAdmRoute,
  isLoggedRedirectToUsers,
}
