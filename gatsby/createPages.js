const createArticlesPages = require('./createArticlesPages')
const createArticleContentPage = require('./createArticleContentPage')
const createPages = async ({ graphql, actions }) => {
  await createArticlesPages({ graphql, actions })
  await createArticleContentPage({ graphql, actions })
}

module.exports = createPages
