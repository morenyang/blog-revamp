const createArticlesCategoriesPages = require('./createArticlesCategoriesPages')
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
    routerHelper.getCategoryPathByPage.mockReturnValue('TEST_PATH')
    siteConfig.postPerPage = 10

    path.resolve.mockReturnValue('TEST_FILE_PATH')

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

    await createArticlesCategoriesPages({ graphql, actions })

    expect(graphql).toHaveBeenCalledTimes(1)

    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledTimes(4)
    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledWith(
      'CATEGORY_NAME',
      0
    )
    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledWith(
      'CATEGORY_NAME',
      1
    )
    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledWith(
      'CATEGORY_NAME_1',
      0
    )
    expect(routerHelper.getCategoryPathByPage).toHaveBeenCalledWith(
      'CATEGORY_NAME_1',
      1
    )

    expect(pageUtils.createPageContext).toHaveBeenCalledTimes(4)

    expect(actions.createPage).toHaveBeenCalledTimes(4)

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
        category: 'CATEGORY_NAME',
      },
    })

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
        category: 'CATEGORY_NAME_1',
      },
    })
  })
})
