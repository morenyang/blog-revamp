import React from 'react'
import PropTypes from 'prop-types'
import styles from './Footer.module.scss'

const Footer = ({ author }) => {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={styles.footerCopyright}>
          © {new Date().getFullYear()} {` `} {author}
        </div>
      </footer>
    </div>
  )
}

Footer.propTypes = {
  author: PropTypes.string,
}

export default Footer
