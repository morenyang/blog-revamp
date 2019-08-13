'use strict'

const path = require('path')
const siteConfig = require('../site-config')

const createPostPage = async ({ graphql, actions }) => {
  const { createPage } = actions

  const posts = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: {} }) {
        totalCount
      }
    }
  `)
  const postPerPage = siteConfig.postPerPage
  const totalPages = Math.ceil(
    posts.data.allMarkdownRemark.totalCount / postPerPage
  )

  const getPath = currentPage => {
    return `/posts/${currentPage++ || ``}`
  }

  const getContext = currentPage => {
    return {
      currentPage,
      pageSize: postPerPage,
      postsOffset: currentPage * postPerPage,
      prevPath: getPath(currentPage - 1),
      nextPath: getPath(currentPage + 1),
      hasPrev: currentPage !== 0,
      hasNext: currentPage !== totalPages - 1,
    }
  }

  const createPostPage = currentPage => {
    console.log(getContext(currentPage))
    createPage({
      path: getPath(currentPage),
      component: path.resolve(`./src/templates/PostPageTemplate.js`),
      context: getContext(currentPage),
    })
  }

  for (let i = 0; i < totalPages; i++) {
    createPostPage(i)
  }
}

module.exports = createPostPage
