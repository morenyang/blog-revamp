import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleList.module.scss'
import ArticleCard from './ArticleCard'

const ArticleList = ({ articles }) => {
  return (
    <div className={styles.articleList}>
      {articles.map(article => (
        <ArticleCard article={article} />
      ))}
    </div>
  )
}

ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object),
}

export default ArticleList
