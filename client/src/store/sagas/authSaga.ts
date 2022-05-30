import { AxiosError, AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'

import {setAppStatus, setError} from '../reducers/appReducer'

import { userApi } from 'api/userApi'
import { AuthTypeSaga } from 'enums/AuthTypeSaga'
import { setIsLoggedInAC, setUserInfo } from 'store/reducers'
import { UserType } from 'types'

function* loginWorker(data: any) {
  try {
    yield put(setAppStatus('loading'))
    const res: AxiosResponse<UserType> = yield call(userApi.login, data.values)
    yield put(setUserInfo(res.data))
    yield put(setIsLoggedInAC(true))
    yield put(setAppStatus('success'))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  }
}

export function* loginWatcher() {
  yield takeEvery(AuthTypeSaga.LoginSaga, loginWorker)
}

function* logOutWorker() {
  try {
    yield put(setAppStatus('loading'))
    yield call(userApi.logOut)
    yield put(setIsLoggedInAC(false))
    yield put(setAppStatus('success'))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* logOutWatcher() {
  yield takeEvery(AuthTypeSaga.LogOutSaga, logOutWorker)
}
