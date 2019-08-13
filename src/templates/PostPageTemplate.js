import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

const PostPageTemplate = ({ data, context }) => {
  console.log(data)
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      {edges.map(edge => (
        <h1>{edge.node.frontmatter.title}</h1>
      ))}
    </Layout>
  )
}

export default PostPageTemplate

export const query = graphql`
  query PostPageTemplate($pageSize: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $pageSize
      skip: $postsOffset
      filter: {}
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          frontmatter {
            title
            date
            description
          }
        }
      }
    }
  }
`
