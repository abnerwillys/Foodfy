const PhotoUploadChef = {
  span: "",  
  imageSent() {
    if (PhotoUploadChef.span == "") {
      const divFather = document.querySelector('.wrapper-photo')

      PhotoUploadChef.span = document.createElement('span')
      PhotoUploadChef.span.classList.add('material-icons')
      PhotoUploadChef.span.innerHTML = 'check'

      divFather.appendChild(PhotoUploadChef.span)
    }

    PhotoUploadChef.removeOldPhoto()
  },
  removeOldPhoto() {
    const oldFile     = document.querySelector('input[name="current_file"]')
    const removedFile = document.querySelector('input[name="removed_file"]')

    removedFile.value = oldFile.value
  }
}