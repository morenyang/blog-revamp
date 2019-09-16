const draftControl = ({ node, createNodeField }) => {
  const enableDraft =
    process.env.ENABLE_DRAFT !== undefined &&
    process.env.ENABLE_DRAFT === 'true'

  const isNodeDraft =
    node.frontmatter.draft !== undefined && !!node.frontmatter.draft

  createNodeField({
    node,
    name: 'released',
    value: enableDraft || !isNodeDraft,
  })
}
module.exports = draftControl
