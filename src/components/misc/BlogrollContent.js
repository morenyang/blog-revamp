import React from 'react'
import PageHeader from '../common/PageHeader'
import { ColorfulAnchor } from '../common/ColorfulText'
import style from './BlogrollContent.module.scss'

const BlogrollContent = ({ blogroll }) => {
  const hasBlogroll = Array.isArray(blogroll) && blogroll.length > 0

  return (
    <section>
      <PageHeader title="Blogroll" />
      <div className={style.blogroll}>
        {!hasBlogroll && <p>Oops, seems no link here. </p>}
        {hasBlogroll && (
          <ul>
            {blogroll.map(item => (
              <li>
                <ColorfulAnchor
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </ColorfulAnchor>{' '}
                {item.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default BlogrollContent
