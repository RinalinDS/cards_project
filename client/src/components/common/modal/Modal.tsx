import React, { FC, ReactElement } from 'react'

import { createPortal } from 'react-dom'

import s from './styles/Modal.module.scss'

type ModalProps = {
  component: ReactElement
  isOpen: boolean
  handleOpen: () => void
}
// eslint-disable-next-line consistent-return
export const Modal = (props: ModalProps): any => {
  const { handleOpen, isOpen, component } = props
  const root = document.querySelector('body')
  console.log(root)
  const wrapper = (
    <div className={s.wrapper}>
      <div className={s.modal}>
        <button type="button" onClick={handleOpen}>
          close
        </button>
        {component}
      </div>
    </div>
  )
  if (root && isOpen) {
    return createPortal(wrapper, root)
  }
  return null
}
