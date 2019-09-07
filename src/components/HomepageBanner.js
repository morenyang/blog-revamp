import React from 'react'
import styles from './HomepageBanner.module.scss'

const HomepageBanner = () => {
  return (
    <div className={styles.homepageBanner}>
      <div className={styles.homepageBannerInner}>
        <div className={styles.banner}>
          Cool things <br />
          inside.
        </div>
      </div>
    </div>
  )
}

export default HomepageBanner
