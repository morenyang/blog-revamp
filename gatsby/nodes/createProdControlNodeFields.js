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

const shadowControl = ({ node, createNodeField }) => {
  const isNodeDisabled =
    node.frontmatter.shadow !== undefined && !!node.frontmatter.shadow

  createNodeField({
    node,
    name: 'shadow',
    value: isNodeDisabled,
  })
}

const applyFieldCreators = (...args) => {
  const creators = [draftControl, shadowControl]
  creators.forEach(fn => fn(...args))
}

applyFieldCreators.draftControl = draftControl
applyFieldCreators.shadowControl = shadowControl

module.exports = applyFieldCreators
