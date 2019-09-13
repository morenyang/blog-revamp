import React from 'react'
import { graphql } from 'gatsby'
import ArticleListPage from '../components/article/ArticleListPage'
import { resolveArticle } from '../utils/articles'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark

  const articles = edges.map(({ node }) => resolveArticle(node))

  return (
    <ArticleListPage title={'Articles'} articles={articles} {...pageContext} />
  )
}

export default ArticlesPageTemplate

export const query = graphql`
  query ArticlesPage($pageSize: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $pageSize
      skip: $postsOffset
      filter: {
        fields: { collection: { eq: "article" } }
        frontmatter: { draft: { ne: true } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      ...ArticlesPageArticleMetadata
    }
  }
`
