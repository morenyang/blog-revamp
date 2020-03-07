import React from 'react'
import PropTypes from 'prop-types'
import styles from './Footer.module.scss'
import { Link } from 'gatsby'

const Footer = ({ author, source }) => {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} {` `} {author}
        </div>
        <div className={styles.footerLinks}>
          <Link to="/blogroll" title="Blogroll">
            Blogroll
          </Link>
        </div>
        {source && (
          <div className={styles.footerLinks}>
            <a href={source} target="_blank" rel="noopener noreferrer">
              View source on GitHub
            </a>
          </div>
        )}
      </footer>
    </div>
  )
}

Footer.propTypes = {
  author: PropTypes.string,
}

export default Footer
