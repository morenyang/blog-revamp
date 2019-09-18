import React from 'react'
import ArticlesCategoriesPageTemplate from './ArticlesCategoriesPageTemplate'
import ArticleListPage from '../components/article/ArticleListPage'
import { shallow } from 'enzyme'
import { graphql } from 'gatsby'

jest.mock('gatsby')

describe('<ArticlesPageTemplate />', () => {
  it('should be defined', () => {
    expect(ArticlesCategoriesPageTemplate).toBeDefined()
  })

  it('should call graphql and render correct component', () => {
    const data = {
      allMarkdownRemark: { edges: [{ node: { id: 1 } }, { node: { id: 2 } }] },
    }
    const pageContext = { title: 'TEST_TITLE', haxNext: true, hasPrev: false }
    const wrapper = shallow(
      <ArticlesCategoriesPageTemplate data={data} pageContext={pageContext} />
    )

    expect(graphql).toBeCalledTimes(1)
    const articleListPage = wrapper.find(ArticleListPage)
    expect(articleListPage).toBeTruthy()

    expect(articleListPage.prop('articles')).toHaveLength(2)
    expect(articleListPage.prop('articles')).toEqual([{ id: 1 }, { id: 2 }])

    expect(articleListPage.props()).toHaveProperty('title')
    expect(articleListPage.prop('title')).toEqual('TEST_TITLE')

    expect(articleListPage.props()).toHaveProperty('haxNext')
    expect(articleListPage.prop('haxNext')).toEqual(true)

    expect(articleListPage.props()).toHaveProperty('hasPrev')
    expect(articleListPage.prop('hasPrev')).toEqual(false)
  })
})
