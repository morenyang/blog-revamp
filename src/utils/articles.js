export const resolveArticle = article => {
  const { frontmatter, ...rest } = article
  return {
    ...rest,
    ...frontmatter,
  }
}

export default {
  resolveArticle,
}
