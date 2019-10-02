import React from 'react'
import { mount } from 'enzyme'
import wrapWithProvider from './wrapWithProvider'
import * as reactRedux from 'react-redux'

jest.mock('../src/state/store', () => ({
  default: '',
}))
jest
  .spyOn(reactRedux, 'Provider')
  .mockImplementation(({ children: _children }) => (
    <div className="provider">{_children}</div>
  ))

describe('Test wrapWithProvider', () => {
  it('should be defined', () => {
    expect(wrapWithProvider).toBeDefined()
  })

  it('should render correct element', () => {
    const children = <div className="unique" />
    const WrapWithProvider = wrapWithProvider
    const wrapper = mount(<WrapWithProvider element={children} />)
    expect(wrapper.find('.unique')).toHaveLength(1)
    expect(wrapper.find('.provider')).toHaveLength(1)
  })
})
