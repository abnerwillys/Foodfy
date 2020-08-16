const fieldsNames = [ "ingredient", "step" ]

function addIngredient( fieldName ) {
  const fieldSelected = document.querySelector(`#${fieldName}s`) 
  const arrayWithAllFields = document.querySelectorAll(`.${fieldName}`) 

  // Realiza um clone do último ingrediente adicionado
  const newField = arrayWithAllFields[arrayWithAllFields.length - 1].cloneNode(true) 

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") {
    alert('Por Favor, só é possível adicionar um novo campo após preencher o último!')
    return false
  }

  // Deixa o valor do input vazio
  newField.children[0].value = "" 
  fieldSelected.appendChild(newField) 
}

fieldsNames.map( field => {
  document
    .querySelector(`.add-${field}`)
    .addEventListener("click", () => {
      addIngredient(field)
    })
})