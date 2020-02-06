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

QueriesSchema.statics = {
  async getQueries() {
    const count = await this.countDocuments({})
    return count
  }
}

const Queries = mongoose.model('queries', QueriesSchema)

module.exports = Queries
