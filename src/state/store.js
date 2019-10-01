import { createStore, combineReducers } from 'redux'
import color from './reducers/color'

const store = createStore(
  combineReducers({
    color,
  }),
  process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
