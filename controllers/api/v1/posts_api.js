const Post = require('../../../models/post')
const Comments = require('../../../models/comments')

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    })

  return res.json(200, {
    message: 'list of posts',
    posts: posts,
  })
}

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id)
    if (post.user == req.user.id) {
      post.remove()
      await Comments.deleteMany({ post: req.params.id })

      // req.flash('success', 'Post Deleted!')
      return res.json(200, {
        message: 'post deleted successfully',
      })
    } else {
      return res.json(401, {
        message: 'you cannot delete this post',
      })
    }
  } catch (error) {
    return res.json(500, {
      message: 'internal server error',
    })
  }
}
