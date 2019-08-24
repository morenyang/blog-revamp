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

module.exports = {
  getPathByPageFactory,
  getPathBySlugFactory,
}
