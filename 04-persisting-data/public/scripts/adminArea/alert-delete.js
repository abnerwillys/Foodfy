document
.querySelector("#delete-recipe")
.addEventListener('submit', event => {
  const confirmation = confirm('Poxa, tem certeza que quer deletar essa receita?')
  if(!confirmation) event.preventDefault()
})