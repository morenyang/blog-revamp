import routerHelper from './routerHelper'
import commonRouterHelper from '../../common/routerHelper'

jest.mock('../../common/routerHelper')

describe('Test router helper', () => {
  it('should export functions import from /common/routerHelper in routerHelper', () => {
    const funcNames = Object.keys(commonRouterHelper)
    funcNames.forEach(funcName => {
      jest.spyOn(commonRouterHelper, funcName)
    })
    funcNames.forEach(funcName => {
      const TEST_ARG = `TEST_${funcName}`

      expect(routerHelper).toHaveProperty(
        funcName,
        commonRouterHelper[funcName]
      )

      routerHelper[funcName](TEST_ARG)
      expect(commonRouterHelper[funcName]).toHaveBeenCalled()
      expect(commonRouterHelper[funcName]).toHaveBeenCalledWith(TEST_ARG)
    })
  })
})
