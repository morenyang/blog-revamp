import React from 'react'
import { shallow } from 'enzyme'
import RecentArticles from './RecentArticles'
import * as gatsby from 'gatsby'
import * as articleUtils from '../../utils/articles'
import ArticleList from '../article/ArticleList'

describe('<RecentArticles />', () => {
  let useStaticQuery, graphql, resolveArticle
  beforeEach(() => {
    graphql = jest.spyOn(gatsby, 'graphql').mockReturnValue('MOCK_GRAPHQL')
    useStaticQuery = jest.spyOn(gatsby, 'useStaticQuery')
    resolveArticle = jest
      .spyOn(articleUtils, 'resolveArticle')
      .mockReturnValue({ id: 'MOCK_ID' })
  })

  it('should be defined', () => {
    expect(RecentArticles).toBeDefined()
  })

  it('should not render anything given articles less then two', () => {
    useStaticQuery.mockReturnValue({
      allMarkdownRemark: {
        edges: [{ node: {} }],
      },
    })

    const wrapper = shallow(<RecentArticles />)

    expect(graphql).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledWith('MOCK_GRAPHQL')
    expect(wrapper).toEqual({})
  })

  it('should render correct components given two articles', () => {
    useStaticQuery.mockReturnValue({
      allMarkdownRemark: {
        edges: [{ node: { id: 1 } }, { node: { id: 2 } }],
      },
    })

    const wrapper = shallow(<RecentArticles />)

    expect(resolveArticle).toHaveBeenCalledTimes(2)
    expect(resolveArticle.mock.calls[0][0]).toEqual({ id: 1 })
    expect(resolveArticle.mock.calls[1][0]).toEqual({ id: 2 })

    expect(wrapper.find('h3').text()).toBe('RECENT ARTICLES')
    expect(wrapper.find(ArticleList)).toHaveLength(1)
    expect(wrapper.find(ArticleList).props()).toEqual({
      grids: 2,
      articles: [{ id: 'MOCK_ID' }, { id: 'MOCK_ID' }],
    })
  })
})
