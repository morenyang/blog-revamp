'use strict'
const path = require('path')

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

const getPath = slug => {
  return `/articles/${slug}`.replace(/\/\//g, '/')
}

const createArticlePage = (createPage, node) => {
  console.log(node)
  console.log(node.fields.slug)
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
