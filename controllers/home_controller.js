const { use } = require('passport')
const Post = require('../models/post')
const User = require('../models/users')

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

  try {
    let posts = await Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      })

    let users = await User.find({})

    return res.render('home', {
      title: 'Home',
      posts: posts,
      all_users: users,
    })
  } catch (error) {
    console.log(error, 'error')
    return
  }
}
