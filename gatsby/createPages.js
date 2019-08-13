const createPostPages = require('./createPostPages')

const createPages = async ({ graphql, actions }) => {
  await createPostPages({ graphql, actions })
}

module.exports = createPages
