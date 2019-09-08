import React from 'react'
import { Link } from 'gatsby'
import styles from './HomepageBanner.module.scss'

const HomepageBanner = () => {
  return (
    <div className={styles.homepageBanner}>
      <div className={styles.homepageBannerInner}>
        <div className={styles.banner}>
          <strong>Cool things</strong> <br />
          inside.
        </div>
        <div className={styles.bannerFeature}>
          <Link to={'/articles'}>
            <button className={styles.featureBtn}>View Articles&nbsp; ›</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomepageBanner
