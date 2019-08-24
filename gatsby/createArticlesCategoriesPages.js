const path = require('path')
const siteConfig = require('../site-config')
const _ = require('lodash')

const { getPathByPageFactory } = require('../router-helper')

const getPath = (category, page) => {
  return getPathByPageFactory(`category/${_.kebabCase(category)}`)(page)
}

const postPerPage = siteConfig.postPerPage || 60

const getCategoriesAndCounts = async graphql => {
  const categoriesAndCounts = await graphql(`
    {
      allMarkdownRemark(filter: { fields: { collection: { eq: "article" } } }) {
        group(field: fields___categories___category) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  return categoriesAndCounts.data.allMarkdownRemark.group.map(item => ({
    ...item,
    totalPages: Math.ceil(item.totalCount / postPerPage),
  }))
}

const createPageContext = (category, currentPage, totalPages) => {
  return {
    totalPages,
    currentPage,
    pageSize: postPerPage,
    postsOffset: currentPage * postPerPage,
    prevPath: getPath(currentPage - 1),
    nextPath: getPath(currentPage + 1),
    hasPrev: currentPage !== 0,
    hasNext: currentPage !== totalPages - 1,
    category: category,
  }
}

const createCategoryPage = ({
  createPage,
  currentPage,
  totalPages,
  category,
}) => {
  createPage({
    path: getPath(category, currentPage),
    component: path.resolve(
      `./src/templates/ArticlesCategoriesPageTemplate.js`
    ),
    context: createPageContext(category, currentPage, totalPages),
  })
}

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const categoriesAndCounts = await getCategoriesAndCounts(graphql)
  categoriesAndCounts.forEach(({ fieldValue: category, totalPages }) => {
    for (let i = 0; i < totalPages; i++) {
      createCategoryPage({ createPage, currentPage: i, totalPages, category })
    }
  })
}

module.exports = createPages
