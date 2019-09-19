const createArticleContentPage = require('./createArticleContentPages')
const routerHelper = require('../../common/routerHelper')
const path = require('path')

jest.mock('../../common/routerHelper')
jest.mock('path')

describe('Test createArticleContentPage', () => {
  it('should call createPage with correct arguments', async () => {
    routerHelper.getPathBySlugFactory.mockReturnValue(() => 'TEST_SLUG_PATH')
    path.resolve.mockReturnValue('TEST_FILE_PATH')

    const graphql = jest.fn()

    const node = {
      id: 'TEST_ID',
      fields: {
        slug: 'TEST_SLUG',
      },
    }

    const anotherNode = {
      id: 'TEST_ID2',
      fields: {
        slug: 'TEST_SLUG',
      },
    }

    graphql.mockResolvedValue({
      data: {
        allMarkdownRemark: { edges: [{ node }, { node: anotherNode }] },
      },
    })

    const actions = { createPage: jest.fn() }

    await createArticleContentPage({ graphql, actions })

    expect(graphql).toHaveBeenCalledTimes(1)

    expect(actions.createPage).toHaveBeenCalledTimes(2)
    expect(actions.createPage).toHaveBeenCalledWith({
      path: 'TEST_SLUG_PATH',
      component: 'TEST_FILE_PATH',
      context: {
        id: 'TEST_ID',
      },
    })
    expect(actions.createPage).toHaveBeenCalledWith({
      path: 'TEST_SLUG_PATH',
      component: 'TEST_FILE_PATH',
      context: {
        id: 'TEST_ID2',
      },
    })
  })
})
