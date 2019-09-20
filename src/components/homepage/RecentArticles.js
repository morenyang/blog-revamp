import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { resolveArticle } from '../../utils/articles'
import ArticleList from '../article/ArticleList'
import styles from './RecentArticles.module.scss'

const RecentArticles = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        limit: 2
        filter: {
          fields: { collection: { eq: "article" }, released: { ne: false } }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        ...ArticlesPageArticleMetadata
      }
    }
  `)

  const { edges } = allMarkdownRemark

  if (edges.length < 2) {
    return null
  }

  return (
    <div className={styles.recentArticles}>
      <h3 className={styles.sectionTitle}>RECENT ARTICLES</h3>
      <ArticleList
        articles={edges.map(({ node }) => node).map(resolveArticle)}
        grids={2}
      />
    </div>
  )
}

export default RecentArticles
