const forms = [
  {
    name: "recipe",
    message: "essa receita"
  },
  {
    name: "chef",
    message: "esse chef"
  },
  {
    name: "user",
    message: "esse usuário"
  }
]

forms.map(form => {
  if(form.name === 'user') {
    const allFormUsers = document.querySelectorAll(`form.delete-${form.name}`)

    if(allFormUsers) {
      allFormUsers.forEach(formItem => {
        formItem.addEventListener('submit', event => {    
          const confirmation = confirm(`Tem certeza que quer deletar ${form.message} ?`)
          if(!confirmation) event.preventDefault()
        })
      })
    }
  }

  const currentForm = document.querySelector(`#delete-${form.name}`)

  if(currentForm) {
    currentForm.addEventListener('submit', event => {
      const numberRecipes = currentForm.dataset.recipe
      
      if(form.name == "chef" && numberRecipes != 0) {
        alert("Só é possível deletar caso não tenha nenhuma receita cadastrada para esse chefe!")
        return event.preventDefault()
      }

      const confirmation = confirm(`Tem certeza que quer deletar ${form.message} ?`)
      if(!confirmation) event.preventDefault()
    })
  }
})