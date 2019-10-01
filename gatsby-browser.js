/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import wrapWithProvider from './gatsby/wrapWithProvider'

require('./src/scss/reboot.scss')
require('./src/scss/public.scss')

export const wrapRootElement = wrapWithProvider
