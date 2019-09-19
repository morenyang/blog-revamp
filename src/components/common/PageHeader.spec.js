import React from 'react'
import PageHeader from './PageHeader'
import { shallow } from 'enzyme'

describe('<PageHeader />', () => {
  it('should be defined', () => {
    expect(PageHeader).toBeDefined()
  })

  it('should render correct content', () => {
    const props = {
      title: 'TITLE',
      description: 'DESCRIPTION',
    }
    const wrapper = shallow(<PageHeader {...props} />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBe(props.title)

    expect(wrapper.find('h3')).toHaveLength(1)
    expect(wrapper.find('h3').text()).toBe(props.description)
  })

  it('should not render description given description is undefined', () => {
    const props = {
      title: 'TITLE',
      description: undefined,
    }
    const wrapper = shallow(<PageHeader {...props} />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBe(props.title)

    expect(wrapper.find('h3')).toHaveLength(0)
  })
})
