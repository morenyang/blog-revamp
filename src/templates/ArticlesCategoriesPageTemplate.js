import React from 'react'
import { graphql } from 'gatsby'
import { startCase } from 'lodash'
import ArticleListPage from '../components/article/ArticleListPage'
import { resolveArticle } from '../utils/articles'

const ArticlesCategoriesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  const category = startCase(pageContext.category)

  const articles = edges.map(({ node }) => resolveArticle(node))

  return (
    <ArticleListPage articles={articles} title={category} {...pageContext} />
  )
}

export default ArticlesCategoriesPageTemplate

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
          released: { ne: false }
        }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      ...ArticlesPageArticleMetadata
    }
  }
`
