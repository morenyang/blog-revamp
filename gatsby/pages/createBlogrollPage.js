const path = require('path')
const siteConfig = require('../../site-config')

const createPage = async ({ actions }) => {
  const { createPage } = actions
  const { blogroll } = siteConfig

  createPage({
    path: '/blogroll',
    component: path.resolve(`./src/templates/BlogrollPageTemplate.js`),
    context: {
      blogroll,
    },
  })
}

module.exports = createPage
