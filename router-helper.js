function getPathByPageFactory(prefix) {
  return function(page) {
    let pageSting = ``
    if (page) {
      pageSting = page + 1
    }
    return `/${prefix}/${pageSting}`.replace(/\/\//g, '/')
  }
}

function getPathBySlugFactory(prefix) {
  return function(slug) {
    return `/${prefix}/${slug}`.replace(/\/\//g, '/')
  }
}

module.exports = {
  getPathByPageFactory,
  getPathBySlugFactory,
}
