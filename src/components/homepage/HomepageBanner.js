import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import styles from './HomepageBanner.module.scss'
import HomePageBannerGallery from './HomepageBannerGallery'
import { ParentSize } from '@vx/responsive'

const HomepageBanner = () => {
  const bannerText = (
    <>
      <strong>Cool things</strong> <br />
      inside.
    </>
  )

  const [bannerTextShadow, setShadow] = useState('')

  useEffect(() => {
    let shadow = []
    for (let i = 0; i < 1000; i++) {
      shadow.push(`${i}px ${i}px #e8e8e8`)
    }
    setShadow(shadow.join(', '))
  }, [])

  return (
    <>
      <div className={styles.homepageBanner}>
        <ParentSize className={styles.bannerGallery}>
          {props => <HomePageBannerGallery {...props} />}
        </ParentSize>
        <div className={styles.homepageBannerInner}>
          <div className={styles.banner}>
            <div
              className={styles.bannerShadow}
              style={{ textShadow: bannerTextShadow }}
            >
              {bannerText}
            </div>
            <div className={styles.bannerInner}>{bannerText}</div>
          </div>
          <div className={styles.bannerFeature}>
            <Link to={'/articles'}>
              <button className={styles.featureBtn}>
                View Articles&nbsp; ›
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomepageBanner
