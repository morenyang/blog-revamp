const createCoverField = require('./createCoverField')

describe('Test createCoverField', () => {
  it('should call createNodeField with correct arguments', () => {
    const createNodeField = jest.fn()
    const node = { frontmatter: { coverImage: { path: 'TEST_PATH' } } }

    createCoverField({ node, createNodeField })
    expect(createNodeField).toHaveBeenCalledTimes(1)
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'coverImage',
      value: node.frontmatter.coverImage,
    })
  })
})
