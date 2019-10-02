import reducer, * as color from './color'
import gradientColors from '../../constants/gradientColors'
import _ from 'lodash'
import { COLOR } from '../actionTypes'

describe('Test color reducer', () => {
  const initState = {
    isGradient: true,
    gradient: {
      name: 'INIT_NAME',
      from: 'INIT_FORM',
      to: 'INIT_TO',
    },
  }

  it('should be defined', () => {
    expect(reducer).toBeDefined()
  })

  it('should remove correct object in color.getRandomGradientColor', () => {
    const currentGradientName = Object.keys(gradientColors).pop()
    const remove = jest.spyOn(_, 'remove')
    const state = {
      gradient: {
        name: currentGradientName,
      },
    }
    color.getRandomGradientColor(state)
    expect(remove).toHaveBeenCalled()
    const filterFunc = remove.mock.calls[0][1]
    expect(filterFunc(currentGradientName)).toBeTruthy()
  })

  describe('Test reducers', () => {
    it('should return correct state given action.type is COLOR.SET_GRADIENT', () => {
      const action = {
        type: COLOR.SET_GRADIENT,
        payload: {
          name: 'TEST_NAME',
          from: 'TEST_FORM',
          to: 'TEST_TO',
        },
      }
      const result = reducer(initState, action)
      expect(result).toEqual({
        ...initState,
        isGradient: true,
        gradient: { name: 'TEST_NAME', from: 'TEST_FORM', to: 'TEST_TO' },
      })
    })

    it('should return origin state given action.type is COLOR.SET_GRADIENT and payload does not contain from ', () => {
      const action = {
        type: COLOR.SET_GRADIENT,
        payload: {
          name: 'TEST_NAME',
          to: 'TEST_TO',
        },
      }
      const result = reducer(initState, action)
      expect(result).toEqual(initState)
    })

    it('should call color.getRandomGradientColor and return correct state given ation.type is COLOR.RANDOM_GRADIENT', () => {
      const gradientNames = Object.keys(gradientColors)
      const action = {
        type: COLOR.RANDOM_GRADIENT,
      }
      const result = color.default(initState, action)
      expect(result.isGradient).toBe(true)
      const actualGradientName = result.gradient.name
      expect(gradientNames.includes(actualGradientName)).toBeTruthy()
      expect(result.gradient.from).toBe(gradientColors[actualGradientName].from)
      expect(result.gradient.to).toBe(gradientColors[actualGradientName].to)
    })

    it('should clear state given action.type is COLOR.RANDOM_GRADIENT', () => {
      const action = {
        type: COLOR.CLEAR_GRADIENT,
      }

      const result = reducer(initState, action)
      expect(result).toEqual({
        ...initState,
        isGradient: false,
        gradient: { from: undefined, to: undefined },
      })
    })

    it('should return origin state by default', () => {
      const action = {
        type: 'UNDEFINED',
      }
      const result = reducer(initState, action)
      expect(result).toEqual(initState)
    })
  })
})
