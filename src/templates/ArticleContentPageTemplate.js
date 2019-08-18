import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout, { SEO } from '../components/framework'
import ArticleContent from '../components/ArticleContent'

const ArticleContentPage = ({ data }) => {
  const { markdownRemark } = data

  const title = markdownRemark.frontmatter.title
  const { frontmatter, ...rest } = markdownRemark
  const article = {
    ...rest,
    ...frontmatter,
  }
  return (
    <Layout className="site-content">
      <SEO title={title} />
      <ArticleContent article={article} />
    </Layout>
  )
}

ArticleContentPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      id: PropTypes.string.isRequired,
      frontmatter: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
}

export const query = graphql`
  query ArticleContentById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
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
  }
`

export default ArticleContentPage
