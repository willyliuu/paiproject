const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/home/:profileId', Controller.dummy)
app.get('/add/post/:profileId', Controller.renderAddPostForm)
app.post('/add/post/:profileId', Controller.addPost)

app.get('/edit/post/:postId', Controller.renderEditPostForm)
app.post('/edit/post/:postId', Controller.editPost)

app.post('/add/comment/post/:postId/profile/:profileId', Controller.addComment)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})