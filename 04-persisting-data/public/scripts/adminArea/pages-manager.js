//Page recipes scripts
const cards = document.querySelectorAll('.view-details')
const currentURL = location.pathname

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', () => {
    window.location.href = `${currentURL}/${i}`
  })
}