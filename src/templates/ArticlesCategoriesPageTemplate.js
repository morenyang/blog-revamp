import React from 'react'
import { graphql } from 'gatsby'
import { startCase } from 'lodash'
import ArticleListPage from '../components/article/ArticleListPage'
import { resolveArticle } from '../utils/articles'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  const category = startCase(pageContext.category)

  const articles = edges.map(({ node }) => resolveArticle(node))

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
      ...ArticlesPageArticleMetadata
    }
  }
`
