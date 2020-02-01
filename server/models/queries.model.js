const mongoose = require('mongoose')

const Schema = mongoose.Schema
const QueriesSchema = new Schema(
  {
    query: {
      type: {
        email: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        message: {
          type: String,
          required: true
        },
        when: {
          type: Number,
          default: Date.now()
        }
      },
      required: true
    }
  },
  { timestamps: true }
)

const Queries = mongoose.model('queries', QueriesSchema)

module.exports = Queries
