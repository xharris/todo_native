import React from 'react'
import ReactIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {style, useColor} from 'util/style'

export const Icon = ({style: _style, ...props}) => {
  const {groundTint} = useColor()
  return (
    <ReactIcon
      size={18}
      style={[
        styles('Icon', {
          color: groundTint,
        }),
        _style,
      ]}
      {...props}
    />
  )
}

const styles = style({
  Icon: {},
})

export default Icon
