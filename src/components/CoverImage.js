import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from 'gatsby-background-image'
import useComponentSize from '@rehooks/component-size'

const CoverImage = ({ children, fluid, aspectRatio, className }) => {
  let innerWrapper = useRef(null)
  let size = useComponentSize(innerWrapper)
  let { width } = size
  let height = width * aspectRatio
  return (
    <BackgroundImage
      style={{
        height,
      }}
      fluid={fluid}
      preserveStackingContext={true}
      className={className}
    >
      <div ref={innerWrapper}>{children}</div>
    </BackgroundImage>
  )
}

CoverImage.propTypes = {
  fluid: PropTypes.object.isRequired,
  aspectRatio: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
}

CoverImage.defaultProps = {
  aspectRatio: 0.5,
}

const loadResizeObserverPolyfills = WrappedComponent => {
  function supportsResizeObserver() {
    try {
      return (
        'ResizeObserver' in window &&
        'ResizeObserverEntry' in window &&
        'contentRect' in window.ResizeObserverEntry.prototype
      )
    } catch (e) {
      return false
    }
  }

  function loadPolyfills() {
    const polyfills = []

    if (!supportsResizeObserver()) {
      polyfills.push(import('resize-observer-polyfill'))
    }

    return Promise.all(polyfills)
  }

  return function(props) {
    const [polyfillsLoaded, setLoaded] = useState(supportsResizeObserver())
    useEffect(() => {
      if (!polyfillsLoaded) {
        loadPolyfills().then(() => {
          setLoaded(true)
        })
      }
    })
    return polyfillsLoaded ? <WrappedComponent {...props} /> : null
  }
}

export default loadResizeObserverPolyfills(CoverImage)
