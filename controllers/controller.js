const {Post, Comment, Profile, User} = require('../models/index')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const createdAtWithFormat = require('../helper/helper')

class Controller {
    static home(req, response) {
        const {error, err} = req.query
        response.render('home', {error, err})
    }
    static register(req, response) {
        let errorss =[]
        if(req.query){
            errorss=req.query.errors
        }
        response.render('register', {errorss})
    }
    static postRegister(req, response) {
        const {email, password} = req.body
        User.create({email, password}, {returning : true})
        .then((data) => {
            // console.log(data);
            response.redirect(`register/profile/${data.id}`)
        })
        .catch((err) => {
            if(err.name==="SequelizeValidationError"){
                let errMes = err.errors.map(el=>{
                    return el.message
                })
                response.redirect(`/register?errors=${errMes}`)
            }else{
                response.send(err)
            }
        })
    }
    static registerProfile(req, response) {
        let errorss =[]
        const id = req.params.userId

        if(req.query){
            errorss=req.query.errors
        }
        response.render('registerProfile', {errorss, id})
    }
    static postRegisterProfile(req, response) {
        const {fullName, dateOfBirth, address, img} = req.body
        const id = req.params.userId
        Profile.create({fullName, dateOfBirth, address, img, UserId:id})
        .then(() => {
            console.log(req.params);
            response.redirect('/')
        })
        .catch((err) => {
            if(err.name==="SequelizeValidationError"){
                let errMes = err.errors.map(el=>{
                    return el.message
                })
                response.redirect(`/register/profile/${id}?errors=${errMes}`)
            }else{
                console.log(params);
                response.send(err)
            }
        })
    }
    static getLogin(req, response) {
        const {error, err} = req.query
        response.render('login', {error, err})
    }
    static postLogin(req, response) {
        const {email,password} = req.body
        User.findOne({where:{email}})
        .then(user => {
            if(user){
                const isValidPassword = bcrypt.compareSync(password, user.password)
                if(isValidPassword){
                    req.session.userId = user.id
                    req.session.userIsAdmin = user.isAdmin
                    return response.redirect(`/house/${user.id}`)
                }else{
                    // console.log('tes');
                    const errors = 'Email or password wrong'
                    return response.redirect(`/login?error=${errors}`)
                }
            }else{
                console.log('tes');

                const errors = 'Email or password wrong'
                return response.redirect(`/login?error=${errors}`)
            }
        })
        .catch((err)=>{
            console.log(err)
            response.send(err)
        })
    }
    
    
    static getLogout(req, res){
        req.session.destroy((err) => {
            if(err) res.send(err);
            else{
                res.redirect('/')
            }
        })
    }
    
    static dummy(request, response) {
        const ProfileId = request.params.profileId
        let oneProfileData = null

        const {searchTitle} = request.query

        let option = {
            include: [Profile, {
                model: Comment,
                include: Profile
            }],
            order: [
                ['id', 'DESC']
            ],
            where: {}
        }

        if (searchTitle) {
            option.where.title = {
                [Op.iLike]: `%${searchTitle}%`
            }
        }

        let totalPost = null
        Post.countAllPost()
            .then((sumPost) => {
                totalPost = sumPost[0].dataValues.totalPost
                console.log(totalPost)
                return Profile.findOne({
                    where: {
                        id: ProfileId
                    },
                    include: User
                })
            })
            .then((profileData) => {
                oneProfileData = profileData
                return Post.findAll(option)
            })
            .then((data) => {
                // response.send(oneProfileData)
                response.render("maintest", {data, oneProfileData, createdAtWithFormat, totalPost})
            })
            .catch((err) => {
                response.send(err)
            })
    }

    static dummy1(request, response) {
        const ProfileId = request.params.profileId
        let oneProfileData = null

        const {searchTitle} = request.query

        let option = {
            include: [Profile, {
                model: Comment,
                include: Profile
            }],
            order: [
                ['id', 'DESC']
            ],
            where: {}
        }

        if (searchTitle) {
            option.where.title = {
                [Op.iLike]: `%${searchTitle}%`
            }
        }

        let totalPost = null
        Post.countAllPost()
            .then((sumPost) => {
                totalPost = sumPost[0].dataValues.totalPost
                return Profile.findOne({
                    where: {
                        id: ProfileId
                    },
                    include: User
                })
            })
            .then((profileData) => {
                oneProfileData = profileData
                return Post.findAll(option)
            })
            .then((data) => {
                // response.send(oneProfileData)
                response.render("maintest1", {data, oneProfileData, createdAtWithFormat, totalPost})
            })
            .catch((err) => {
                response.send(err)
            })
    }


    static renderAddPostForm(request, response) {
        const {errorMessage} = request.query
        const profileId = request.params.profileId
        Profile.findByPk(profileId)
        .then((profileData) => {
            response.render("addPost", {profileData, errorMessage})
        })
        .catch((err) => {
            response.send(err)
        })
    }

    static addPost(request, response) {
        const ProfileId = request.params.profileId
        const {title, content, imgUrl} = request.body
        Post.create({title, content, imgUrl, ProfileId})
        .then(() => {
            response.redirect(`/home/${ProfileId}`)
        })
        .catch((err) => {
            if (err.name === 'SequelizeValidationError') {
                const errors = err.errors.map((el) => {
                    return el.message
                })
                response.redirect(`/add/post/${ProfileId}?errorMessage=${errors.join(";")}`)
            } else {
                response.send(err)
            }
        })
}

    static renderEditPostForm(request, response) {
        const postId = request.params.postId
        let onePostData = null
        Post.findOne({
            where: {
                id: postId
            }
        })
        .then((postData) => {
            onePostData = postData
            console.log(postData)
            return Profile.findByPk(postData.ProfileId)
        })
        .then((profileData) => {
            console.log('masuk sini <<<')
            response.render("editPost", {profileData, onePostData})
        })
        .catch((err) => {
            response.send(err)
        })
    }

    static editPost(request, response) {
        const postId = request.params.postId
        const {title, content, imgUrl} = request.body
        let onePostData = null
        Post.findByPk(postId)
        .then((postData) => {
            onePostData = postData
            return Post.update({title, content, imgUrl}, {
                where: {
                    id: postId
                }
            })
        })
        .then(() => {
            response.redirect(`/home/${onePostData.ProfileId}`)
        })
        .catch((err) => {
            response.send(err)
        })
    }

    static addComment(request, response) {
        const PostId = request.params.postId
        const ProfileId = request.params.profileId
        const {comment} = request.body

        Comment.create({PostId, ProfileId, comment})
            .then(() => {
                response.redirect(`/home/${ProfileId}`)
            })
            .catch((err) => {
                response.send(err)
            })
    }


    static deletePost(request, response) {
        const postId = request.params.postId
        let soonDeletedPost = null
        Post.findOne({
            where: {
                id: postId
            }
        })
            .then((data) => {
                soonDeletedPost = data.ProfileId
                console.log(soonDeletedPost, postId, ">>>>")
                return Post.destroy({
                    where: {
                        id: postId
                    }
                })

            })
            .then(() => {
                response.redirect(`/home/${soonDeletedPost}`)
            })
            .catch((err) => {
                console.log(err, "<<<<<<<")
                response.send(err)
            })
    }


    
}

module.exports = Controller