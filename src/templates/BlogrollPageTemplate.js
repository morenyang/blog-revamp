import React from 'react'
import BlogrollPageContent from '../components/misc/BlogrollContent'
import { Layout, SEO } from '../components/framework'

const BlogrollPage = ({ pageContext }) => {
  const { blogroll } = pageContext
  return (
    <Layout>
      <SEO title="Blogroll" />
      <BlogrollPageContent blogroll={blogroll} />
    </Layout>
  )
}

export default BlogrollPage
