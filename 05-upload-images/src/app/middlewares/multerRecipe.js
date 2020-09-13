const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/recipes')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-recipe-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg']
  .find(acceptedFormat => acceptedFormat == file.mimetype)

  if(isAccepted) {
    return cb(null, true)
  } 

  return cb(null, false)
}

module.exports = multer({
  storage,
  fileFilter,
})