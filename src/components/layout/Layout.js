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
        }
      }
    }
  `)

  return (
    <>
      <Header title={data.site.siteMetadata.title} />
      <main>{props.children}</main>
    </>
  )
}

const propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.propTypes = propTypes

export default Layout
