import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'
import Header from './Header'

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
    <>
      <Header
        title={siteMetadata.title}
        headerLinks={siteMetadata.headerLinks}
      />
      <main>{props.children}</main>
    </>
  )
}

const propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.propTypes = propTypes

export default Layout
