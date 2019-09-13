import articlesUtil from './articles'

describe('Test articlesUtil', () => {
  it('Should extra fields in article.frontmatter into article in articlesUtil.resolveArticle', () => {
    const article = {
      content: 'Hello World',
      frontmatter: {
        title: 'Title',
      },
    }

    const resolvedArticle = articlesUtil.resolveArticle(article)
    expect(resolvedArticle).toEqual({
      content: article.content,
      ...article.frontmatter,
    })
  })
})
