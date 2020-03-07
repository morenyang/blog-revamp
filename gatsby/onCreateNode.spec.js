const onCreateNode = require('./onCreateNode')
let createCategoriesField = require('./nodes/createCategoriesField')
let createCollectionField = require('./nodes/createCollectionField')
let createCoverField = require('./nodes/createCoverField')
let createSlugField = require('./nodes/createSlugField')
let createProdControlNodeFields = require('./nodes/createProdControlNodeFields')

jest.mock('./nodes/createCategoriesField.js')
jest.mock('./nodes/createCollectionField')
jest.mock('./nodes/createCoverField')
jest.mock('./nodes/createSlugField')
jest.mock('./nodes/createProdControlNodeFields')

describe('Test onCreateNode', () => {
  let getNode
  let actions

  beforeEach(() => {
    getNode = jest.fn()
    actions = {
      createNodeField: jest.fn,
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Test create fields on markdown', () => {
    it('should call correct functions in onCreateNode given node with internal.type is MarkdownRemark', () => {
      const node = {
        internal: { type: 'MarkdownRemark' },
      }

      onCreateNode({ node, getNode, actions })

      expect(createCategoriesField).toHaveBeenCalledTimes(1)
      expect(createCollectionField).toHaveBeenCalledTimes(1)
      expect(createCoverField).toHaveBeenCalledTimes(1)
      expect(createSlugField).toHaveBeenCalledTimes(1)
      expect(createProdControlNodeFields).toHaveBeenCalledTimes(1)
    })

    it('should call correct functions in onCreateNode given node with internal.type is not MarkdownRemark', () => {
      const node = {
        internal: { type: 'Image' },
      }

      onCreateNode({ node, getNode, actions })

      expect(createCategoriesField).not.toHaveBeenCalled()
      expect(createCollectionField).not.toHaveBeenCalled()
      expect(createCoverField).not.toHaveBeenCalled()
      expect(createSlugField).not.toHaveBeenCalled()
      expect(createProdControlNodeFields).not.toHaveBeenCalled()
    })
  })
})
