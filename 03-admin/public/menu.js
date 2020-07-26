const menu = document.querySelectorAll(".box-menu a")
const url  = window.location.pathname

window.onload = () => {
    for (link of menu) {
        const linkPath = link.getAttribute("href")
        if (url == linkPath) {
            link.classList.add("active")
        }
    }
}

//Script for apply a style in the link that page is selected