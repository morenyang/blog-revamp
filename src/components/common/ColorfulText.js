import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { randomGradientColor } from '../../state/actions/color'
import styled from 'styled-components'

const mapStateToProps = ({ color }) => ({
  isGradient: color.isGradient,
  gradient: color.gradient,
})

const mapDispatchToProps = dispatch => {
  return {
    randomGradientColor: bindActionCreators(randomGradientColor, dispatch),
  }
}

const connectComponent = component =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)

const getTextDecoration = props =>
  `text-decoration: ${
    props.isGradient ? props.gradient.from : props.default || '#333'
  } solid underline;`

const getTextGradient = props =>
  `${
    props.isGradient
      ? `
    background-image: linear-gradient(45deg, ${props.gradient.from} 50%, ${props.gradient.to});
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;`
      : `color: ${props.default || '#333'}`
  }
  }`

const getStyledLinkHover = props => `
&:hover {
  ${getTextGradient(props)}
}
`

const WrappedColorfulAnchor = styled.a`
  ${props => getTextDecoration(props)}
  ${props => getStyledLinkHover(props)}
`

export const ColorfulAnchor = connectComponent(WrappedColorfulAnchor)
ColorfulAnchor.defaultProps = {
  default: '#0052cc',
}

const WrappedColorfulLinkWrapper = styled.div`
  a {
    ${props => getTextDecoration(props)}
    ${props => getStyledLinkHover(props)}
  }
`

export const ColorfulLinkWrapper = connectComponent(WrappedColorfulLinkWrapper)
ColorfulLinkWrapper.defaultProps = {
  default: '#0052cc',
}

const ColorfulTextInner = ({
  children,
  enableClick,
  randomGradientColor: randomGradient,
  className,
}) => {
  const handleTextClick = () => {
    enableClick && randomGradient()
  }
  return (
    <span className={className} onClick={handleTextClick}>
      {children}
    </span>
  )
}

ColorfulTextInner.defaultProps = {
  enableClick: false,
}

const WrappedColorfulText = styled(ColorfulTextInner)`
  ${props => getTextGradient(props)}
  user-select: none;
`

export const ColorfulText = connectComponent(WrappedColorfulText)
