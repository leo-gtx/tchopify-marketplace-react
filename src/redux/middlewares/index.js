import thunk from 'redux-thunk'
import { applyMiddleware } from 'redux'
import checker from './checker'

export default applyMiddleware(
  thunk,
  checker,
) 