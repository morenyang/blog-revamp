import React from 'react'
import PropTypes from 'prop-types'
import styles from './PageHeader.module.scss'

const PageHeader = ({ title, description }) => {
  return (
    <div className={styles.pageHeader}>
      <h1>{title}</h1>
      {description && <h3>{description}</h3>}
    </div>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

export default PageHeader
