const createPages = require('./createPages')
const createArticlesPages = require('./pages/createArticlesPages')
const createArticlesCategoriesPages = require('./pages/createArticlesCategoriesPages')
const createArticleContentPages = require('./pages/createArticleContentPages')

jest.mock('./pages/createArticlesPages')
jest.mock('./pages/createArticlesCategoriesPages')
jest.mock('./pages/createArticleContentPages')

describe('Test createPages', () => {
  it('should call correct methods in createPages', async () => {
    const graphql = jest.fn()
    const actions = jest.fn()
    await createPages({ graphql, actions })

    expect(createArticlesPages).toHaveBeenCalledTimes(1)
    expect(createArticleContentPages).toHaveBeenCalledTimes(1)
    expect(createArticlesCategoriesPages).toHaveBeenCalledTimes(1)
  })
})
