import React from 'react'
import { Link } from 'gatsby'
import styles from './HomepageBanner.module.scss'

const HomepageBanner = () => {
  let bannerTextShadow = []
  for (let i = 0; i < 1000; i++) {
    bannerTextShadow.push(`${i}px ${i}px #e8e8e8`)
  }

  return (
    <div className={styles.homepageBanner}>
      <div className={styles.homepageBannerInner}>
        <div
          className={styles.banner}
          style={{ textShadow: bannerTextShadow.join(', ') }}
        >
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
