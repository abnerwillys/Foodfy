const modalOverlay = document.querySelector('.modal-overlay')
const cards = document.querySelectorAll('.card')

for (let card of cards) {
    card.addEventListener('click', function () {
        const modalCard = card.innerHTML
        console.log(card.innerHTML)
        document.querySelector('.modal-card').innerHTML = modalCard
        modalOverlay.classList.add('active')
    })
}

document.querySelector('.close-modal').addEventListener('click', function () {
    modalOverlay.classList.remove('active')
})