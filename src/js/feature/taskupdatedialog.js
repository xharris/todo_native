import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import {style, useColor} from 'util/style'
import Dialog from 'component/dialog'
import {useTasks} from 'util/storage'
import Input from 'component/input'
import Form from 'component/form'
import Button from 'component/button'

const TaskUpdateDialog = ({id, open, onClose}) => {
  const {tasks, completeTask} = useTasks()

  useEffect(() => {
    const task = tasks[id]
    if (task && open && !task.parts_total && !task.has_dline) {
      completeTask(id, task)
      onClose()
    }
  }, [id, open, completeTask, onClose, tasks])

  return (
    <Dialog open={open} animationType="slide" centered>
      {tasks[id] && <Text>{tasks[id].text}</Text>}
      {tasks[id] && (
        <Form
          data={tasks[id]}
          onSubmit={(data) => {
            completeTask(id, data)
            onClose()
          }}>
          {({parts_done, parts_total, has_dline}) => (
            <>
              {parts_total && (
                <View>
                  <Input
                    name="parts_done"
                    label="Parts"
                    keyboardType="numeric"
                  />
                  <Text>{`/${parts_total}`}</Text>
                </View>
              )}
              {has_dline === true && !parts_total && (
                <Input name="archived" label="Completed?" type="checkbox" />
              )}
              <Button submit title="Ok" />
            </>
          )}
        </Form>
      )}
    </Dialog>
  )
}

export default TaskUpdateDialog
