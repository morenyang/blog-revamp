const createArticlesPages = require('./createArticlesPages')
const routerHelper = require('../../common/routerHelper')
const pageUtils = require('../../common/pageUtils')
const path = require('path')
const siteConfig = require('../../site-config')

jest.mock('../../common/routerHelper')
jest.mock('path')
jest.mock('../../common/pageUtils')
jest.mock('../../site-config')

describe('Test createArticlePages', () => {
  it('should call createPage with correct arguments', async () => {
    const getPath = jest.fn()
    getPath.mockReturnValue('TEST_PATH')
    routerHelper.getPathByPageFactory.mockReturnValue(getPath)
    siteConfig.postPerPage = 10
    path.resolve.mockReturnValue('TEST_FILE_PATH')

    pageUtils.getTotalPages.mockReturnValue(2)
    pageUtils.createPageContext.mockReturnValue({
      totalPages: 1,
      currentPage: 0,
      pageSize: 10,
      postsOffset: 0,
      prevPath: 'TEST_PATH',
      nextPath: 'TEST_PATH',
      hasPrev: true,
      hasNext: true,
    })

    const actions = {
      createPage: jest.fn(),
    }
    const graphql = jest.fn()

    graphql.mockResolvedValue({
      data: {
        allMarkdownRemark: {
          totalCount: 10,
        },
      },
    })

    await createArticlesPages({ graphql, actions })

    expect(graphql).toHaveBeenCalledTimes(1)

    expect(getPath).toHaveBeenCalledTimes(2)
    expect(getPath).toHaveBeenCalledWith(0)
    expect(getPath).toHaveBeenCalledWith(1)

    expect(pageUtils.createPageContext).toHaveBeenCalledTimes(2)
    expect(pageUtils.createPageContext).toHaveBeenCalledWith({
      currentPage: 0,
      elementsPerPage: 30,
      getPathByPage: getPath,
      totalPages: 2,
    })
    expect(pageUtils.createPageContext).toHaveBeenCalledWith({
      currentPage: 1,
      elementsPerPage: 30,
      getPathByPage: getPath,
      totalPages: 2,
    })

    expect(actions.createPage).toHaveBeenCalledTimes(2)
    expect(actions.createPage).toHaveBeenCalledWith({
      path: 'TEST_PATH',
      component: 'TEST_FILE_PATH',
      context: {
        totalPages: 1,
        currentPage: 0,
        pageSize: 10,
        postsOffset: 0,
        prevPath: 'TEST_PATH',
        nextPath: 'TEST_PATH',
        hasPrev: true,
        hasNext: true,
      },
    })
  })
})
