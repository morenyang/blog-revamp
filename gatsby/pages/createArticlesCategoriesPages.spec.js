const createArticlesCategoriesPages = require('./createArticlesCategoriesPages')
const routerHelper = require('../../common/routerHelper')
const pageUtils = require('../../common/pageUtils')
const path = require('path')
const siteConfig = require('../../site-config')

jest.mock('../../common/routerHelper')
jest.mock('path')
jest.mock('../../site-config')

describe('Test createArticlePages', () => {
  it('should call createPage with correct arguments', async () => {
    routerHelper.getCategoryPathByPage.mockReturnValue('TEST_PATH')
    siteConfig.postPerPage = 10

    path.resolve.mockReturnValue('TEST_FILE_PATH')

    jest.spyOn(pageUtils, 'getTotalPages').mockReturnValue(1)
    jest.spyOn(pageUtils, 'hasNextPage').mockReturnValue(true)
    jest.spyOn(pageUtils, 'hasPrevPage').mockReturnValue(true)
    jest.spyOn(pageUtils, 'getPageElementOffset').mockReturnValue(0)
    const createPageContext = jest.spyOn(pageUtils, 'createPageContext')

    const actions = {
      createPage: jest.fn(),
    }
    const graphql = jest.fn()

    graphql.mockResolvedValue({
      data: {
        allMarkdownRemark: {
          group: [
            { fieldValue: 'CATEGORY_NAME', totalCount: 10 },
            { fieldValue: 'CATEGORY_NAME_1', totalCount: 10 },
          ],
        },
      },
    })

    await createArticlesCategoriesPages({ graphql, actions })

    expect(graphql).toHaveBeenCalledTimes(1)

    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledTimes(6)

    expect(createPageContext).toHaveBeenCalledTimes(2)

    expect(actions.createPage).toHaveBeenCalledTimes(2)

    expect(actions.createPage.mock.calls[0][0]).toEqual({
      path: 'TEST_PATH',
      component: 'TEST_FILE_PATH',
      context: {
        category: 'CATEGORY_NAME',
        currentPage: 0,
        hasNext: false,
        hasPrev: false,
        nextPath: 'TEST_PATH',
        pageSize: 30,
        postsOffset: 0,
        prevPath: 'TEST_PATH',
        totalPages: 1,
      },
    })

    expect(actions.createPage.mock.calls[1][0]).toEqual({
      path: 'TEST_PATH',
      component: 'TEST_FILE_PATH',
      context: {
        category: 'CATEGORY_NAME_1',
        currentPage: 0,
        hasNext: false,
        hasPrev: false,
        nextPath: 'TEST_PATH',
        pageSize: 30,
        postsOffset: 0,
        prevPath: 'TEST_PATH',
        totalPages: 1,
      },
    })
  })
})
