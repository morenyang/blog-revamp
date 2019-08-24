const path = require('path')
const { getPathBySlugFactory } = require('../../router-helper')

const getArticleNodes = async graphql => {
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {
            frontmatter: { draft: { ne: true } }
            fields: { collection: { eq: "article" } }
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

const getPath = getPathBySlugFactory(`articles`)

const createArticlePage = (createPage, node) => {
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
