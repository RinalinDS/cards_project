import { AxiosError, AxiosResponse } from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'

import { userApi } from 'api/userApi'
import { AppStatus, AuthTypeSaga } from 'enums'
import { setAppStatus, setError, setIsLoggedInAC, setUserInfo } from 'store/reducers'
import { UserType } from 'types'

function* loginWorker(data: any) {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const res: AxiosResponse<UserType> = yield call(userApi.login, data.values)
    yield put(setUserInfo(res.data))
    yield put(setIsLoggedInAC(true))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export function* loginWatcher() {
  yield takeEvery(AuthTypeSaga.LoginSaga, loginWorker)
}

function* logOutWorker() {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(userApi.logOut)
    yield put(setIsLoggedInAC(false))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* logOutWatcher() {
  yield takeEvery(AuthTypeSaga.LogOutSaga, logOutWorker)
}
