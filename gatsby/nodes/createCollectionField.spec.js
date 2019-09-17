const createCollectionField = require('./createCollectionField')

describe('Test createCollectionField', () => {
  it('should call createNodeField and getNode with correct arguments', () => {
    const node = { parent: { name: 'PARENT_NAME' } }
    const createNodeField = jest.fn()
    const getNode = jest.fn()

    const sourceInstanceName = 'ARTICLE'

    getNode.mockReturnValue({ sourceInstanceName })

    createCollectionField({ getNode, node, createNodeField })

    expect(getNode).toHaveBeenCalledTimes(1)
    expect(getNode).toHaveBeenCalledWith(node.parent)

    expect(createNodeField).toHaveBeenCalledTimes(1)
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'collection',
      value: sourceInstanceName,
    })
  })
})
