const { Profile, User } = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static home(req, response) {
        response.render('home')
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
                response.redirect(`/register?errors=${errMes}`)
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
        // console.log('tes');
        const {email,password} = req.body
        User.findOne({where:{email}})
        .then(user => {
            // console.log(User);
            if(user){
                // console.log('tes <<<<<<');
                // console.log(user);
                const isValidPassword = bcrypt.compareSync(password, user.password)
                // console.log(isValidPassword);
                if(isValidPassword){
                    console.log(req.session, 'atas');
                    console.log('tesssssss');
                    req.session.userId = user.id
                    req.session.userIsAdmin = user.isAdmin
                    console.log(req.session, 'bawah');
                    // console.log('tes');
                    return response.redirect(`/home/${user.id}`)
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
}

module.exports = Controller