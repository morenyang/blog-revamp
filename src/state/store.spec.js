import store from './store'

describe('Test store', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
  })
  it('should be defined', () => {
    expect(store).toBeDefined()
  })
})
