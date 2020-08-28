const body      = document.querySelector('body')
const iconTheme = document.querySelector('.change-theme')


// Theme's change
iconTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode')
    
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