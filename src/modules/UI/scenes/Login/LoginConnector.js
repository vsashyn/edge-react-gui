// @flow

import type {Dispatch, State} from '../../../ReduxTypes'

import {connect} from 'react-redux'

import Login from './Login.ui'
import * as CORE_SELECTORS from '../../../Core/selectors'
import {initializeAccount} from '../../../Login/action'

const mapStateToProps = (state: State, ownProps) => ({
  context: CORE_SELECTORS.getContext(state),
  account: CORE_SELECTORS.getAccount(state),
  username: ownProps.username,
  ownProps,
  myTest: 'qweqwe'
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  initializeAccount: (account) => dispatch(initializeAccount(account))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
