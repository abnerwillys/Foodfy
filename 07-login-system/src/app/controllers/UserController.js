
module.exports = {
  list(req, res) {
    return res.render("adminUsers/users-manager")
  },
  create(req, res) {
    return res.render("adminUsers/user-create")
  },
  post(req, res) {},
  edit(req, res) {
    return res.render("adminUsers/user-edit")
  },
  put(req, res) {},
  delete(req, res) {},
}