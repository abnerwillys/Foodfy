function deleteField( event, containerFields ) {
  const buttonsDelete = document.getElementsByClassName('delete-field') //Array com todos botões de excluir
  const target = event.target //Pega o elemento que foi clicado
  const parentTarget = target.parentNode //Pega o pai do elemento que foi clicado
   
  for (let button of buttonsDelete) { //Laço para verificar se o elemento clicado é um dos botões de excluir
    if (target == button) {           //se for um dos botões entra no if pedindo uma confirmação para o caso de clicar por engano
      const confirmationDelete = confirm('Tem certeza que deseja Deletar?')

      if (!confirmationDelete) {
        event.preventDefault() //Se false(se foi engano) cancela o evento
      } else {
        containerFields.removeChild(parentTarget) //Se true remove o campo "filho" do campo "pai" especificado
      }
    }
  }  
}

function addNewField( fieldName ) {
  const fatherField = document.querySelector(`#${fieldName}s`) 
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
  fatherField.appendChild(newField) 
}

const fieldsGroups = [ "ingredient", "step" ]

fieldsGroups.map( field => {
  document
    .querySelector(`.add-${field}`)
    .addEventListener("click", () => {
      addNewField(field)
    })

  const containerFields = document.getElementById(`${field}s`)
  containerFields.addEventListener('click', (event) => {
    deleteField(event, containerFields)
  })
})