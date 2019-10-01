import store from './store'
import * as redux from 'redux'

const createStore = jest.spyOn(redux, 'createStore')

describe('Test store', () => {
  it('should be defined', () => {
    expect(store).toBeDefined()
  })
})
