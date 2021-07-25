module.exports = (req, res) => {
    req.session.destroy(() => {
        // if(err){
        //     res.redirect('/')
        // }
        // res.clearCookie(Session_name)
        // res.redirect('/login')
        res.redirect('/')
    })
}