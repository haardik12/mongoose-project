const Post = require('../models/post')

module.exports.home = async function (req, res) {
  // post.find({}) this finds every post within the object created earlier and fetch it and the call back function return the needed values on the screen
  //   // this function is an example of without populating the user in the post object

  //   Post.find({}, function (err, posts) {
  //     return res.render('home.ejs', {
  //       title: 'home',
  //       posts: posts,
  //     })
  //   })
  // console.log(req.cookies)

  //populate the user of each post
  let posts = await Post.find({}).populate('user').exec()
  if (posts) {
    return res.render('home', {
      title: 'Home',
      posts: posts,
    })
  }
}
