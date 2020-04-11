import React from 'react'
import Header from './Header'
import { shallow } from 'enzyme'
import { Link } from 'gatsby'

describe('<Header />', () => {
  it('should be defined', () => {
    expect(Header).toBeDefined()
  })

  it('should render correct items in header', () => {
    const props = {
      title: 'SITE_TITLE',
      headerLinks: [
        { name: 'ITEM', path: 'PATH' },
        { name: 'ITEM2', path: 'PATH2' },
      ],
    }

    const wrapper = shallow(<Header {...props} />)

    const title = wrapper.find('header>div').at(0)
    expect(title).toHaveLength(1)
    expect(title.find(Link)).toHaveLength(1)
    expect(title.find(Link).prop('to')).toBe('/')
    expect(title.render().text()).toBe('SITE_TITLE')

    const items = wrapper.find('header>nav>ul').at(0)
    expect(items).toHaveLength(1)
    expect(items.find(Link)).toHaveLength(2)

    expect(items.find(Link).at(0).prop('to')).toBe('PATH')
    expect(items.find(Link).at(0).render().text()).toBe('ITEM')

    expect(items.find(Link).at(1).prop('to')).toBe('PATH2')
    expect(items.find(Link).at(1).render().text()).toBe('ITEM2')
  })
})
