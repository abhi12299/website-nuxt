const mongoose = require('mongoose')

const Schema = mongoose.Schema
const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
)

const Subscriber = mongoose.model('subscriber', SubscriberSchema)

module.exports = Subscriber
