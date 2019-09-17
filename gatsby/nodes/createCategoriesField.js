const _ = require('lodash')
const { getCategoryPathByPage } = require('../../common/routerHelper')

const createCategoriesField = ({ node, createNodeField }) => {
  const categories = _.isArray(node.frontmatter.categories)
    ? node.frontmatter.categories
    : []

  const categoriesFieldValue = categories.map(category => ({
    category: _.startCase(category),
    link: getCategoryPathByPage(category),
  }))

  createNodeField({
    node,
    name: `categories`,
    value: categoriesFieldValue,
  })
}

module.exports = createCategoriesField
