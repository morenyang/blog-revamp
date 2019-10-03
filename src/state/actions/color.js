import { COLOR } from '../actionTypes'

export const setGradientColor = ({ from, to }) => {
  return {
    type: COLOR.SET_GRADIENT,
    payload: { from, to },
  }
}

export const randomGradientColor = () => {
  return { type: COLOR.RANDOM_GRADIENT }
}
