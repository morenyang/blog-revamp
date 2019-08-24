import React from 'react'
import PropTypes from 'prop-types'
import { Layout, SEO } from '../framework'
import PageHeader from '../PageHeader'
import ArticleList from '../ArticleList'
import Pagination from '../Pagination'

const ArticleListPage = ({
  articles,
  title,
  description,
  ...paginationProps
}) => {
  return (
    <Layout>
      <SEO title={title} />
      <section>
        <PageHeader title={title} />
        <ArticleList articles={articles} />
        <Pagination {...paginationProps} />
      </section>
    </Layout>
  )
}

ArticleListPage.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  hasPrev: PropTypes.bool,
  hasNext: PropTypes.bool,
  prevPath: PropTypes.string,
  nextPath: PropTypes.string,
}

export default ArticleListPage
