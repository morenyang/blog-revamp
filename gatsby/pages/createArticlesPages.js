const path = require('path')
const siteConfig = require('../../site-config')
const { getPathByPageFactory } = require('../../common/routerHelper')
const pageUtils = require('../../common/pageUtils')

const postPerPage = siteConfig.postPerPage || 60

const getTotalPages = async graphql => {
  const allMarkdownCount = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          fields: {
            collection: { eq: "article" }
            released: { ne: false }
            shadow: { ne: true }
          }
        }
      ) {
        totalCount
      }
    }
  `)
  return pageUtils.getTotalPages(
    allMarkdownCount.data.allMarkdownRemark.totalCount,
    postPerPage
  )
}

const createArticlesPage = ({ createPage, currentPage, totalPages }) => {
  const getPath = getPathByPageFactory('articles')

  createPage({
    path: getPath(currentPage),
    component: path.resolve(`./src/templates/ArticlesPageTemplate.js`),
    context: pageUtils.createPageContext({
      currentPage,
      totalPages,
      elementsPerPage: postPerPage,
      getPathByPage: getPath,
    }),
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
