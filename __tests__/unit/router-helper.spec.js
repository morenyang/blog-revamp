import routerHelper from '../../router-helper'
import lodash from 'lodash'

describe('Test router helper', () => {
  describe('Test getPathByPageFactory', () => {
    let PREFIX
    let getPathByPage

    beforeEach(() => {
      PREFIX = 'PREFIX'
      getPathByPage = routerHelper.getPathByPageFactory(PREFIX)
    })

    it(
      `should return '/PREFIX/' ` +
        `given page 0 and prefix PREFIX ` +
        `when call getPathByPage returned by getPathByPageFactory`,
      () => {
        const PAGE = 0
        const path = getPathByPage(PAGE)
        expect(path).toBe(`/${PREFIX}/`)
      }
    )

    it(
      `should return '/PREFIX/' ` +
        `given prefix PREFIX ` +
        `when call getPathByPage returned by getPathByPageFactory`,
      () => {
        const path = getPathByPage()
        expect(path).toBe(`/${PREFIX}/`)
      }
    )

    it(
      `should return '/PREFIX/2' ` +
        `given page 1 and prefix PREFIX ` +
        `when call getPathByPage returned by getPathByPageFactory`,
      () => {
        const PAGE = 1
        const path = getPathByPage(PAGE)
        expect(path).toBe(`/${PREFIX}/2`)
      }
    )

    it(
      `should return '/PREFIX/2' ` +
        `given page 1 and prefix /PREFIX ` +
        `when call getPathByPage returned by getPathByPageFactory`,
      () => {
        PREFIX = '/PREFIX'
        const PAGE = 1
        const path = getPathByPage(PAGE)
        expect(path).toBe(`/PREFIX/2`)
      }
    )
  })

  describe('Test getPathBySlugFactory', () => {
    it(
      `should return '/PREFIX/PATH_TO_PAGE' ` +
        `given slug PATH_TO_PAGE and prefix PREFIX` +
        `when call the function returned by getPathBySlugFactory`,
      () => {
        const PREFIX = `PREFIX`
        const SLUG = 'PATH_TO_PAGE'
        const path = routerHelper.getPathBySlugFactory(PREFIX)(SLUG)
        expect(path).toBe(`/${PREFIX}/${SLUG}`)
      }
    )

    it(
      `should return '/PREFIX/PATH_TO_PAGE' ` +
        `given slug PATH_TO_PAGE and prefix /PREFIX` +
        `when call the function returned by getPathBySlugFactory`,
      () => {
        const PREFIX = `/PREFIX`
        const SLUG = 'PATH_TO_PAGE'
        const path = routerHelper.getPathBySlugFactory(PREFIX)(SLUG)
        expect(path).toBe(`/PREFIX/${SLUG}`)
      }
    )
  })

  describe('Test getCategoryPathByPage', () => {
    it(
      `should return '/category/kebabCase/2' ` +
        'given category and page 1 ' +
        'when call getCategoryPathByPage',
      () => {
        jest.mock('lodash')
        lodash.kebabCase = jest.fn()
        lodash.kebabCase.mockReturnValue(`kebabCase`)

        const CATEGORY = `category`
        const PAGE = 1
        const path = routerHelper.getCategoryPathByPage(CATEGORY, PAGE)
        expect(path).toBe(`/category/kebabCase/2`)
      }
    )
  })
})
