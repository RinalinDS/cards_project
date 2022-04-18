import React, { useState } from 'react'

import { EHelpers } from '../../enums'
import { SagaActions } from '../../enums/sagaActions'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { createNewCard, deleteOneCard, updateOneCard } from '../../store/sagas/cardsSaga'
import { CardTypePartial } from '../../types/PackTypes'
import { Button } from '../common'

import { AddCardInputForm } from './AddCardInputForm/AddCardInputForm'
import DeleteCard from './Modal/DeleteCardModal/DeleteCard'
import ModalForCards from './Modal/ModalForCards/ModalForCards'
import s from './style/CardsTable.module.css'

const CardsTable: React.FC = () => {
  const currentPack = useAppSelector(state => state.cards.currentPack)
  const currentPackID = currentPack && currentPack.cards[EHelpers.Zero].cardsPack_id
  const currentPackUserID = currentPack && currentPack.cards[EHelpers.Zero].user_id
  const [whatModalIsActive, setWhatModalIsActive] = useState<string>('')
  const [useStateId, setUseStateId] = useState<string>('')
  // eslint-disable-next-line no-underscore-dangle
  const userID = useAppSelector(state => state.user.userInfo._id)
  const dispatch = useAppDispatch()
  const onClickHandler = (): void => {
    dispatch({ type: SagaActions.GetOnePack, payload: '6259a1e4e09d9d0004160611' })
  } // temporary function, потом удалить или привести в порядок.
  const onDeleteClickHandlerInTable = (id: string) => {
    setUseStateId(id)
    setWhatModalIsActive('delete')
  }
  const onConfirmDeleteClickHandler = (id: string): void => {
    dispatch(deleteOneCard(id))
    setWhatModalIsActive('')
  }
  const onDivToLearnClickHandler = (): void => {
    setWhatModalIsActive('learn')
  }
  const onEditClickHandler = (UpdatedCard: CardTypePartial): void => {
    dispatch(updateOneCard(UpdatedCard))
  }
  const onCreateClickHandler = (Card: CardTypePartial) => {
    const newCard = { ...Card, cardsPack_id: currentPackID } // прицепить CurrentPackId nado
    dispatch(createNewCard(newCard))
  }
  const shouldElementBeShown = () => userID !== currentPackUserID // Используется для колонки с кнопками удаления и едита, если не твои карточки - не увидишь
  const tableRows =
    currentPack &&
    currentPack.cards.map(m => (
        // eslint-disable-next-line no-underscore-dangle,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div className={s.tableRow} key={m._id} >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}

          <div className={s.tableTest}>{m.question}</div>
          <div className={s.tableTest}>{m.answer}</div>
          <div className={s.tableTest}>{m.grade}</div>

        {shouldElementBeShown() && (
          <div className={s.tableTest}>
            {/* eslint-disable-next-line no-underscore-dangle */}
            <Button red type="button" onClick={() => onDeleteClickHandlerInTable(m._id)}>
              Delete
            </Button>
            {/* eslint-disable-next-line no-underscore-dangle */}
            <Button onClick={() => onEditClickHandler({ _id: m._id })}>Edit</Button>
          </div>
        )}
      </div>
    ))
  return (
    <div>
      <Button onClick={onClickHandler}> Click me</Button>
      <Button onClick={() => setWhatModalIsActive('addCard')}> Add new card</Button>
      <div className={s.tableHead}>
        <span>Question</span>
        <span>Answer</span>
        <span>Grade</span>
        {shouldElementBeShown() && <span>Actions</span>}
      </div>
      {tableRows}
      {/* <ModalForCards */}
      {/*  isActive={isModalForAddingCardActive} */}
      {/*  setIsActive={setIsModalForAddingCardActive} */}
      {/* > */}
      {/*  <AddCardInputForm */}
      {/*    setAddNewCardModal={setIsModalForAddingCardActive} */}
      {/*    createCard={onCreateClickHandler} */}
      {/*  /> */}
      {/* </ModalForCards> */}
      {/* <ModalForCards */}
      {/*  isActive={isModalForDeleteCardActive} */}
      {/*  setIsActive={setIsModalForDeleteCardActive} */}
      {/* > */}
      {/*  <div> Are you sure you want to delete this card ?</div> */}
      {/*  <button type="button" onClick={() => setIsModalForDeleteCardActive(false)}> */}
      {/*    No */}
      {/*  </button>{' '} */}
      {/*  <button type="button" onClick={() => onConfirmDeleteClickHandler(useStateId)}> */}
      {/*    Yes */}
      {/*  </button> */}
      {/* </ModalForCards> */}
      <ModalForCards isActive={whatModalIsActive} setIsActive={setWhatModalIsActive}>
        {whatModalIsActive === 'delete' && (
          <DeleteCard
            setWhatModalIsActive={setWhatModalIsActive}
            onConfirmDeleteClickHandler={onConfirmDeleteClickHandler}
            useStateId={useStateId}
          />
        )}
        {whatModalIsActive === 'addCard' && (
          <AddCardInputForm
            setAddNewCardModal={setWhatModalIsActive}
            createCard={onCreateClickHandler}
          />
        )}
          {whatModalIsActive === 'learn' && (
              <AddCardInputForm
                  setAddNewCardModal={setWhatModalIsActive}
                  createCard={onCreateClickHandler}
              />
          )}
      </ModalForCards>
    </div>
  )
}

export default CardsTable
