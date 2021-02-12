import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text, Button} from 'react-native'

const TaskPick = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <Button title="<-" onPress={() => navigation.navigate('TaskList')} />
      ),
    })
  }, [navigation])

  return <View></View>
}

export default TaskPick
