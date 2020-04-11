import React from 'react'
import { mount } from 'enzyme'
import NotFoundPage from './404'
import * as gatsby from 'gatsby'

jest.mock('../components/framework', () => ({
  __esModule: true,
  SEO: jest.fn().mockImplementation(() => null),
  Layout: jest.fn().mockImplementation(({ children }) => children),
}))

jest.mock('../components/common/ColorfulText', () => ({
  __esModule: true,
  ColorfulText: jest.fn().mockImplementation(({ children }) => <>{children}</>),
}))

describe('<NotFountPage />', () => {
  beforeEach(() => {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        pathname: 'TEST_PATH_NAME',
      },
      writable: true,
    })
  })

  it('should be defined', () => {
    expect(NotFoundPage).toBeDefined()
  })

  it('should render correct items', () => {
    const wrapper = mount(<NotFoundPage />)
    wrapper.update()
    expect(wrapper.find('h1').text()).toBe('Oops!')
    expect(wrapper.find('h2').text()).toBe('404 Page Not Found')
    expect(wrapper.find(gatsby.Link).prop('to')).toBe('/')
    expect(wrapper.find(gatsby.Link).render().text()).toEqual(
      'View Homepage  ›'
    )
    expect(wrapper.find('.location').text()).toBe(' TEST_PATH_NAME')
  })
})
