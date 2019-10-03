import React from 'react'
import { shallow } from 'enzyme'
import ArticleCard from './ArticleCard'
import CoverImage from '../common/CoverImage'
import styles from './ArticleCard.module.scss'
import routerHelper from '../../utils/routerHelper'
import _ from 'lodash'
import { Link } from 'gatsby'

jest.mock('../common/CoverImage')
jest.mock('../../utils/routerHelper')

const getPath = jest.fn()
getPath.mockReturnValue('TEST_PATH')
routerHelper.getPathBySlugFactory.mockReturnValue(getPath)

const startCase = jest.spyOn(_, 'startCase').mockReturnValue('CATEGORY_NAME')

describe('<ArtileCard />', () => {
  it('should be defined', () => {
    expect(ArticleCard).toBeDefined()
  })

  describe('should render correct content', () => {
    const props = {
      article: {
        id: 'TEST_ID',
        title: 'TEST_TITLE',
        description: 'TEST_DESCRIPTION',
        fields: {
          slug: 'TEST_SLUG',
          categories: [
            { category: 'TEST_CATEGORY', link: 'TEST_CATEGORY_LINK' },
            { category: 'TEST_CATEGORY_2', link: 'TEST_CATEGORY_LINK_2' },
          ],
        },
        date: `2019-01-01 00:00:00`,
        coverImage: {
          childImageSharp: {
            fluid: { path: 'TEST_FLUID' },
          },
        },
      },
    }

    const wrapper = shallow(<ArticleCard {...props} />)

    expect(getPath).toHaveBeenCalledTimes(1)
    expect(getPath).toHaveBeenCalledWith(props.article.fields.slug)

    it('should render cover image with correct props', () => {
      const imageLinkWrapper = wrapper.find(`.${styles.coverImageWrapper}`)
      expect(imageLinkWrapper).toHaveLength(1)
      expect(imageLinkWrapper.prop('to')).toBe('TEST_PATH')

      expect(wrapper.find(CoverImage)).toHaveLength(1)
      expect(wrapper.find(CoverImage).prop('fluid')).toEqual(
        props.article.coverImage.childImageSharp.fluid
      )
    })

    it('should render title and description', () => {
      const title = wrapper.find(`.${styles.cardTitle}`)
      expect(title).toHaveLength(1)

      expect(title.prop('to')).toBe('TEST_PATH')

      expect(title.find('h2').text()).toBe(props.article.title)
      expect(title.find('h3').text()).toBe(` ${props.article.description}`)
    })

    it('should render correct date', () => {
      expect(
        wrapper
          .find(`.${styles.meta}`)
          .childAt(0)
          .text()
      ).toBe(`January 01, 2019`)
    })

    it('should render correct categories', () => {
      const categoriesWrapper = wrapper.find(`.${styles.categories}`)
      expect(categoriesWrapper).toHaveLength(1)
      expect(categoriesWrapper.find(Link)).toHaveLength(2)

      expect(
        categoriesWrapper
          .find(Link)
          .at(0)
          .prop('to')
      ).toBe('TEST_CATEGORY_LINK')
      expect(
        categoriesWrapper
          .find(Link)
          .at(1)
          .prop('to')
      ).toBe('TEST_CATEGORY_LINK_2')

      expect(startCase).toHaveBeenCalledTimes(2)
      expect(startCase.mock.calls[0][0]).toBe('TEST_CATEGORY')
      expect(startCase.mock.calls[1][0]).toBe('TEST_CATEGORY_2')

      expect(categoriesWrapper.render().text()).toBe(
        `CATEGORY_NAME, CATEGORY_NAME`
      )
    })
  })

  it('should not render cover image given article without coverImage', () => {
    const props = {
      article: {
        id: 'TEST_ID',
        title: 'TEST_TITLE',
        description: 'TEST_DESCRIPTION',
        fields: {
          slug: 'TEST_SLUG',
          categories: [
            { category: 'TEST_CATEGORY', link: 'TEST_CATEGORY_LINK' },
            { category: 'TEST_CATEGORY_2', link: 'TEST_CATEGORY_LINK_2' },
          ],
        },
        date: `2019-01-01 00:00:00`,
      },
    }

    const wrapper = shallow(<ArticleCard {...props} />)
    const imageLinkWrapper = wrapper.find(`.${styles.coverImageWrapper}`)
    expect(imageLinkWrapper).toEqual({})
  })

  it('should not render description given article without description', () => {
    const props = {
      article: {
        id: 'TEST_ID',
        title: 'TEST_TITLE',
        fields: {
          slug: 'TEST_SLUG',
          categories: [
            { category: 'TEST_CATEGORY', link: 'TEST_CATEGORY_LINK' },
            { category: 'TEST_CATEGORY_2', link: 'TEST_CATEGORY_LINK_2' },
          ],
        },
        date: `2019-01-01 00:00:00`,
      },
    }

    const wrapper = shallow(<ArticleCard {...props} />)

    const title = wrapper.find(`.${styles.cardTitle}`)
    expect(title).toHaveLength(1)

    expect(title.find('h3')).toEqual({})
  })
})
