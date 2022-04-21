import React, { FC, useCallback, useEffect, useState } from 'react'

import { useLocation, useSearchParams } from 'react-router-dom'

import { DebounceSearchInput } from '../DebounceSearchInput/DebounceSearchInput'

import { Card } from 'components'
import { Button } from 'components/common/button/Button'
import { DebounceRange } from 'components/common/DebounceRange/DebounceRange'
import { Modal } from 'components/common/modal/Modal'
import { Paginator } from 'components/common/Pagination/Paginator'
import s from 'components/common/table/table.module.scss'
import { TableHeader } from 'components/common/table/TableHeader'
import { TableItem } from 'components/common/table/TableItem'
import { EHelpers, PaginationNames, Paths } from 'enums'
import { useAppDispatch, useAppSelector } from 'hooks'
import { setMinMaxCardInPacks, setSearchPacks } from 'store/reducers'
import { getPacksS } from 'store/sagas/cardsSaga'

export const TablePage: FC = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [sortTitle, setSortTitle] = useState('')
  const [oneZero, setOneZero] = useState(true)
  const packs = useAppSelector(state => state.cards.packs)
  const currentPage = useAppSelector(state => state.cards.currentPage)
  const amountOfElementsToShow = useAppSelector(state => state.cards.amountOfElementsToShow)
  const portionSizeForPages = useAppSelector(state => state.cards.portionSizeForPages)
  const portionNumber = useAppSelector(state => state.cards.portionNumber)
  const totalItemsCount = useAppSelector<number>(state => state.cards.cardPacksTotalCount)
  const localMinRage = useAppSelector<number>(state => state.cards.localMinRage)
  const localMaxRage = useAppSelector<number>(state => state.cards.localMaxRage)
  const searchPack = useAppSelector<string>(state => state.cards.searchPack)
  const userId = useAppSelector<string>(state => state.user.userInfo.userId)
  const appDispatch = useAppDispatch()
  const location = useLocation()
  useEffect(() => {
    appDispatch(getPacksS({ packName: searchPack, min: localMinRage, max: localMaxRage }))
  }, [localMinRage, localMaxRage, searchPack, userId])

  const setOnlyUserPacks = (): void => {
    appDispatch(getPacksS({ packName: searchPack, min: 0, max: localMaxRage, userId }))
  }

  const setAllPacks = (): void => {
    appDispatch(
      getPacksS({ userId: '', packName: searchPack, min: localMinRage, max: localMaxRage }),
    )
  }
  const sortByParam = (sortName: string): void => {
    if (sortName === sortTitle) {
      appDispatch(
        getPacksS({
          sortPacks: `${Number(oneZero)}${sortName}`,
          page: currentPage,
          packName: searchPack,
          min: localMinRage,
          max: localMaxRage,
          userId,
        }),
      )
      setOneZero(!oneZero)
    }
    if (sortName !== sortTitle) {
      appDispatch(
        getPacksS({
          sortPacks: `${EHelpers.One}${sortName}`,
          page: currentPage,
          packName: searchPack,
          min: localMinRage,
          max: localMaxRage,
          userId,
        }),
      )
      setOneZero(false)
      setSortTitle(sortName)
    }
  }
  const handlePageChange = (value: number): void => {
    const obj = sortTitle
      ? {
          sortPacks: `${Number(!oneZero)}${sortTitle}`,
          page: value,
          packName: searchPack,
          min: localMinRage,
          max: localMaxRage,
          userId,
        }
      : { page: value, packName: searchPack, min: localMinRage, max: localMaxRage, userId }
    appDispatch(getPacksS(obj))
  }
  const sortByName = (): void => {
    sortByParam('name')
  }
  const sortByUserName = (): void => {
    sortByParam('user_name')
  }
  const sortByDate = (): void => {
    sortByParam('updated')
  }
  const sortByCardsCount = (): void => {
    sortByParam('cardsCount')
  }
  const searchByPacks = useCallback((packName: string): void => {
    appDispatch(getPacksS({ packName }))
    appDispatch(setSearchPacks(packName))
  }, [])
  const [searchParams, setSearchParams] = useSearchParams()
  const onLookButtonClickHandler = (id: string): void => {
    if (id) {
      setSearchParams({ packId: id })
    } else {
      setSearchParams({})
    }
  }
  const showQuantityPacks = useCallback((value: [number, number]): void => {
    appDispatch(setMinMaxCardInPacks(value))
  }, [])

  const tableRows = packs.map(({ user_name: userName, _id: id, name, updated, cardsCount }) => (
    <TableItem
      name={name}
      id={id}
      userName={userName}
      updated={updated}
      cardsCount={cardsCount}
      key={id}
      onLookButtonClickHandler={onLookButtonClickHandler}
    />
  ))
  return (
    <div className={s.table}>
      {location.pathname === Paths.Profile ? (
        <div className={s.buttonContainer}>
          <Button onClick={setOnlyUserPacks}> My Packs</Button>
          <Button onClick={setAllPacks}> All Packs</Button>
        </div>
      ) : null}

      <div className={s.debounceRange}>
        <DebounceRange showQuantityPacks={showQuantityPacks} />
      </div>
      <DebounceSearchInput placeholder="Search..." searchValue={searchByPacks} />
      <TableHeader
        sortByName={sortByName}
        sortByCardsCount={sortByCardsCount}
        sortByUserName={sortByUserName}
        sortByDate={sortByDate}
      />
      <div className={s.body}>{tableRows}</div>
      <Paginator
        currentPage={currentPage}
        itemName={PaginationNames.Packs}
        totalItemsCount={totalItemsCount}
        amountOfElementsToShow={amountOfElementsToShow}
        portionSizeForPages={portionSizeForPages}
        portionNumber={portionNumber}
        onPageChangeHandle={handlePageChange}
      />
      <Modal
        component={<Card />}
        handleOpen={() => {
          setModalOpen(!isModalOpen)
        }}
        isOpen={isModalOpen}
      />
    </div>
  )
}
