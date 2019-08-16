import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleCard.module.scss'

const ArticleCard = ({ article }) => {
  const { title, description } = article
  return (
    <article className={styles.articleCard}>
      <h2>{title}</h2>
      {description && (
        <h3>
          {` `}
          {description}
        </h3>
      )}
    </article>
  )
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
}

export default ArticleCard
