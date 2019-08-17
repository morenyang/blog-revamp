const { createFilePath } = require('gatsby-source-filesystem')

const isNodeMarkdown = node => node.internal.type === 'MarkdownRemark'
const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  const creatorArgs = {
    getNode,
    node,
    createNodeField,
  }

  if (isNodeMarkdown(node)) {
    createCollectionFieldByParentSourceInstanceName(creatorArgs)
    createSlugField(creatorArgs)
    createCoverField(creatorArgs)
  }
}

const createSlugField = ({ getNode, node, createNodeField }) => {
  const slug = createFilePath({ node, getNode })
  createNodeField({
    node,
    name: `slug`,
    value: slug,
  })
}

function createCoverField({ node, createNodeField }) {
  const coverImage = node.frontmatter.coverImage
  createNodeField({
    node: node,
    name: `coverImage`,
    value: coverImage,
  })
}

const createCollectionFieldByParentSourceInstanceName = ({
  getNode,
  node,
  createNodeField,
}) => {
  // Get the parent node
  const parent = getNode(node.parent)

  // Create a field on this node for the "collection" of the parent
  // NOTE: This is necessary so we can filter `allMarkdownRemark` by
  // `collection` otherwise there is no way to filter for only markdown
  // documents of type `post`.
  createNodeField({
    node,
    name: 'collection',
    value: parent.sourceInstanceName,
  })
}

module.exports = onCreateNode
