import React from 'react'
import { shallow, mount } from 'enzyme'
import Footer from './Footer'
import styles from './Footer.module.scss'

describe('<Footer />', () => {
  it('should be defined', () => {
    expect(Footer).toBeDefined()
  })

  it('should have correct props in Footer', () => {
    const props = {
      author: 'AUTHOR',
    }
    const wrapper = mount(<Footer {...props} />)
    expect(wrapper.prop('author')).toBe(props.author)
    wrapper.unmount()
  })

  it('should render correct year and author in Footer.copyright', () => {
    const mockGetFullYear = jest.spyOn(Date.prototype, 'getFullYear')
    mockGetFullYear.mockReturnValue('YEAR')

    const wrapper = shallow(<Footer author={`AUTHOR`} />)
    const copyrightWrapper = wrapper.find(`.${styles.footerCopyright}`)
    expect(copyrightWrapper).toHaveLength(1)
    expect(copyrightWrapper.text()).toEqual(`© YEAR   AUTHOR`)
  })
})
