const express = require('express')
const app = express()
const port = 4000
const session = require('express-session')
const Controller = require('./controllers/controller')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
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




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})


