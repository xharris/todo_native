import React, {useState, useEffect, useRef} from 'react'
import {Text as RnText} from 'react-native'
import {style, styleCombine, useColor} from 'util/style'

const Text = ({style: _style, ...props}) => {
  const {groundTint} = useColor()
  return (
    <RnText
      style={[
        styles('Text', {
          color: groundTint,
        }),
        _style,
      ]}
      {...props}
    />
  )
}

const styles = style({
  Text: {},
})

export default Text
