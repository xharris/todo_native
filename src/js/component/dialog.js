import React, {useState, useEffect, useRef} from 'react'
import {Modal} from 'react-native'
import {style, useColor} from 'util/style'

const Dialog = ({...props}) => {
  return <Modal {...props} />
}

export default Dialog
