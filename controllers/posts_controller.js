const Post = require('../models/post')
const Comments = require('../models/comments')

module.exports.create = async function (req, res) {
  try {
    console.log(req.body)
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    })

    if (req.xhr) {
      console.log('hello')
      post = await post.populate('user')
      return res.status(200).json({
        data: {
          post: post,
          postedBy: req.user.name,
        },
        message: 'post created!',
      })
    }

    // req.flash('success', 'Post Created!')
    return res.redirect('back')
  } catch (error) {
    req.flash('error', error)
    return res.redirect('back')
  }
}

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id)
    if (post.user == req.user.id) {
      post.remove()
      await Comments.deleteMany({ post: req.params.id })

      if (req.xhr) {
        // req.flash('success', 'Post Deleted!')
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: 'post deleted!',
        })
      }

      // req.flash('success', 'Post Deleted!')
      return res.redirect('back')
    } else {
      req.flash('error', 'You cannot delete this post.')
      return res.redirect('back')
    }
  } catch (error) {
    console.log(error, 'error')
    req.flash('error', error)
    return res.redirect('back')
  }
}
