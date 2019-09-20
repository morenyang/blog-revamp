import React from 'react'
import styles from './index.module.scss'

import { Layout, SEO } from '../components/framework'
import HomepageBanner from '../components/homepage/HomepageBanner'
import RecentArticles from '../components/homepage/RecentArticles'

const IndexPage = () => (
  <Layout className={styles.homepageLayout}>
    <SEO title="Home" />
    <HomepageBanner />
    <RecentArticles />
  </Layout>
)

export default IndexPage
