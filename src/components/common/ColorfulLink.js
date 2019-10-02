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

const getStyledLinkHover = props => `
  text-decoration: ${props.isGradient ? props.gradient.from : '#0052cc'}
    solid underline;
  &:hover {
    ${
      props.isGradient
        ? `
    background-image: linear-gradient(45deg, ${props.gradient.from} 50%, ${props.gradient.to});
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;`
        : `color: '#0052cc'`
    }
  }
`

const WrappedColorfulAnchor = styled.a`
  ${props => getStyledLinkHover(props)}
`

export const ColorfulAnchor = connectComponent(WrappedColorfulAnchor)

const WrappedColorfulLinkWrapper = styled.div`
  a {
    ${props => getStyledLinkHover(props)}
  }
`

export const ColorfulLinkWrapper = connectComponent(WrappedColorfulLinkWrapper)
