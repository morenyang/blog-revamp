import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import Header from './Header'
import styles from './Layout.module.scss'
import Footer from './Footer'

const Layout = props => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          headerLinks {
            name
            path
          }
        }
      }
    }
  `)

  const { siteMetadata } = data.site

  return (
    <div className={styles.flexWrapper}>
      <Header
        title={siteMetadata.title}
        headerLinks={siteMetadata.headerLinks}
      />
      <div className={styles.mainWrapper}>
        <main>{props.children}</main>
      </div>
      <Footer />
    </div>
  )
}

const propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.propTypes = propTypes

export default Layout
