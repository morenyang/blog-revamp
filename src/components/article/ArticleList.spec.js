import React from 'react'
import { shallow } from 'enzyme'
import ArticleList from './ArticleList'
import ArticleCard from './ArticleCard'

jest.mock('./ArticleCard')

describe('<ArticleList />', () => {
  it('should be defined', () => {
    expect(ArticleList).toBeDefined()
  })
  it('should render correct components', () => {
    const props = {
      grids: 2,
      articles: [{ id: 1 }, { id: 2 }],
    }

    const wrapper = shallow(<ArticleList {...props} />)
    expect(wrapper.find(ArticleCard)).toHaveLength(2)
    expect(
      wrapper
        .find(ArticleCard)
        .at(0)
        .props()
    ).toEqual({
      article: { id: 1 },
      grids: 2,
    })

    expect(
      wrapper
        .find(ArticleCard)
        .at(1)
        .props()
    ).toEqual({
      article: { id: 2 },
      grids: 2,
    })
  })

  it('should have default prop grids as 3', () => {
    const props = { articles: [{ id: 1 }] }
    const wrapper = shallow(<ArticleList {...props} />)
    expect(wrapper.find(ArticleCard)).toHaveLength(1)
    expect(
      wrapper
        .find(ArticleCard)
        .at(0)
        .prop('grids')
    ).toBe(3)
  })
})
