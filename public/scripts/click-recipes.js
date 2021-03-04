const cards = document.querySelectorAll('.card.client')

for(let card of cards) {
  const recipeId = card.dataset.id

  card.addEventListener('click', () => {
    window.location.href = `/recipes/${recipeId}`
  })
}