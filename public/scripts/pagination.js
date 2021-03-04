function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLast = currentPage == 1 || currentPage == totalPages

    const pageBeforeSelectedPage = currentPage >= selectedPage - 1
    const pageAfterSelectedPage  = currentPage <= selectedPage + 1

    if (totalPages > 7) {
      if(firstAndLast || pageBeforeSelectedPage && pageAfterSelectedPage) {
      
        if (oldPage && currentPage - oldPage >  2) pages.push('...')
  
        if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1)
    
        pages.push(currentPage)
        oldPage = currentPage
      }
    } else if (totalPages > 5) {
      if(firstAndLast || pageBeforeSelectedPage && pageAfterSelectedPage) {
      
        if (oldPage && currentPage - oldPage >  2) pages.push('...')
  
        if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1)
  
        pages.push(currentPage)
        oldPage = currentPage
      }
    } else {
      pages.push(currentPage)
    }
  }
  
  return pages
}

function createPagination(pagination) {
  const selectedPage = +pagination.dataset.page
  const totalPages   = +pagination.dataset.total
  const filter       = pagination.dataset.filter

  console.log(filter)

  const pages = paginate(selectedPage, totalPages)

  let elements = ""

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        if (page == selectedPage) {
          elements += `<a class="selected" href="?page=${page}&filter=${filter}">${page}</a>`
        } else {
          elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
        }
      } else {
        if (page == selectedPage) {
          elements += `<a class="selected" href="?page=${page}">${page}</a>`
        } else {
          elements += `<a href="?page=${page}">${page}</a>`
        }
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) createPagination(pagination)