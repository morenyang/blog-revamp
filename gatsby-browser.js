/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import wrapWithProvider from './gatsby/wrapWithProvider'

import './src/scss/reboot.scss'
import './src/scss/public.scss'
import './src/scss/prism-syntax.scss'

export const wrapRootElement = wrapWithProvider
