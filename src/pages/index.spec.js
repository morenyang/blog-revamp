import React from 'react'
import { shallow } from 'enzyme'
import Homepage from './index'
import HomepageBanner from '../components/homepage/HomepageBanner'
import RecentArticles from '../components/homepage/RecentArticles'

describe('<Homepace />', () => {
  it('should be defined', () => {
    expect(Homepage).toBeDefined()
  })

  it('should render correct components', () => {
    const wrapper = shallow(<Homepage />)

    expect(wrapper.find(HomepageBanner)).toHaveLength(1)
    expect(wrapper.find(RecentArticles)).toHaveLength(1)
  })
})
