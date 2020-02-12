const Router = require('express').Router

const Post = require('../models/post.model')
const logger = require('../logger')

const sitemapRouter = Router()

sitemapRouter.get('/getPosts', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          published: 1
        }
      },
      {
        $project: {
          _id: 1
        }
      }
    ])
    res.json({
      data: posts.map((p) => `/post/${p._id}`)
    })
  } catch (err) {
    logger.error('Query cannot be saved:', err)
    res
      .status(400)
      .json({ msg: 'Sitemap posts cannot be obtained.', error: true })
  }
})

module.exports = sitemapRouter
