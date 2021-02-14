import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {style, useColor, pickFontColor} from 'util/style'
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'

const Body = ({padTop, scroll, _style, ...props}) => {
  const headerHeight = useHeaderHeight()
  const Container = scroll ? ScrollView : View
  return (
    <SafeAreaView style={styles('Safe')}>
      <Container
        style={[
          styles('Body', {
            marginTop: padTop ? headerHeight : 0,
            height: '100%',
            paddingBottom: headerHeight,
          }),
          _style,
        ]}
        {...props}
      />
    </SafeAreaView>
  )
}

const styles = style({
  Safe: {
    flex: 1,
  },
  Body: {
    paddingTop: 10 + StatusBar.currentHeight,
  },
})

export default Body
