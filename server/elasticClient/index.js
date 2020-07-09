const elasticSearch = require('elasticsearch')
const secrets = require('../../secrets')

const elasticClient = new elasticSearch.Client({
  hosts: secrets.ELASTIC_URL,
  log: 'info'
})

module.exports = elasticClient
