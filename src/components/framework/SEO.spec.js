import React from 'react'
import SEO from './SEO'
import { shallow } from 'enzyme'
import * as gatsby from 'gatsby'
import Helmet from 'react-helmet'

describe('<SEO />', () => {
  it('should be defined', () => {
    expect(SEO).toBeDefined()
  })

  const graphql = jest.spyOn(gatsby, 'graphql').mockReturnValue('TEST_GRAPHQL')
  const useStaticQuery = jest.spyOn(gatsby, 'useStaticQuery').mockReturnValue({
    site: {
      siteMetadata: {
        description: 'SITE_DESCRIPTION',
        title: 'SITE_TITLE',
      },
    },
  })

  it('should render correct properties in SEO', () => {
    const props = {
      description: 'DESC',
      lang: 'LANG',
      meta: [{ name: 'META_NAME', content: 'META_CONTENT' }],
      title: 'TEST_TITLE',
    }

    const wrapper = shallow(<SEO {...props} />)

    expect(graphql).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledTimes(1)
    expect(useStaticQuery).toHaveBeenCalledWith('TEST_GRAPHQL')

    const hamlet = wrapper.find(Helmet)
    expect(hamlet).toHaveLength(1)
    expect(hamlet.prop('htmlAttributes')).toEqual({
      lang: 'LANG',
    })
    expect(hamlet.prop('title')).toEqual('TEST_TITLE')
    expect(hamlet.prop('titleTemplate')).toEqual(`%s – SITE_TITLE`)
    expect(hamlet.prop('meta')).toEqual([
      { name: `description`, content: 'DESC' },
      { name: 'META_NAME', content: 'META_CONTENT' },
    ])
  })
})
