import React from 'react'
import styles from './index.module.scss'

import { Layout, SEO } from '../components/framework'
import HomepageBanner from '../components/HomepageBanner'

const IndexPage = () => (
  <Layout className={styles.homepageLayout}>
    <SEO title="Home" />
    <HomepageBanner />
  </Layout>
)

export default IndexPage
