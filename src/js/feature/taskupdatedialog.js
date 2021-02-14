import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import {style, useColor} from 'util/style'
import Dialog from 'component/dialog'
import {useTasks} from 'util/storage'
import Input from 'component/input'
import Form from 'component/form'
import Button from 'component/button'

const TaskUpdateDialog = ({id, onClose, visible, ...props}) => {
  const {getTask, completeTask} = useTasks()
  const [task, setTask] = useState()
  const {ground} = useColor()

  useEffect(() => {
    if (id && !task) {
      setTask(getTask(id))
    }
  }, [id, task, getTask])

  useLayoutEffect(() => {
    if (task && visible && !task.parts_total && !task.has_dline) {
      completeTask(id, task)
      onClose()
    }
  }, [id, visible, task, completeTask, onClose])

  return (
    <Dialog
      animationType="none"
      transparent={true}
      visible={visible}
      {...props}>
      {task && (
        <View
          style={styles('View', {
            backgroundColor: 'rgba(0,0,0,0.5)',
          })}>
          <View
            style={styles('ViewInner', {
              backgroundColor: ground,
            })}>
            <Text style={styles('Title')}>{`Update '${task.text}':`}</Text>
            <Form
              data={task}
              onSubmit={(data) => {
                completeTask(id, data)
                onClose()
              }}>
              {({parts_done, parts_total, has_dline}) => (
                <>
                  {parts_total && (
                    <View style={styles('Parts')}>
                      <Input
                        name="parts_done"
                        label="Parts"
                        keyboardType="numeric"
                      />
                      <Text>{`out of ${parts_total}`}</Text>
                    </View>
                  )}
                  {has_dline === true && !parts_total && (
                    <Input name="archived" label="Completed?" type="checkbox" />
                  )}
                  <Button submit title="Ok" style={styles('Submit')} />
                </>
              )}
            </Form>
          </View>
        </View>
      )}
    </Dialog>
  )
}

const styles = style({
  View: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewInner: {
    padding: 20,
    shadowColor: '#000',
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 3,
  },
  Title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
  },
  Submit: {
    marginTop: 20,
  },
})

export default TaskUpdateDialog
