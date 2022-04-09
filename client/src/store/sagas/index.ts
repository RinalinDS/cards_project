import { all } from 'redux-saga/effects'

import { AppWatcher } from '../reducers/appReducer'

import { UserWatcher } from './userSaga'

import { loginWatcher, logOutWatcher } from 'store/sagas/authSaga'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function* rootSaga() {
  yield all([AppWatcher(), UserWatcher(), loginWatcher(), logOutWatcher()])
}
