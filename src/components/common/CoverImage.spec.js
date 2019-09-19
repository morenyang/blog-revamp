import React from 'react'
import { loadResizeObserverPolyfills } from './CoverImage'
import { shallow } from 'enzyme'

jest.mock('resize-observer-polyfill')

describe('Test loadResizeObserverPolyfills', () => {
  const WrappedComponent = () => <div className="unique" />

  beforeEach(() => {
    window.ResizeObserver = undefined
    delete window.ResizeObserver
    window.ResizeObserverEntry = undefined
    delete window.ResizeObserverEntry
  })

  it('should be defined', () => {
    expect(loadResizeObserverPolyfills).toBeDefined()
  })

  it('should render wrappedComponent directly given ResizeObserver is supported in window', () => {
    window.ResizeObserver = {}
    window.ResizeObserverEntry = jest.fn()
    window.ResizeObserverEntry.prototype.contentRect = {}

    const WrapperComponent = loadResizeObserverPolyfills(WrappedComponent)

    const wrapper = shallow(<WrapperComponent />)
    expect(wrapper.find(WrappedComponent)).toHaveLength(1)
  })
})
