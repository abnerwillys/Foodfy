const inputCheckboxIsAdmin = document.querySelector('#user-form.user-edit #is_admin')
const inputHiddenIsAdmin   = document.querySelector('#user-form.user-edit #check_is_admin')

if (inputCheckboxIsAdmin) {
  inputCheckboxIsAdmin.addEventListener('change', (e) => {
    inputHiddenIsAdmin.value = e.target.checked
  })
}