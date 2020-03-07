const createProdControlNodeFields = require('./nodes/createProdControlNodeFields')
const createSlugField = require('./nodes/createSlugField')
const createCoverField = require('./nodes/createCoverField')
const createCollectionFieldByParentSourceInstanceName = require('./nodes/createCollectionField')
const createCategoriesField = require('./nodes/createCategoriesField')

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
    createCategoriesField(creatorArgs)
    createProdControlNodeFields(creatorArgs)
  }
}

module.exports = onCreateNode
