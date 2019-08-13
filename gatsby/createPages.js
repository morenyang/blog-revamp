const createArticlesPages = require('./createArticlesPages')

const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
}

module.exports = createPages
