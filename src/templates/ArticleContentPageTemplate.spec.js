import React from 'react'
import ArticleContentPage from './ArticleContentPageTemplate'
import { shallow } from 'enzyme'
import { graphql } from 'gatsby'
import articleUtils from '../utils/articles'
import ArticleContent from '../components/article/ArticleContent'

jest.mock('gatsby')
jest.mock('../utils/articles')

describe('<ArticleContentPage />', () => {
  it('should be defined', () => {
    expect(ArticleContentPage).toBeDefined()
  })

  it('should call graphql and render correct components', () => {
    const data = {
      markdownRemark: {
        id: 'TEST_ID',
        frontmatter: {
          title: 'TEST_TITLE',
        },
      },
    }

    const resolveArticle = jest
      .spyOn(articleUtils, 'resolveArticle')
      .mockReturnValue({ id: 'TEST_ID', title: 'TEST_TITLE' })
    const wrapper = shallow(<ArticleContentPage data={data} />)
    expect(graphql).toBeCalledTimes(1)

    expect(resolveArticle).toHaveBeenCalled()
    expect(resolveArticle).toHaveBeenCalledWith(data.markdownRemark)

    const articleContent = wrapper.find(ArticleContent)
    expect(articleContent).toBeDefined()
    expect(articleContent.props()).toHaveProperty('article')
    expect(articleContent.prop('article')).toEqual({
      id: 'TEST_ID',
      title: 'TEST_TITLE',
    })
  })
})
