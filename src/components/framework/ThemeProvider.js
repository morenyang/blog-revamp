import React, { useReducer } from 'react'
import reducer, { initialState } from '../../state/reducers/color'

export const ThemeContext = React.createContext({})

const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const context = {
    dispatch,
    ...state,
  }
  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider
