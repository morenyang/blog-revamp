import React from 'react'
import ArticlesPageTemplate from './ArticlesPageTemplate'
import ArticleListPage from '../components/article/ArticleListPage'
import { shallow } from 'enzyme'
import { graphql } from 'gatsby'

jest.mock('gatsby')

describe('<ArticlesPageTemplate />', () => {
  it('should be defined', () => {
    expect(ArticlesPageTemplate).toBeDefined()
  })

  it('should call graphql and render correct component', () => {
    const data = {
      allMarkdownRemark: { edges: [{ node: { id: 1 } }, { node: { id: 2 } }] },
    }
    const pageContext = { haxNext: true, hasPrev: false }
    const wrapper = shallow(
      <ArticlesPageTemplate data={data} pageContext={pageContext} />
    )

    expect(graphql).toBeCalledTimes(1)
    const articleListPage = wrapper.find(ArticleListPage)

    expect(articleListPage).toHaveLength(1)

    expect(articleListPage.prop('articles')).toHaveLength(2)
    expect(articleListPage.prop('articles')).toEqual([{ id: 1 }, { id: 2 }])

    expect(articleListPage.props()).toHaveProperty('title')
    expect(articleListPage.prop('title')).toEqual('Articles')

    expect(articleListPage.props()).toHaveProperty('haxNext')
    expect(articleListPage.prop('haxNext')).toEqual(true)

    expect(articleListPage.props()).toHaveProperty('hasPrev')
    expect(articleListPage.prop('hasPrev')).toEqual(false)
  })
})
