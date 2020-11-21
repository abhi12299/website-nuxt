const mongoose = require('mongoose')
const logger = require('../logger')

const Schema = mongoose.Schema
const PostSchema = new Schema(
  {
    _id: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    headerImageURL: {
      type: String
      // required: true
    },
    metaDescription: {
      type: String
      // required: true
    },
    metaKeywords: {
      type: [String]
      // required: true
    },
    postedDate: {
      type: Number,
      required: true,
      default: Date.now()
    },
    body: {
      type: String,
      required: true
    },
    published: {
      type: Number,
      default: 0
    },
    isPostPublishable: {
      type: Boolean,
      default: false
    },
    // media attached to the post hosted on the same server
    // includes images and videos
    media: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
)

PostSchema.index({ postedDate: -1 })
PostSchema.index({ title: 'text', metaDescription: 'text' })

PostSchema.statics = {
  async savePost(postObj) {
    try {
      const post = new this(postObj)
      return await post.save()
    } catch (err) {
      logger.error('Cannot create post', err)
      return null
    }
  },
  async publishPost(postId) {
    try {
      return await this.findOneAndUpdate(
        { _id: postId, isPostPublishable: true },
        {
          $set: {
            published: 1
          }
        },
        { new: true }
      )
    } catch (err) {
      logger.error('Cannot publish post', err)
      return null
    }
  },
  async unpublishPost(postId) {
    try {
      return await this.findOneAndUpdate(
        { _id: postId },
        {
          $set: {
            published: 0
          }
        },
        { new: true }
      )
    } catch (err) {
      logger.error('Cannot unpublish post', err)
      return null
    }
  },
  async updatePost(postId, updates) {
    try {
      return await this.findOneAndUpdate(
        { _id: postId },
        {
          $set: {
            ...updates
          }
        },
        { new: true }
      )
    } catch (err) {
      logger.error('Cannot update post', err)
      return null
    }
  },
  async getPosts({
    published,
    sortBy = 'postedDate',
    sortOrder = -1,
    skip = 0,
    limit = 5
  }) {
    try {
      let aggrQuery = []
      const countQuery = {}
      if (published !== 'all' && typeof published !== 'undefined') {
        published = parseInt(published)
        aggrQuery.push({
          $match: { published }
        })
        countQuery.published = published
      }
      if (typeof sortBy !== 'undefined') {
        aggrQuery.push({
          $sort: {
            [sortBy]: sortOrder
          }
        })
      }

      aggrQuery = [
        ...aggrQuery,
        {
          $skip: skip
        },
        {
          $limit: limit
        },
        {
          $project: {
            _id: 1,
            title: 1,
            headerImageURL: 1,
            published: 1,
            postedDate: 1,
            metaKeywords: 1,
            metaDescription: 1,
            isPostPublishable: 1
          }
        }
      ]
      const count = await this.countDocuments(countQuery)
      const posts = await this.aggregate(aggrQuery)
      return { posts, count }
    } catch (err) {
      logger.error('Cannot get posts', err)
      return null
    }
  },
  async getPost({ id, admin }) {
    try {
      const projectQuery = `_id title headerImageURL metaDescription metaKeywords postedDate body published isPostPublishable`

      const findQuery = {
        published: 1,
        _id: id
      }

      if (admin) {
        delete findQuery.published
      }

      return await this.findOne(findQuery, projectQuery)
    } catch (error) {
      logger.error('Cannot get post', error)
      return null
    }
  },
  async setPublished(_id, published) {
    const post = await this.findOneAndUpdate(
      { _id },
      { $set: { published } },
      { new: true }
    )
    return post
  },
  async getSuggestions({ q, sortBy, sortOrder, published }) {
    try {
      published = parseInt(published)
      if (isNaN(published)) {
        published = undefined
      }

      sortOrder = parseInt(sortOrder) || -1
      const matchQuery = {
        $match: {
          $text: {
            $search: q
          }
        }
      }
      if (typeof published !== 'undefined') {
        matchQuery.$match.published = published
      }
      const aggrQuery = [
        matchQuery,
        {
          $sort: {
            score: { $meta: 'textScore' },
            [sortBy]: sortOrder
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            published: 1,
            metaDescription: 1
          }
        }
      ]
      const posts = await this.aggregate(aggrQuery)

      return {
        data: posts,
        error: false
      }
    } catch (error) {
      return { data: [], error: true }
    }
  },
  async getSearchResults({ q, sortBy, sortOrder, published, skip, limit }) {
    try {
      published = parseInt(published)
      if (isNaN(published)) {
        published = undefined
      }

      sortOrder = parseInt(sortOrder) || -1

      const matchQuery = {
        $match: {
          $text: {
            $search: q
          }
        }
      }
      if (typeof published !== 'undefined') {
        matchQuery.$match.published = published
      }

      const aggrQuery = [
        matchQuery,
        {
          $sort: {
            score: { $meta: 'textScore' },
            [sortBy]: sortOrder
          }
        },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            title: 1,
            headerImageURL: 1,
            published: 1,
            postedDate: 1,
            metaKeywords: 1,
            metaDescription: 1
          }
        }
      ]
      const posts = await this.aggregate(aggrQuery)
      const count = await this.countDocuments(matchQuery.$match)

      return {
        data: posts,
        error: false,
        count
      }
    } catch (error) {
      return { data: [], error: true, count: 0 }
    }
  },
  async getLatestPosts({ limit }) {
    try {
      return await this.aggregate([
        {
          $match: {
            published: 1
          }
        },
        {
          $sort: {
            postedDate: -1
          }
        },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            title: 1,
            headerImageURL: 1,
            metaDescription: 1,
            metaKeywords: 1,
            postedDate: 1
          }
        }
      ])
    } catch (error) {
      logger.error('Error in fetching latest posts!', error)
      return []
    }
  },
  async getAllPosts({ skip, limit, keywords }) {
    try {
      const matchQuery = {
        $match: {
          published: 1
        }
      }

      if (Array.isArray(keywords)) {
        // TODO: make this case insensitive
        matchQuery.$match.metaKeywords = {
          $all: keywords
        }
      } else if (typeof keywords === 'string' && keywords.length) {
        matchQuery.$match.metaKeywords = {
          $elemMatch: {
            $regex: keywords,
            $options: 'i'
          }
        }
      }
      const posts = await this.aggregate([
        matchQuery,
        {
          $sort: {
            postedDate: -1
          }
        },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            title: 1,
            headerImageURL: 1,
            metaDescription: 1,
            metaKeywords: 1,
            postedDate: 1,
            published: 1
          }
        }
      ])
      const count = await this.countDocuments(matchQuery.$match)
      return { posts, count }
    } catch (error) {
      logger.error('Error in fetching latest posts!', error)
      return { posts: [], count: 0 }
    }
  }
}

const Post = mongoose.model('post', PostSchema)

module.exports = Post
