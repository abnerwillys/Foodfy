const forms = [ "recipe", "chef" ]

forms.map(form => {
  let currentForm = document.querySelector(`#delete-${form}`)

  if(currentForm) {
    currentForm.addEventListener('submit', event => {
      const numberRecipes = currentForm.dataset.recipe
      
      if(form == "chef" && numberRecipes != 0) {
        alert("Só é possível deletar caso não tenha nenhuma receita cadastrada para esse chefe!")
        return event.preventDefault()
      }

      const confirmation = confirm('Poxa, tem certeza que quer deletar?')
      if(!confirmation) event.preventDefault()
    })
  }
})