const body      = document.querySelector('body')
const iconTheme = document.querySelector('.change-theme')

//Check if dark mode was actived before
let statusDarkMode = false

function checkDarkMode () {
    const seeDarkModeActive = document.querySelector('body').getAttribute('class')
    if (seeDarkModeActive == "dark-mode") {
        statusDarkMode = true   
    }

    console.log(statusDarkMode)
}
window.onload = checkDarkMode()


// Theme's change
iconTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode')
    
    if (statusDarkMode) {
        statusDarkMode = false
    } else {
        statusDarkMode = true
    }
    
    const currentIcon = iconTheme.innerHTML
    const sunIcon     = 'wb_sunny'
    const moonIcon    = 'nights_stay'

    console.log(currentIcon)

    if (currentIcon == moonIcon) {
        iconTheme.innerHTML = sunIcon
    } else {
        iconTheme.innerHTML = moonIcon
    }

    console.log(statusDarkMode)
})