const createCategoriesField = require('./createCategoriesField')
const routerHelper = require('../../common/routerHelper')
const _ = require('lodash')

jest.mock('../../common/routerHelper')

describe('Test categoriesField', () => {
  let createNodeField
  let getCategoryPathByPage

  beforeEach(() => {
    createNodeField = jest.fn()
    getCategoryPathByPage = jest.spyOn(routerHelper, 'getCategoryPathByPage')
    getCategoryPathByPage.mockReturnValue('PATH')
  })

  it('should call createNodeField with correct arguments given node with categories as a array', () => {
    const node = {
      frontmatter: {
        categories: ['Event', 'React'],
      },
    }

    createCategoriesField({ node, createNodeField })

    const expectCategories = node.frontmatter.categories.map(category => ({
      category: _.startCase(category),
      link: 'PATH',
    }))

    expect(createNodeField).toHaveBeenCalledTimes(1)
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'categories',
      value: expectCategories,
    })
  })

  it('should call createNodeField with correct arguments given node with categories is not defined', () => {
    const node = {
      frontmatter: {},
    }

    createCategoriesField({ node, createNodeField })

    expect(createNodeField).toHaveBeenCalledTimes(1)
    expect(createNodeField).toHaveBeenCalledWith({
      node,
      name: 'categories',
      value: [],
    })
  })
})
