{
  let createComment = function () {
    let newComment = $('#comment-create').each(function () {
      newComment.submit(function (e) {
        e.preventDefault()

        $.ajax({
          type: 'post',
          url: '/comments/create',
          data: newComment.serialize(),
          success: function (data) {
            let printComment = newCommentDom(data.data.comment)
            $(`#post-comments-${data.data.comments.post}`).prepend(printComment)
          },
          error: function (error) {
            console.log(error.responseText)
          },
        })
      })
    })
  }

  let newCommentDom = function (comment) {
    return $(`<p>

      <small>
      <a href="/comments/destroy/"comment-${comment._id}">X</a>
      </small>
      ${comment.content}
      <br />
      <small> ${comment.user.name} </small>
      </p>`)
  }

  createComment()
}
