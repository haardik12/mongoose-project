module.exports.index = function (req, res) {
  return res.json(200, {
    message: 'list of posts from v2',
    posts: [],
  })
}
