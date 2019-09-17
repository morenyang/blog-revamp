const createSlugField = require('./createSlugField')
const gatsbySourceFilesystem = require('gatsby-source-filesystem')

jest.mock('gatsby-source-filesystem')

describe('Test createSlugField', () => {
  it('should call createFilePath and createNodeField with correct arguments', () => {
    const createNodeField = jest.fn()
    const getNode = jest.fn()
    const createFilePath = jest.spyOn(gatsbySourceFilesystem, 'createFilePath')
    createFilePath.mockReturnValue('PATH')

    const node = { name: 'TestNode' }

    createSlugField({ getNode, node, createNodeField })
    expect(gatsbySourceFilesystem.createFilePath).toHaveBeenCalledTimes(1)
    expect(gatsbySourceFilesystem.createFilePath).toHaveBeenCalledWith({
      node,
      getNode,
    })

    expect(createNodeField).toHaveBeenCalledTimes(1)
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'slug',
      value: 'PATH',
    })
  })
})
