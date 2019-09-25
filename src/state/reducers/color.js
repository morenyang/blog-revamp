import { COLOR } from '../actionTypes'
import gradientColors from '../../constants/gradientColors'
import _ from 'lodash'

function getRandomGradientColor(state = {}) {
  const gradientColorNames = Object.keys(gradientColors)
  if (
    state.gradient &&
    state.gradient.hasOwnProperty('name') &&
    gradientColorNames.includes(color.gradient.name)
  ) {
    _.remove(gradientColorNames, name => name === color.gradient.name)
  }
  const index = Math.floor(Math.random() * gradientColorNames.length)
  const gradientColorName = gradientColorNames[index]
  return {
    name: gradientColorName,
    ...gradientColors[gradientColorName],
  }
}

const initialState = {
  isGradient: true,
  gradient: getRandomGradientColor(),
}

const color = (state = initialState, action) => {
  switch (action.type) {
    case COLOR.SET_GRADIENT:
      const gradient = action.payload
      if (!gradient.hasOwnProperty('from') || !gradient.hasOwnProperty('to')) {
        return state
      }
      return { ...state, isGradient: true, gradient: { ...action.payload } }
    case COLOR.RANDOM_GRADIENT:
      return {
        ...state,
        isGradient: true,
        gradient: getRandomGradientColor(state),
      }
    case COLOR.CLEAR_GRADIENT:
      return {
        ...state,
        isGradient: false,
        gradient: { from: undefined, to: undefined },
      }
    default:
      return state
  }
}

export default color
