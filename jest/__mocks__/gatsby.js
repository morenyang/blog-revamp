const React = require('react')
const gatsby = jest.requireActual('gatsby')
module.exports = {
  ...gatsby,
  graphql: jest.fn().mockReturnValue({ value: 'MOCK_GRAPHQL' }),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
      activeClassName,
      activeStyle,
      getProps,
      innerRef,
      partiallyActive,
      ref,
      replace,
      to,
      children,
      ...rest
    }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    )
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
