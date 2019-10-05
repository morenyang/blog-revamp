import * as actionTypes from './actionTypes'

describe('Test action types', () => {
  it('should be defined', () => {
    expect(actionTypes).toBeDefined()
  })

  it('should have correct actions in actionsTypes.COLOR', () => {
    expect(actionTypes.COLOR).toBeDefined()
    const { COLOR } = actionTypes
    expect(COLOR.SET_GRADIENT).toBeDefined()
    expect(COLOR.RANDOM_GRADIENT).toBeDefined()
    expect(COLOR.CLEAR_GRADIENT).toBeDefined()
  })
})
