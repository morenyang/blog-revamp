import * as actions from './color'
import { COLOR as colorActionTypes } from '../actionTypes'

describe('Test color actions', () => {
  it('should return correct object in actions.setGradientColor', () => {
    const gradient = {
      from: 'FORM',
      to: 'TO',
    }
    const result = actions.setGradientColor(gradient)
    expect(result).toEqual({
      type: colorActionTypes.SET_GRADIENT,
      payload: gradient,
    })
  })

  it('should return correct object in actions.randomGradientColor', () => {
    const result = actions.randomGradientColor()
    expect(result).toEqual({
      type: colorActionTypes.RANDOM_GRADIENT,
    })
  })
})
