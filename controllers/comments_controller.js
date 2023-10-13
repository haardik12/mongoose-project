const Comment = require('../models/comments')
const Post = require('../models/post')

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post)
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      })

      post.comments.push(comment)
      post.save()

      if (req.xhr) {
        comment = await comment.populate('user')
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: 'comment created!',
        })
      }

      req.flash('success', 'Comment added successfully')

      return res.redirect('back')
    }
  } catch (err) {
    req.flash('error', err)
    console.log(err)
  }
}

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findOne({ _id: req.params.id })
    if (comment.user == req.user.id) {
      let postId = comment.post

      comment.remove()

      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      })

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: 'Post deleted',
        })
      }

      req.flash('success', 'Comment deleted successfully!')

      return res.redirect('back')
    } else {
      // req.flash('error', 'Unauthorized')
      return res.redirect('back')
    }
  } catch (err) {
    // req.flash('error', err)
    console.log(err)
    // return res.redirect('back')
  }
}
