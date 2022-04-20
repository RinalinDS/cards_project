import React, { FC } from 'react'

import s from './table.module.scss'

import { Button } from 'components/common/button/Button'

type TableItemProps = {
  name: string
  id: string
  userName: string
  updated: string
  cardsCount: number
}

export const TableItem: FC<TableItemProps> = props => {
  const { userName, name, updated, cardsCount, id } = props
  const date = new Date(updated).toLocaleDateString()
  return (
    <div className={`${s.body__row} ${s.row}`}>
      <div>{name}</div>
      <div>{cardsCount}</div>
      <div>{date}</div>
      <div>{userName}</div>
      <div>
        <Button>Learn</Button>
        <Button>Look</Button>
      </div>
    </div>
  )
}
