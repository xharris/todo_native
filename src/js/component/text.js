import React, {useState, useEffect, useRef} from 'react'
import {Text as RnText} from 'react-native'
import {style, styleCombine, useColor} from 'util/style'

const Text = ({style: _style, ...props}) => {
  const {uiFg} = useColor()
  return (
    <RnText
      style={[
        styles('Text', {
          color: uiFg,
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
