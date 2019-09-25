import { COLOR } from '../actionTypes'
import gradientColors from '../../constants/gradientColors'
import store from '../store'
import _ from 'lodash'

export const setGradientColor = ({ from, to }) => {
  return {
    type: COLOR.SET_GRADIENT,
    payload: { from, to },
  }
}

export const randomGradientColor = () => {
  const gradientColorNames = Object.keys(gradientColors)
  const { color } = store.getState()
  if (
    color.gradient.hasOwnProperty('name') &&
    gradientColorNames.includes(color.gradient.name)
  ) {
    _.remove(gradientColorNames, name => name === color.gradient.name)
  }
  const index = Math.floor(Math.random() * gradientColorNames.length)
  const gradientColorName = gradientColorNames[index]
  return {
    type: COLOR.SET_GRADIENT,
    payload: {
      name: gradientColorName,
      ...gradientColors[gradientColorName],
    },
  }
}
