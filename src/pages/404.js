import React, { useEffect, useState } from 'react'
import { Layout, SEO } from '../components/framework'
import styles from './404.module.scss'
import { Link } from 'gatsby'

export default () => {
  const [pathname, setPathname] = useState(undefined)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname)
    }
  }, [])
  return (
    <Layout>
      <SEO title="404: Not found" />
      <div className={styles.notFoundPage}>
        <h1>Oops!</h1>
        <h2 className={styles.errorTitle}>404 Page Not Found</h2>
        <p className={styles.errorDescription}>
          The requested URL
          {pathname && <span className={styles.location}> {pathname}</span>} was
          not found on this application.
        </p>
        <Link to={'/'}>
          <button className={styles.btn}>View Homepage&nbsp; ›</button>
        </Link>
      </div>
    </Layout>
  )
}
