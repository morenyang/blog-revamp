const path = require('path')
const { getPathBySlugFactory } = require('../../common/routerHelper')

const getArticleNodes = async graphql => {
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {
            fields: { collection: { eq: "article" }, released: { ne: false } }
          }
        ) {
          edges {
            node {
              fields {
                collection
                slug
              }
              id
            }
          }
        }
      }
    `
  )

  const { edges } = result.data.allMarkdownRemark
  return edges.map(({ node }) => node)
}

const createArticlePage = (createPage, node) => {
  const getPath = getPathBySlugFactory(`articles`)
  createPage({
    path: getPath(node.fields.slug),
    component: path.resolve(`./src/templates/ArticleContentPageTemplate.js`),
    context: {
      id: node.id,
    },
  })
}

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const nodes = await getArticleNodes(graphql)

  nodes.forEach(node => {
    createArticlePage(createPage, node)
  })
}

module.exports = createPages
