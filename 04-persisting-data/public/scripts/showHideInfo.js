//Page recipe-detail scripts
const buttons = document.querySelectorAll('.button-hide')
const boxes = document.querySelectorAll('.box')

for (let button of buttons) {
  button.addEventListener('click', () => {
    const buttonId = button.getAttribute('id')
    const buttonContent = button.innerHTML

    if (buttonContent == "ESCONDER") {
      button.innerHTML = "MOSTRAR"
    } else {
      button.innerHTML = "ESCONDER"
    }

    for (let box of boxes) {
      let boxId = box.getAttribute('id')

      if (boxId == buttonId) {
        box.classList.toggle('hidden')
      }
    }
  })
}