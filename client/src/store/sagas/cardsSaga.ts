import { SagaIterator } from 'redux-saga'
import { call, put, StrictEffect, takeEvery, takeLatest } from 'redux-saga/effects'

import { cardsApi } from 'api/cardsApi'
import { SagaActions } from 'enums/sagaActions'
import { setOnePackCards, setPacks } from 'store/reducers'
import { setError } from 'store/reducers/appReducer'
import { PackT } from 'types'
import { GetPacksWorkerT, GetPacksResponseT, GetPacksPayload, CardsPackT } from 'types/PacksType'

function* packsWorker({ payload }: GetPacksWorkerT): Generator<StrictEffect, void, CardsPackT[]> {
  try {
    // @ts-ignore
    // const response: AxiosResponse< CardsPackT[],GetPacksWorkerT> = yield call(cardsApi.getPacks, payload)
    const response: AxiosResponse<any> = yield call(cardsApi.getPacks, payload)
    yield put(setPacks(response.data))
  } catch (e) {
    // yield put({ type: 'error', payload: e })
    yield put(setError((e as AxiosError)?.response?.data))
  }
}
type CardsT = any
type GetCardWorkerT = any

function* onePackCardsWorker({ payload }: any): Generator<StrictEffect, void, CardsT> {
  try {
    const response: AxiosResponse<PackT> = yield call(cardsApi.getOnePackCards, payload)
    yield put(setOnePackCards(response.data))
  } catch (e) {
    console.log(e)
    yield put(setError((e as AxiosError)?.response?.data))
  }
}

export function* cardsWatcher(): SagaIterator {
  yield takeLatest(SagaActions.GetPacks, packsWorker)
  yield takeLatest(SagaActions.GetOnePack, onePackCardsWorker)
}

export const getPacksS = (payload?: Partial<GetPacksPayload>) =>
  ({ type: SagaActions.GetPacks, payload } as const)

export const getOnePackS = (payload: any) => ({ type: SagaActions.GetOnePack, payload } as const)