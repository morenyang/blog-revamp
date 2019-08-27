import { graphql } from 'gatsby'

export const articlesPageArticleMetadata = graphql`
  fragment ArticlesPageArticleMetadata on MarkdownRemarkConnection {
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
`

export const articleContent = graphql`
  fragment ArticleContent on MarkdownRemark {
    id
    html
    fields {
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
          fluid(maxWidth: 1440, toFormat: WEBP) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`
