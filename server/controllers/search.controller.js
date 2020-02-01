const Router = require('express').Router
const { validateSearchSuggestions, validateSearch } = require('../validations')
const logger = require('../logger')

const Post = require('../models/post.model')

const searchRouter = Router()

searchRouter.get('/suggestions', async (req, res) => {
  const err = validateSearchSuggestions(req.query)

  if (err) {
    logger.error('Query params validation fail on /suggestions:', {
      err,
      query: req.query
    })
    return res
      .status(400)
      .json({ error: true, msg: 'Incorrect info submitted!' })
  }

  let {
    published = 'all' // by default all posts will be searched
  } = req.query
  const { q, sortBy = 'postedDate', sortOrder = '-1' } = req.query
  if (!req.admin) {
    published = '1' // ignore published query
  }

  const { data, error } = await Post.getSuggestions({
    q,
    sortBy,
    sortOrder,
    published
  })
  return res.json({ error, data })
})

searchRouter.get('/search', async (req, res) => {
  const error = validateSearch(req.query)
  if (error) {
    logger.error('Query params validation fail on /search:', {
      error,
      query: req.query
    })
    return res
      .status(400)
      .json({ error: true, msg: 'Incorrect info submitted!' })
  }

  let {
    limit = 10,
    skip = 0,
    published = 'all' // by default all posts will be searched
  } = req.query
  const { q, sortOrder = '-1', sortBy = 'postedDate' } = req.query

  if (!req.admin) {
    published = '1' // ignore published query
  }

  skip = parseInt(skip)
  limit = parseInt(limit)

  const { data, error: err, count } = await Post.getSearchResults({
    q,
    sortBy,
    sortOrder,
    published,
    skip,
    limit
  })
  return res.json({ error: err, data, count })
})

module.exports = searchRouter
