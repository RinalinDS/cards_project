import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CardT, PackT} from 'types'
import {UpdatedGradeT} from '../../types/PackTypes';

const initialState = {
  currentPackId: '',
  currentPack: {
    cards: [] as CardT[],
    cardsTotalCount: 0,
    maxGrade: 0,
    minGrade: 0,
    page: 0,
    pageCount: 0,
    packUserId: '',
  },
}

const slice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setOnePackCards: (state, action: PayloadAction<PackT>) => {
      state.currentPack = action.payload
    },
    setCurrentPackId: (state, action: PayloadAction<string>) => {
      state.currentPackId = action.payload
    },
    setCardUpdatedGrade: (state, action: PayloadAction<UpdatedGradeT>) => {
      const {cards} = state.currentPack
      // eslint-disable-next-line no-underscore-dangle
      const index = cards.findIndex(s => s._id === action.payload.card_id)
      cards[index] = {...cards[index], grade: action.payload.grade}
    },
  },
})

export const cardsReducer = slice.reducer

// ACTION CREATORS
export const {
  setOnePackCards,
  setCurrentPackId,
  setCardUpdatedGrade
} = slice.actions
