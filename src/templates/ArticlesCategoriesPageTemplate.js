import React from 'react'
import { graphql } from 'gatsby'
import { startCase } from 'lodash'
import ArticleListPage from '../components/common/ArticleListPage'

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
    <ArticleListPage articles={articles} title={category} {...pageContext} />
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
        fields: {
          categories: { elemMatch: { category: { in: [$category] } } }
          collection: { eq: "article" }
        }
        frontmatter: { draft: { ne: true } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          fields {
            slug
            categories {
              category
              link
            }
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
