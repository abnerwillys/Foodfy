function onlyUsers(req, res, next) {
  if (!req.session.userId) 
    return res.redirect('/session/login');

  next();
}

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) 
    return res.redirect('/admin/profile');

  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToUsers,
};
