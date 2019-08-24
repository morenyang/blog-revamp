const createArticlesPages = require('./pages/createArticlesPages')
const createArticlesCategoriesPages = require('./pages/createArticlesCategoriesPages')
const createArticleContentPages = require('./pages/createArticleContentPages')

const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
  await createArticleContentPages({ graphql, actions })
  await createArticlesCategoriesPages({ graphql, actions })
}

module.exports = createPages
