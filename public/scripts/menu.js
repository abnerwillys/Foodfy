//Script for apply a style in the link that page is selected
const menu = document.querySelectorAll(".box-menu .menu a")
const url  = window.location.pathname

window.onload = () => {
  for (link of menu) {
    const linkPath = link.getAttribute("href")

    if (url.includes(linkPath) && linkPath != "/") {
      link.classList.add("active")
    }

    if (linkPath == url && "/") {
      link.classList.add("active")
    }

    if (url.includes('profile') && linkPath === '/admin/users') {
      link.classList.add("active")
    }
  }
}