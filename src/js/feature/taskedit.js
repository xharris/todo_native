import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {useTasks} from 'util/storage'
import Form from 'component/form'
import Input from 'component/input'
import Button from 'component/button'

const TaskEdit = ({route, navigation}) => {
  const {tasks} = useTasks()
  const {id} = route.params
  const [task, setTask] = useState()

  useLayoutEffect(() => {
    if (task) {
      navigation.setOptions({
        title: tasks[id].text,
        headerLeft: () => (
          <Button title="<-" onPress={() => navigation.pop()} />
        ),
      })
    } else if (tasks) {
      setTask(tasks[id])
    }
  }, [navigation, tasks, id, task])

  return !task ? null : (
    <View>
      <Form
        data={{...task}}
        onSubmit={(data) => {
          console.log('submit', data)
        }}>
        {({text}) => [
          <Input key="name" name="text" label="Text" />,
          <Button key="submit" title="Ok" submit />,
        ]}
      </Form>
    </View>
  )
}

export default TaskEdit
