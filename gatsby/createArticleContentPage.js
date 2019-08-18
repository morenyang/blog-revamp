'use strict'
const path = require('path')

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

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
  edges.forEach(edge => {
    const { node } = edge
    createPage({
      path: `/articles/${node.fields.slug}`,
      component: path.resolve(`./src/templates/ArticleContentPageTemplate.js`),
      context: {
        id: node.id,
      },
    })
  })
}

module.exports = createPages
