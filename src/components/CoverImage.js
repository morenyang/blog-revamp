import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from 'gatsby-background-image'
import useComponentSize from '@rehooks/component-size'
import 'resize-observer-polyfill'

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

export default CoverImage
