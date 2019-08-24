import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleCard.module.scss'
import CoverImage from './CoverImage'
import { Link } from 'gatsby'
import moment from 'moment'
import routerHelper from '../utils/routerHelper'
import { startCase, join } from 'lodash'

const getPath = routerHelper.getPathBySlugFactory(`articles`)

const ArticleCard = ({ article }) => {
  const { title, description, fields, date } = article
  const articleUrl = getPath(fields.slug)
  return (
    <article className={styles.articleCard} id={`article-${article.id}`}>
      {article.coverImage && (
        <Link to={articleUrl} className={styles.coverImageWrapper}>
          <CoverImage fluid={article.coverImage.childImageSharp.fluid} />
        </Link>
      )}
      <Link className={styles.cardTitle} to={articleUrl}>
        <h2>{title}</h2>
        {description && (
          <h3>
            {` `}
            {description}
          </h3>
        )}
      </Link>
      <div className={styles.meta}>
        <span>{moment(date).format('MMMM DD, YYYY')}</span>
        <span className={styles.categories}>
          {article.fields.categories
            .map(item => (
              <Link to={`${item.link}`} className={styles.category}>
                {startCase(item.category)}
              </Link>
            ))
            .reduce(
              (acc, current, index) =>
                index ? [...acc, ', ', current] : [...acc, current],
              []
            )}
        </span>
      </div>
    </article>
  )
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    date: PropTypes.string,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
    coverImage: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.object.isRequired,
      }).isRequired,
    }),
  }),
}

export default ArticleCard
