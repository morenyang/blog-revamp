const _ = require('lodash')

function getPathByPageFactory(prefix) {
  return function(page = 0) {
    let pageString = ``
    if (page) {
      pageString = page + 1
    }
    return `/${prefix}/${pageString}`.replace(/\/\//g, '/')
  }
}

function getPathBySlugFactory(prefix) {
  return function(slug) {
    return `/${prefix}/${slug}`.replace(/\/\//g, '/')
  }
}

function getCategoryPathByPage(category, page = 0) {
  return getPathByPageFactory(`/category/${_.kebabCase(category)}`)(page)
}

module.exports = {
  getPathByPageFactory,
  getPathBySlugFactory,
  getCategoryPathByPage,
}
