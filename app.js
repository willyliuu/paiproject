const express = require('express')
const app = express()
const port = 4000
const session = require('express-session')
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(session ({
    secret: 'rahasia perusahaan',
    resave: false,
    saveUninitialized: false,
    cookie: 
    { secure: false,
    sameSite: true}
}))


app.get('/', Controller.home )
app.get('/register', Controller.register)
app.post('/register', Controller.postRegister)
app.get('/register/profile/:userId', Controller.registerProfile)
app.post('/register/profile/:userId', Controller.postRegisterProfile)
app.get('/login', Controller.getLogin)
app.post('/login', Controller.postLogin)
app.get('/logout', Controller.getLogout)


app.use(function (req, res, next) {
    // console.log(req.session.userId)
    if(!req.session.userId){
        const err = 'Harap Login terlebih dahulu'
        res.redirect(`/?err=${err}`)
    } else {
        next()
    }
})


app.get('/house/:profileId', Controller.dummy1)
app.get('/home/:profileId', Controller.dummy)
app.get('/home/:profileId/?baruLogin=true', Controller.dummy)
app.get('/add/post/:profileId', Controller.renderAddPostForm)
app.post('/add/post/:profileId', Controller.addPost)

app.get('/edit/post/:postId', Controller.renderEditPostForm)
app.post('/edit/post/:postId', Controller.editPost)

app.post('/add/comment/post/:postId/profile/:profileId', Controller.addComment)

app.get('/delete/post/:postId', Controller.deletePost)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})



