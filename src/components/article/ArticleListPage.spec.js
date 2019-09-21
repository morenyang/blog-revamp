import React from 'react'
import { shallow } from 'enzyme'
import ArticleListPage from './ArticleListPage'
import SEO from '../framework/SEO'
import PageHeader from '../common/PageHeader'
import ArticleList from './ArticleList'
import Pagination from '../common/Pagination'

describe('<ArticleListPage />', () => {
  it('should be defined', () => {
    expect(ArticleListPage).toBeDefined()
  })

  it('should render correct components', () => {
    const props = {
      title: 'TEST_TITLE',
      articles: [{ id: 1 }, { id: 2 }],
      hasNext: false,
      hasPrev: true,
    }

    const wrapper = shallow(<ArticleListPage {...props} />)
    expect(wrapper.find(SEO)).toHaveLength(1)
    expect(wrapper.find(SEO).prop('title')).toBe(props.title)

    expect(wrapper.find(PageHeader)).toHaveLength(1)
    expect(wrapper.find(PageHeader).prop('title')).toBe(props.title)

    expect(wrapper.find(ArticleList)).toHaveLength(1)
    expect(wrapper.find(ArticleList).prop('articles')).toBe(props.articles)

    expect(wrapper.find(Pagination)).toHaveLength(1)
    expect(wrapper.find(Pagination).prop('hasNext')).toBe(false)
    expect(wrapper.find(Pagination).prop('hasPrev')).toBe(true)
  })
})
