const createArticlesPages = require('./pages/createArticlesPages')
const createArticlesCategoriesPages = require('./pages/createArticlesCategoriesPages')
const createArticleContentPages = require('./pages/createArticleContentPages')
const createBlogrollPage = require('./pages/createBlogrollPage')

const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
  await createArticleContentPages({ graphql, actions })
  await createArticlesCategoriesPages({ graphql, actions })
  await createBlogrollPage({ actions })
}

module.exports = createPages
