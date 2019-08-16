import React from 'react'
import { graphql } from 'gatsby'
import { Layout, SEO } from '../components/framework'
import PageHeader from '../components/PageHeader'
import ArticleList from '../components/ArticleList'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  const articles = edges.map(({ node }) => {
    const { id, frontmatter } = node
    const { title, description } = frontmatter

    return {
      id,
      title,
      description,
    }
  })

  return (
    <Layout>
      <SEO title={'Articles'} />
      <section>
        <PageHeader title={'Articles'} />
        <ArticleList articles={articles} />
      </section>
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
