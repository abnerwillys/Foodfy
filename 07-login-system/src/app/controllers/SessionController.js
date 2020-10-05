module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {},
  logout(req, res) {},
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  forgot(req, res) {},
  resetForm(req, res) {
    return res.render("session/reset-password")
  },
  reset(req, res) {},
}