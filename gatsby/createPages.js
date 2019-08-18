const createArticlesPages = require('./createArticlesPages')
const createArticleContentPages = require('./createArticleContentPages')
const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
  await createArticleContentPages({ graphql, actions })
}

module.exports = createPages
