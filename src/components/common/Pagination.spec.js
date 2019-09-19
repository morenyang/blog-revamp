import React from 'react'
import Pagination from './Pagination'
import { shallow } from 'enzyme'
import { Link } from 'gatsby'

describe('<Pagination />', () => {
  it('should be defined', () => {
    expect(Pagination).toBeDefined()
  })

  it('should render null given hasNext is false and hasPrev is false', () => {
    const props = {
      hasNext: false,
      hasPrev: false,
    }
    const wrapper = shallow(<Pagination {...props} />)
    expect(wrapper).toEqual({})
  })

  it('should render only Prev button given hasPrev is true and hasNext is false', () => {
    const props = {
      hasNext: false,
      hasPrev: true,
      prevPath: 'TEST_PATH',
    }

    const wrapper = shallow(<Pagination {...props} />)
    expect(wrapper.find(Link)).toHaveLength(1)
    expect(wrapper.find(Link).prop('to')).toEqual('TEST_PATH')
    expect(wrapper.find(Link).text()).toContain('Prev')
  })

  it('should render only Next button given hasPrev is false and hasNext is true', () => {
    const props = {
      hasNext: true,
      nextPath: 'TEST_PATH',
      hasPrev: false,
    }

    const wrapper = shallow(<Pagination {...props} />)
    expect(wrapper.find(Link)).toHaveLength(1)
    expect(wrapper.find(Link).prop('to')).toEqual('TEST_PATH')
    expect(wrapper.find(Link).text()).toContain('Next')
  })

  it('should render both Prev and Next button given hasPrev is true and hasNext is true', () => {
    const props = {
      hasNext: true,
      nextPath: 'TEST_PATH_NEXT',
      hasPrev: true,
      prevPath: 'TEST_PATH_PREV',
    }

    const wrapper = shallow(<Pagination {...props} />)
    expect(wrapper.find(Link)).toHaveLength(2)

    expect(
      wrapper
        .find(Link)
        .at(0)
        .prop('to')
    ).toEqual('TEST_PATH_PREV')
    expect(
      wrapper
        .find(Link)
        .at(0)
        .text()
    ).toContain('Prev')

    expect(
      wrapper
        .find(Link)
        .at(1)
        .prop('to')
    ).toEqual('TEST_PATH_NEXT')
    expect(
      wrapper
        .find(Link)
        .at(1)
        .text()
    ).toContain('Next')
  })
})
