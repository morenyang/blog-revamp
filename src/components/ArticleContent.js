import React from 'react'
import PropTypes from 'prop-types'
import styles from './ArticleContent.module.scss'
import CoverImage from './CoverImage'
import classnames from 'classnames'

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
        </div>
      </div>
      <div className={styles.articleContent}>
        <div
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
