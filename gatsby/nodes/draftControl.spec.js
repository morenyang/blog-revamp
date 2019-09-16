const draftControl = require('./draftControl')

describe('Test draft control', () => {
  let createNodeField
  beforeEach(() => {
    createNodeField = jest.fn()
  })

  afterEach(() => {
    process.env.ENABLE_DRAFT = undefined
    delete process.env.ENABLE_DRAFT
  })

  it(
    'should call createNodeField with name released and value true ' +
      'given enableDraft is true and isNodeDraft is true',
    () => {
      const node = {
        frontmatter: {
          draft: true,
        },
      }
      process.env.ENABLE_DRAFT = true

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: true,
      })
    }
  )

  it(
    'should call createNodeField with name released and value true ' +
      'given enableDraft is true and isNodeDraft is false',
    () => {
      const node = {
        frontmatter: {
          draft: false,
        },
      }
      process.env.ENABLE_DRAFT = true

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: true,
      })
    }
  )

  it(
    'should call createNodeField with name released and value true ' +
      'given enableDraft is false and isNodeDraft is not defined',
    () => {
      const node = {
        frontmatter: {},
      }
      process.env.ENABLE_DRAFT = true

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: true,
      })
    }
  )

  it(
    'should call createNodeField with name released and value false ' +
      'given enableDraft is not defined and isNodeDraft is true',
    () => {
      const node = {
        frontmatter: {
          draft: true,
        },
      }

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: false,
      })
    }
  )

  it(
    'should call createNodeField with name released and value true ' +
      'given enableDraft is not defined and isNodeDraft is false',
    () => {
      const node = {
        frontmatter: {
          draft: false,
        },
      }

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: true,
      })
    }
  )

  it(
    'should call createNodeField with name released and value true ' +
      'given enableDraft is not defined and isNodeDraft is not defined',
    () => {
      const node = {
        frontmatter: {},
      }

      draftControl({ node, createNodeField })
      expect(createNodeField).toHaveBeenCalledTimes(1)
      expect(createNodeField).toHaveBeenCalledWith({
        node,
        name: 'released',
        value: true,
      })
    }
  )
})
