import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from 'gatsby-background-image'

const getElementSize = el => {
  if (!el) {
    return {
      width: 0,
      height: 0,
    }
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  }
}

const CoverImage = ({ children, fluid, aspectRatio, className }) => {
  let innerWrapper = useRef(null)

  useEffect(() => {
    if (!innerWrapper.current) {
      return
    }
    const el = innerWrapper.current
    const handleResize = () => {
      const { width } = getElementSize(el)
      el.style.height = `${Math.round(width * aspectRatio)}px`
    }

    handleResize()

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(el)

    return function() {
      resizeObserver.disconnect()
    }
  })

  return (
    <BackgroundImage
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
