const pageUtils = require('./pageUtils')

describe('Test pageUtils', () => {
  describe('Test getPageCount', () => {
    it('should return 0 given totalElements is 0', () => {
      const totalElements = 0
      const elementsPerPage = 1

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(0)
    })

    it('should return 1 given totalElements is 9 and elementsPerPage is 10', () => {
      const totalElements = 9
      const elementsPerPage = 10

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(1)
    })

    it('should return 1 given totalElements is 10 and elementsPerPage is 10', () => {
      const totalElements = 10
      const elementsPerPage = 10

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(1)
    })

    it('should return 2 given totalElements is 11 and elementsPerPage is 10', () => {
      const totalElements = 11
      const elementsPerPage = 10

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(2)
    })

    it('should return 0 given totalElements is 10 and elementsPerPage is 0', () => {
      const totalElements = 10
      const elementsPerPage = 0

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(10)
    })

    it('should return 0 given totalElements is 10 and elementsPerPage is -1', () => {
      const totalElements = 10
      const elementsPerPage = -1

      expect(pageUtils.getTotalPages(totalElements, elementsPerPage)).toBe(10)
    })
  })

  describe('Test hasNextPage', () => {
    it('should return false given currentPage is 0 and totalPages is 1', () => {
      const currentPage = 0
      const totalPage = 1
      expect(pageUtils.hasNextPage(currentPage, totalPage)).toBe(false)
    })

    it('should return true given currentPage is 1 and totalPages is 3', () => {
      const currentPage = 1
      const totalPage = 3
      expect(pageUtils.hasNextPage(currentPage, totalPage)).toBe(true)
    })
  })

  describe('Test hasPrevPage', () => {
    it('should return false given currentPage is 0', () => {
      const currentPage = 0
      expect(pageUtils.hasPrevPage(currentPage)).toBe(false)
    })

    it('should return true given currentPage is 1', () => {
      const currentPage = 1
      expect(pageUtils.hasPrevPage(currentPage)).toBe(true)
    })
  })

  describe('Test getPageElementOffset', () => {
    it('should return 20 given currentPage is 2 and elementsPerPage is 10', () => {
      const currentPage = 2
      const elementsPerPage = 10
      expect(pageUtils.getPageElementOffset(currentPage, elementsPerPage)).toBe(
        20
      )
    })
  })

  describe('Test createPageContext', () => {
    it('should return correct arguments and call correct funcs', () => {
      const currentPage = 2
      const totalPages = 4
      const elementsPerPage = 10
      const getPathByPage = jest.fn()
      getPathByPage.mockReturnValue('TEST_PATH')

      const pageContext = pageUtils.createPageContext({
        currentPage,
        totalPages,
        elementsPerPage,
        getPathByPage,
      })

      expect(pageContext).toEqual({
        totalPages,
        currentPage,
        pageSize: elementsPerPage,
        postsOffset: 20,
        prevPath: 'TEST_PATH',
        nextPath: 'TEST_PATH',
        hasPrev: true,
        hasNext: true,
      })

      expect(getPathByPage).toHaveBeenCalledTimes(2)
      expect(getPathByPage).toHaveBeenCalledWith(1)
      expect(getPathByPage).toHaveBeenCalledWith(3)
    })
  })
})
