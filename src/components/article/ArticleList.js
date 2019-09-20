import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleList.module.scss'
import ArticleCard from './ArticleCard'

const ArticleList = ({ articles, grids }) => {
  return (
    <div className={styles.articleList}>
      {articles.map(article => (
        <ArticleCard article={article} key={article.id} grids={grids} />
      ))}
    </div>
  )
}

ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  grids: PropTypes.oneOf([2, 3]),
}

ArticleList.defaultProps = {
  grids: 3,
}

export default ArticleList
