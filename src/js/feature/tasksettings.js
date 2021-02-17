import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Alert, ToastAndroid} from 'react-native'
import {style, useColor} from 'util/style'
import {useNavigation} from '@react-navigation/native'
import Body from 'feature/body'
import Form from 'component/form'
import Input from 'component/input'
import Button from 'component/button'
import {useTasks} from 'util/storage'
import {confirm} from 'util/event'

const TaskSettings = () => {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerLeft: () => (
        <Button icon="arrow-left" onPress={() => navigation.pop()} />
      ),
    })
  }, [navigation])

  const {backup, restore} = useTasks()

  return (
    <Body padTop>
      <Form>
        <Button
          title="Backup"
          onPress={() =>
            confirm('Save backup', 'Are you sure?').then(
              (yes) => yes && backup(),
            )
          }
        />
        <Button
          title="Restore"
          onPress={() =>
            confirm('Restore backup', 'Are you sure?').then(
              (yes) => yes && restore(),
            )
          }
        />
      </Form>
    </Body>
  )
}

export default TaskSettings
