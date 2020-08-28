const forms = [ "recipe", "chef" ]

forms.map(form => {
  let currentForm = document.querySelector(`#delete-${form}`)

  if(currentForm) {
    currentForm.addEventListener('submit', event => {
      const confirmation = confirm('Poxa, tem certeza que quer deletar?')
      if(!confirmation) event.preventDefault()
    })
  }
})