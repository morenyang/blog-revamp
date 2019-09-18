import React from 'react'
import { graphql } from 'gatsby'
import ArticleListPage from '../components/article/ArticleListPage'
import { resolveArticle } from '../utils/articles'

const ArticlesPageTemplate = ({ data, pageContext }) => {
  const { title, ...restPageContext } = pageContext

  const { edges } = data.allMarkdownRemark

  const articles = edges.map(({ node }) => resolveArticle(node))

  return (
    <ArticleListPage
      title={'Articles'}
      articles={articles}
      {...restPageContext}
    />
  )
}

export default ArticlesPageTemplate

export const query = graphql`
  query ArticlesPage($pageSize: Int!, $postsOffset: Int!) {
    allMarkdownRemark(
      limit: $pageSize
      skip: $postsOffset
      filter: {
        fields: { collection: { eq: "article" }, released: { ne: false } }
      }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      ...ArticlesPageArticleMetadata
    }
  }
`
