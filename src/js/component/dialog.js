import React, {useState, useEffect, useRef} from 'react'
import {Modal} from 'react-native'
import {style, useColor} from 'util/style'

const Dialog = ({open, onClose, children, ...props}) => {
  return (
    <Modal
      transparent={true}
      visible={open}
      onRequestClose={() => {
        if (onClose) onClose()
      }}
      {...props}>
      {children}
    </Modal>
  )
}

export default Dialog
