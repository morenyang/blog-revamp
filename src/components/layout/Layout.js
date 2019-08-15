import React from 'react'
import PropTypes from 'prop-types'
import { graphql, useStaticQuery } from 'gatsby'

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
      <h1>{data.site.siteMetadata.title}</h1>
      <main>{props.children}</main>
    </>
  )
}

const propTypes = {
  children: PropTypes.node.isRequired,
}

Layout.propTypes = propTypes

export default Layout
