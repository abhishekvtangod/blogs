const path = require('path')
const Post = require('../database/models/Post')
 
module.exports = (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, '..', 'public/posts', image.name), (error) => {
        Post.create({
            username: req.session.username,
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            
            res.redirect("/");
        });
    })
}