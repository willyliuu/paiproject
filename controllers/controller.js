const {Post, Comment, Profile, User} = require('../models/index')

class Controller {
    static dummy(request, response) {
        const ProfileId = request.params.profileId
        let oneProfileData = null

        Profile.findByPk(ProfileId)
            .then((profileData) => {
                oneProfileData = profileData
                return Post.findAll({
                    include: [Profile, {
                        model: Comment,
                        include: Profile
                    }],
                    order: [
                        ['id', 'DESC']
                    ]
                })
            })
            .then((data) => {
                // response.send(data)
                response.render("maintest", {data, oneProfileData})
            })
            .catch((err) => {
                response.send(err)
            })
    }

    static renderAddPostForm(request, response) {
        const profileId = request.params.profileId
        Profile.findByPk(profileId)
            .then((profileData) => {
                response.render("addPost", {profileData})
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
                response.send(err)
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
}

module.exports = Controller