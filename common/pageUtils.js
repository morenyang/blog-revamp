/**
 * get total page count
 * @param totalElements {number}
 * @param elementsPerPage {number}
 * @returns {number}
 */
const getTotalPages = (totalElements, elementsPerPage) =>
  elementsPerPage <= 0
    ? totalElements
    : Math.ceil(totalElements / elementsPerPage)

/**
 * has next page
 * @param currentPage {number} current page, pages index from 0
 * @param totalPages {number}
 * @returns {boolean}
 */
const hasNextPage = (currentPage, totalPages) => currentPage !== totalPages - 1

/**
 * has prev page
 * @param currentPage {number} current page, pages index from 0
 * @returns {boolean}
 */
const hasPrevPage = currentPage => currentPage !== 0

/**
 * get page element offset
 * @param currentPage {number} current page, pages index from 0
 * @param elementsPerPage {number}
 * @returns {number}
 */
const getPageElementOffset = (currentPage, elementsPerPage) =>
  currentPage * elementsPerPage

const createPageContext = ({
  currentPage,
  totalPages,
  elementsPerPage,
  getPathByPage,
}) => ({
  totalPages,
  currentPage,
  pageSize: elementsPerPage,
  postsOffset: getPageElementOffset(currentPage, elementsPerPage),
  prevPath: getPathByPage(currentPage - 1),
  nextPath: getPathByPage(currentPage + 1),
  hasPrev: hasPrevPage(currentPage),
  hasNext: hasNextPage(currentPage, totalPages),
})

module.exports = {
  hasNextPage,
  hasPrevPage,
  getTotalPages,
  getPageElementOffset,
  createPageContext,
}
