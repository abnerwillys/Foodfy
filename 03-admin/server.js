const express  = require('express')
const nunjucks = require('nunjucks')

const server   = express()
const dataRecipes  = require('./data-recipes.js')

for (let recipe of dataRecipes) {
    if (!recipe.information) {
      recipe.information = 'Sem informações adicionais.'
    }
}

const notFoundData = {
    image: "https://neilpatel.com/wp-content/uploads/2019/05/ilustracao-sobre-o-error-404-not-found.jpeg",
    message: "Sorry, that page doesn't exist!"
}

// const theme = {
//     class: "dark-mode",
//     dark_active: false,
//     icon: 'nights_stay'
// }

// const pageRoute = [ "/", "/about", "/recipes", "/recipe-detail", "/not-found" ]

//Nunjucks
server.use(express.static('public'))
server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})


//Routes
server.get('/', (req, res) => {
    return res.render('index', { items: dataRecipes })
})

server.get('/about', (req, res) => { 
    return res.render('about')
})

server.get('/recipes', (req, res) => {
    return res.render('recipes', { items: dataRecipes })
})

server.get('/recipes/:index', (req, res, next) => {
    const recipeId = req.params.index

    if (!dataRecipes[recipeId]) {
        return res.render('not-found', { notFoundData })
    }

    return res.render('recipe-detail', { item: dataRecipes[recipeId] })
})

server.use((req, res) => {
    res.status(404).render('not-found', { notFoundData })
})

//Server
server.listen(5000, () => {
    console.log('Server is Running')
})