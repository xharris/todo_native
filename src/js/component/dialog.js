import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, View, ScrollView, Text, Modal} from 'react-native'
import {style, useColor} from 'util/style'
import Button from 'component/button'

const Dialog = ({open, onClose, children}) => {
  return (
    <Modal
      transparent={true}
      visible={open}
      onRequestClose={() => {
        if (onClose) onClose()
      }}>
      {children}
    </Modal>
  )
}

export default Dialog
