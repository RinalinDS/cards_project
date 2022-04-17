import { AxiosResponse } from 'axios'

import { UpdateORCreateCardInCurrentPackType } from '../types'
import { CardT } from '../types/PackTypes'

import { instance } from './config'

import { CardsPackT, GetPacksPayload, GetPacksResponseT } from 'types/PacksType'

export const cardsApi = {
  setPack() {
    const data = {
      cardsPack: {
        name: 'name',
        deckCover: 'some cover12',
        private: false,
      },
    }
    const res = instance.post('cards/pack', data)
    console.log(res)
  },
  getPacks: (payload: GetPacksPayload): Promise<AxiosResponse<CardsPackT[]>> => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const { packName, min, sortPacks, userId, max, pageCount = 10, page } = payload
    return instance.get<CardsPackT[]>(`cards/pack`, {
      params: {
        packName,
        min,
        max,
        sortPacks,
        pageCount,
        page,
        user_id: userId,
      },
    })
  },
  getOnePackCards: (payload: string = '') =>
    instance.get(
      // TODO: сделать полный набор параметров, не только cardsPack
      `cards/card?cardsPack_id=${payload}`,
    ),
  createCardInCurrentPack: async (payload: UpdateORCreateCardInCurrentPackType) => {
    const res: AxiosResponse<CardT> = await instance.post(`cards/card`, { card: payload })
    return res.data
  },
  deleteCardFromCurrentPack: async (payload: string) => {
    const res: AxiosResponse<CardT> = await instance.delete(`cards/card?id=${payload}`)
    return res.data
  },
  updateCardInCurrentPack: async (payload: UpdateORCreateCardInCurrentPackType) => {
    const res: AxiosResponse<CardT> = await instance.put(`cards/card`, { card: payload })
    return res.data
  },
}
