const createCoverField = ({ node, createNodeField }) => {
  const coverImage = node.frontmatter.coverImage
  createNodeField({
    node: node,
    name: `coverImage`,
    value: coverImage,
  })
}

module.exports = createCoverField
