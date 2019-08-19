import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styles from './Pagination.module.scss'
import classnames from 'classnames'

const Pagination = ({ hasPrev, hasNext, prevPath, nextPath }) => {
  const renderPagination = hasPrev || hasNext

  console.log(prevPath, nextPath)

  if (!renderPagination) {
    return null
  }

  return (
    <div className={styles.pagination}>
      {hasPrev && (
        <Link to={prevPath} className={styles.paginationBtnWrapper}>
          <button className={styles.paginationBtn}>‹ &nbsp;Prev</button>
        </Link>
      )}
      {hasNext && (
        <Link to={nextPath} className={styles.paginationBtnWrapper}>
          <button className={classnames(styles.paginationBtn, styles.main)}>
            Next&nbsp; ›
          </button>
        </Link>
      )}
    </div>
  )
}

Pagination.propTypes = {
  hasPrev: PropTypes.bool,
  hasNext: PropTypes.bool,
  prevPath: PropTypes.string,
  nextPath: PropTypes.string,
}

export default Pagination
