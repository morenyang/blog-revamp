const isNodeMarkdown = node => node.internal.type === 'MarkdownRemark'

const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  const createFieldByParentSourceInstanceName = () => {
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

  if (isNodeMarkdown(node)) {
    createFieldByParentSourceInstanceName()
  }
}

module.exports = onCreateNode
