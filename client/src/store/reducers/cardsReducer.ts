import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { EHelpers, EPacksSort } from 'enums'
import { PackT, SortT } from 'types'
import { CardsPackT, GetPacksResponseT } from 'types/PacksType'

const initialState = {
  currentPage: 1,
  amountOfElementsToShow: 10,
  portionSizeForPages: 10,
  portionNumber: 1,
  packs: [] as CardsPackT[],
  page: 1,
  pageCount: 0,
  cardPacksTotalCount: 0,
  rangeValues: {
    minCardsCount: 0,
    maxCardsCount: 20,
  },
  currentPack: null as unknown as PackT,
  revert: {
    [EPacksSort.Name]: false,
    [EPacksSort.UserName]: false,
    [EPacksSort.Date]: false,
    [EPacksSort.CardsCount]: false,
  },
  searchPack: '',
  actualPacks: [] as CardsPackT[],
  onlyUserPack: [] as CardsPackT[],
}

const slice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
    setAmountOfElementsToShow(state, action: PayloadAction<number>) {
      state.amountOfElementsToShow = action.payload
    },
    setPortionNumber(state, action: PayloadAction<number>) {
      state.portionNumber = action.payload
    },
    setPacks: (state, action: PayloadAction<GetPacksResponseT>) => {
      const { cardPacks, cardPacksTotalCount, minCardsCount, maxCardsCount, pageCount, page } =
        action.payload
      state.packs = cardPacks
      state.rangeValues = { minCardsCount, maxCardsCount }
      state.page = page
      state.pageCount = pageCount
      state.cardPacksTotalCount = cardPacksTotalCount
      state.actualPacks = cardPacks
    },
    sortCards: (state, action: PayloadAction<SortT>) => {
      const { payload: sortType } = action
      if (state.revert[sortType]) {
        state.revert[sortType] = !state.revert[sortType]
        state.packs.sort((a, b) => (a[sortType] < b[sortType] ? EHelpers.One : EHelpers.MinusOne))
      } else {
        state.revert[sortType] = !state.revert[sortType]
        state.packs.sort((a, b) => (a[sortType] > b[sortType] ? EHelpers.One : EHelpers.MinusOne))
      }
    },
    setOnePackCards: (state, action: PayloadAction<PackT>) => {
      state.currentPack = action.payload
    },
    setSearchPacks: (state, action: PayloadAction<string>) => {
      const { payload: filterByName } = action
      state.searchPack = filterByName
      state.actualPacks = state.packs.filter(
        p => p.name.toLowerCase().includes(filterByName.toLowerCase()) && p,
      )
    },
    setOnlyUserPack: (state, action: PayloadAction<string>) => {
      state.onlyUserPack = state.actualPacks.filter(p => p.user_id === action.payload)
    },
    setFixCountPack: (state, action: PayloadAction<[number, number]>) => {
      const [min, max] = action.payload
      state.rangeValues.minCardsCount = min
      state.rangeValues.maxCardsCount = max
      state.actualPacks = state.actualPacks.slice(
        state.rangeValues.minCardsCount,
        state.rangeValues.maxCardsCount,
      )
    },
  },
})

export const cardsReducer = slice.reducer

// ACTION CREATORS
export const {
  setCurrentPage,
  setAmountOfElementsToShow,
  setPacks,
  sortCards,
  setOnePackCards,
  setPortionNumber,
  setSearchPacks,
  setFixCountPack,
} = slice.actions
