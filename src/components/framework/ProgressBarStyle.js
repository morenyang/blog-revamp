import React, { useContext } from 'react'
import { createGlobalStyle } from 'styled-components'
import { ThemeContext } from './ThemeProvider'

const ProgressBarStyle = createGlobalStyle`
  #nprogress {
    .peg{
      box-shadow: 0 0 10px ${props => props.gradient.to}, 0 0 5px ${props =>
  props.gradient.to};
    }

    .bar {
    background-image: linear-gradient(45deg,${props =>
      props.gradient.from} 50%, ${props => props.gradient.to});
  }}
`

const ProgressBarStyleWrapper = () => {
  const { isGradient, gradient: themeGradient } = useContext(ThemeContext)
  const gradientProps = isGradient
    ? themeGradient
    : { from: '#777', to: '#777' }
  return <ProgressBarStyle gradient={gradientProps} />
}

export default ProgressBarStyleWrapper
