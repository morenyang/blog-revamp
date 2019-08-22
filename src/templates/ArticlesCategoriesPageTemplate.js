import React from 'react'
import { graphql } from 'gatsby'
import { Layout, SEO } from '../components/framework'
import PageHeader from '../components/PageHeader'
import ArticleList from '../components/ArticleList'
import Pagination from '../components/Pagination'
import { startCase } from 'lodash'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  const category = startCase(pageContext.category)

  const articles = edges.map(({ node }) => {
    const { frontmatter, ...rest } = node

    return {
      ...rest,
      ...frontmatter,
    }
  })

  return (
    <Layout>
      <SEO title={category} />
      <section>
        <PageHeader title={category} />
        <ArticleList articles={articles} />
        <Pagination {...pageContext} />
      </section>
    </Layout>
  )
}

export default ArticlesPageTemplate

export const query = graphql`
  query ArticlesCategoriesPage(
    $category: String
    $pageSize: Int!
    $postsOffset: Int!
  ) {
    allMarkdownRemark(
      limit: $pageSize
      skip: $postsOffset
      filter: {
        fields: { collection: { eq: "article" } }
        frontmatter: { categories: { in: [$category] }, draft: { ne: true } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
            coverImage {
              childImageSharp {
                fluid(maxWidth: 800, toFormat: WEBP) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
