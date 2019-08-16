import React from 'react'
import { graphql } from 'gatsby'
import { Layout, SEO } from '../components/framework'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title={'Articles'} />
      {edges.map(edge => (
        <h1 key={edge.node.id}>
          {edge.node.frontmatter.title}
          <span>{edge.node.frontmatter.description}</span>
        </h1>
      ))}
    </Layout>
  )
}

export default ArticlesPageTemplate

export const query = graphql`
  query PostPageTemplate($pageSize: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $pageSize
      skip: $postsOffset
      filter: { fields: { collection: { eq: "article" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            description
          }
        }
      }
    }
  }
`
