const path = require('path')
const siteConfig = require('../../site-config')
const { getCategoryPathByPage } = require('../../common/routerHelper')
const pageUtils = require('../../common/pageUtils')

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
    totalPages: pageUtils.getTotalPages(item.totalCount, postPerPage),
  }))
}

const createCategoryPage = ({
  createPage,
  currentPage,
  totalPages,
  category,
}) => {
  createPage({
    path: getCategoryPathByPage(category, currentPage),
    component: path.resolve(
      `./src/templates/ArticlesCategoriesPageTemplate.js`
    ),
    context: {
      ...pageUtils.createPageContext({
        currentPage,
        totalPages,
        elementsPerPage: postPerPage,
        getPathByPage: page => getCategoryPathByPage(category, page),
      }),
      category,
    },
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
