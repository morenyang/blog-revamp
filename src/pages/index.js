import React from 'react'

import { Layout, SEO } from '../components/framework'
import HomepageBanner from '../components/HomepageBanner'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <HomepageBanner />
  </Layout>
)

export default IndexPage
