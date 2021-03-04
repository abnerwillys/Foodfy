function checkPage() {
  const pagesAllowed = {
    pageName: "recipes",
    variant: ["create", "edit"]
  } 
  const path = window.location.pathname

  const constraintOne = path.includes(pagesAllowed.pageName)
  const constraintTwo = pagesAllowed.variant.some(page => path.includes(page))

  if (constraintOne && constraintTwo) return true
}

function addNewField( fieldName ) {
  const fatherField = document.querySelector(`#${fieldName}s`) 
  const arrayWithAllFields = document.querySelectorAll(`.${fieldName}`) 

  const newField = arrayWithAllFields[arrayWithAllFields.length - 1].cloneNode(true) 

  if (newField.children[0].value == "") {
    alert('Por Favor, só é possível adicionar um novo campo após preencher o último!')
    return false
  }

  newField.children[0].value = "" 
  fatherField.appendChild(newField) 
}

function deleteField( event, containerFields ) {
  const buttonsDelete = document.getElementsByClassName('delete-field')
  const target = event.target
  const parentTarget = target.parentNode
   
  for (let button of buttonsDelete) {
    if (target == button) {          
      const confirmationDelete = confirm('Tem certeza que deseja Deletar?')

      if (!confirmationDelete) {
        event.preventDefault()
      } else {
        containerFields.removeChild(parentTarget)
      }
    }
  }  
}

const fieldsGroups = [ "ingredient", "step" ]

if (checkPage()) {
  fieldsGroups.forEach(field => {
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
}