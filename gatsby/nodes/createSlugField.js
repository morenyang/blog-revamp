const { createFilePath } = require('gatsby-source-filesystem')

const createSlugField = ({ getNode, node, createNodeField }) => {
  const slug = createFilePath({ node, getNode })
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  })
}

module.exports = createSlugField
