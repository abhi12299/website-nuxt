const logger = require('../logger')
const client = require('./index')

async function addPost(doc) {
  try {
    const resp = await client.index({
      id: doc.id,
      index: 'post',
      body: {
        id: doc.id,
        title: doc.title,
        metaDescription: doc.metaDescription,
        published: doc.published,
        postedDate: doc.postedDate
      }
    })
    logger.info('add post, elastic resp is', resp)
    return { error: false }
  } catch (error) {
    logger.error('Error adding post to elastic search!', error)
    return { error: true }
  }
}

async function updatePost(_id, updates) {
  try {
    const postObj = {
      id: _id,
      index: 'post',
      type: '_doc',
      body: {
        doc: {
          ...updates
        }
      }
    }
    const resp = await client.update(postObj)
    logger.info('update post, elastic resp is', resp)
    return { error: false }
  } catch (error) {
    logger.error('Error updating post in elastic search!', error)
    return { error: true }
  }
}

async function deletePost(_id) {
  try {
    const resp = await client.deleteByQuery({
      index: 'post',
      type: '_doc',
      body: {
        query: {
          match: { id: _id }
        }
      }
    })
    logger.info('Delete post, elastic resp is', resp)
    return { error: false }
  } catch (error) {
    logger.error('Error deleting post from elastic search', error)
    return { error: true }
  }
}

function sanitize(q) {
  return q.replace(/[^\w\s]/, '')
}

async function suggestions({ q, sortBy, sortOrder, published, skip, limit }) {
  try {
    const elasticRequest = {
      index: 'post',
      type: '_doc',
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  title: {
                    query: q,
                    prefix_length: 3,
                    max_expansions: 10,
                    boost: 1.5
                  }
                }
              },
              {
                wildcard: {
                  title: { value: `*${sanitize(q).toLowerCase()}*`, boost: 1.3 }
                }
              },
              {
                match: {
                  metaDescription: {
                    query: q,
                    prefix_length: 3,
                    max_expansions: 10,
                    boost: 1.2
                  }
                }
              },
              {
                wildcard: {
                  metaDescription: {
                    value: `*${sanitize(q).toLowerCase()}*`,
                    boost: 1.1
                  }
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        size: limit || 10,
        from: skip || 0
      }
    }

    if (sortBy) {
      elasticRequest.body.sort = [
        {
          [sortBy]: sortOrder === -1 ? 'desc' : 'asc'
        }
      ]
    }
    if (typeof published !== 'undefined') {
      elasticRequest.body.query.bool.filter = [{ term: { published } }]
    }
    const resp = await client.search(elasticRequest)
    if (resp.hits) {
      return {
        data: resp.hits.hits.map((r) => ({ _id: r._id })),
        error: false,
        count: resp.hits.total.value
      }
    }
    return { data: [], error: false, count: 0 }
  } catch (error) {
    logger.error('Error while getting search suggestions', error)
    return { error: true }
  }
}

module.exports = {
  addPost,
  updatePost,
  deletePost,
  suggestions
}
