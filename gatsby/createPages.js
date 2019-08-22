const createArticlesPages = require('./createArticlesPages')
const createArticlesCategoriesPages = require('./createArticlesCategoriesPages')
const createArticleContentPages = require('./createArticleContentPages')

const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
  await createArticleContentPages({ graphql, actions })
  await createArticlesCategoriesPages({ graphql, actions })
}

module.exports = createPages
