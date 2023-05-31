const Post = require('../models/post')
const Comments = require('../models/comments')

module.exports.create = async function (req, res) {
  try {
    await Post.create({
      content: req.body.content,
      user: req.user._id,
    })

    return res.redirect('back')
  } catch (error) {
    console.log(error, 'error')
    return
  }
}

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id)

    if (post.user == req.user.id) {
      post.remove()

      await Comments.deleteMany({ post: req.params.id })
      return res.redirect('back')
    } else {
      return res.redirect('back')
    }
  } catch (error) {
    console.log(error, 'error')
    return
  }
}