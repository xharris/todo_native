import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {style, useColor, pickFontColor} from 'util/style'
import {ScrollView, View, Text, FlatList, TouchableOpacity} from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'

const Body = ({padTop, scroll, ...props}) => {
  const headerHeight = useHeaderHeight()
  const Container = scroll ? ScrollView : View
  return (
    <Container
      style={styles('Body', {
        marginTop: padTop ? headerHeight : 0,
        height: '100%',
      })}
      {...props}
    />
  )
}

const styles = style({
  Body: {
    flex: 1,
    paddingTop: 10,
  },
})

export default Body
