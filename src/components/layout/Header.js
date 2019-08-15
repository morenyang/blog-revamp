import React from 'react'
import PropTypes from 'prop-types'
import styles from './Header.module.scss'
import { Link } from 'gatsby'

const Header = ({ title, headerLinks }) => {
  return (
    <div className={styles.headerWrapper}>
      <header className={styles.siteHeader}>
        <div className={styles.headerBrand}>
          <Link to={`/`}>
            <div className={styles.headerTitle}>{title}</div>
          </Link>
        </div>
      </header>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  headerLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      match: PropTypes.string,
    })
  ),
}

Header.defaultProps = {
  title: '',
  headerLinks: [],
}

export default Header
