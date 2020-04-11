import React from 'react'
import Layout from './Layout'
import { shallow } from 'enzyme'
import * as gatsby from 'gatsby'
import Header from './Header'
import Footer from './Footer'

describe('<Layout />', () => {
  it('should be defined', () => {
    expect(Layout).toBeDefined()
  })

  const graphql = jest.spyOn(gatsby, 'graphql').mockReturnValue('TEST_GRAPHQL')
  const useStaticQuery = jest.spyOn(gatsby, 'useStaticQuery').mockReturnValue({
    site: {
      siteMetadata: {
        description: 'SITE_DESCRIPTION',
        title: 'SITE_TITLE',
        author: 'AUTHOR',
        headerLinks: [
          { name: 'ITEM', path: 'PATH' },
          { name: 'ITEM2', path: 'PATH2' },
        ],
      },
    },
  })

  it('should render correct components', () => {
    const children = <div className="unique" />
    const wrapper = shallow(<Layout>{children}</Layout>)

    expect(graphql).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledWith('TEST_GRAPHQL')

    expect(wrapper.find('div').at(1).hasClass('site-main')).toBe(true)

    expect(wrapper.find('div.unique')).toHaveLength(1)

    expect(wrapper.find(Header)).toHaveLength(1)
    expect(wrapper.find(Header).props()).toEqual({
      title: 'SITE_TITLE',
      headerLinks: [
        { name: 'ITEM', path: 'PATH' },
        { name: 'ITEM2', path: 'PATH2' },
      ],
    })

    expect(wrapper.find(Footer)).toHaveLength(1)
    expect(wrapper.find(Footer).prop('author')).toBe('AUTHOR')
  })

  it('should have correct class name given prop with a class name ', () => {
    const children = <div className="unique" />
    const className = 'CLASS_NAME'
    const wrapper = shallow(<Layout className={className}>{children}</Layout>)

    expect(wrapper.find('div').at(1).hasClass(className)).toBe(true)
  })
})
