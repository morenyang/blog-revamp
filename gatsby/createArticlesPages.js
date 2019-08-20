const path = require('path')
const siteConfig = require('../site-config')
const { getPathByPageFactory } = require('../router-helper')

const postPerPage = siteConfig.postPerPage || 60

const getPath = getPathByPageFactory('articles')

const getTotalPages = async graphql => {
  const allMarkdownCount = await graphql(`
    {
      allMarkdownRemark(filter: { fields: { collection: { eq: "article" } } }) {
        totalCount
      }
    }
  `)
  return Math.ceil(
    allMarkdownCount.data.allMarkdownRemark.totalCount / postPerPage
  )
}

const createPageContext = (currentPage, totalPages) => ({
  totalPages,
  currentPage,
  pageSize: postPerPage,
  postsOffset: currentPage * postPerPage,
  prevPath: getPath(currentPage - 1),
  nextPath: getPath(currentPage + 1),
  hasPrev: currentPage !== 0,
  hasNext: currentPage !== totalPages - 1,
})

const createArticlesPage = ({ createPage, currentPage, totalPages }) => {
  createPage({
    path: getPath(currentPage),
    component: path.resolve(`./src/templates/ArticlesPageTemplate.js`),
    context: createPageContext(currentPage, totalPages),
  })
}

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const totalPages = await getTotalPages(graphql)

  for (let i = 0; i < totalPages; i++) {
    createArticlesPage({ createPage, currentPage: i, totalPages })
  }
}

module.exports = createPages
