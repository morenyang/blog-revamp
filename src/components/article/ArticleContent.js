import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleContent.module.scss'
import CoverImage from '../common/CoverImage'
import classnames from 'classnames'
import moment from 'moment'
import { Link } from 'gatsby'
import { startCase } from 'lodash'
import { ColorfulLinkWrapper } from '../common/ColorfulLink'

import '../../scss/prism-syntax.scss'

const ArticleContent = ({ article }) => {
  const { coverImage } = article
  return (
    <div>
      {coverImage && (
        <CoverImage
          fluid={article.coverImage.childImageSharp.fluid}
          aspectRatio={0.382}
        />
      )}
      <div className={styles.titleBarWrapper}>
        <div
          className={classnames(styles.titleBar, {
            [styles.widthCoverImage]: !!coverImage,
          })}
        >
          <h2>{article.title}</h2>
          <h3>{article.description}</h3>
          <div className={styles.meta}>
            {moment(article.date).format('MMMM DD, YYYY')}
            <span className={styles.categories}>
              {article.fields.categories
                .map((item, index) => (
                  <Link
                    key={index}
                    to={`${item.link}`}
                    className={styles.category}
                  >
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
        </div>
      </div>
      <div className={styles.articleContent}>
        <ColorfulLinkWrapper
          className={styles.articleContentInner}
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </div>
    </div>
  )
}

ArticleContent.propTypes = {
  article: PropTypes.object.isRequired,
}

export default ArticleContent
