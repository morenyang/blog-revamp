import React from 'react'
import PropTypes from 'prop-types'
import styles from './Footer.module.scss'

const Footer = ({ author }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerCopyright}>
        © {new Date().getFullYear()} {` `} {author}
      </div>
    </footer>
  )
}

Footer.propTypes = {
  author: PropTypes.string,
}

export default Footer
