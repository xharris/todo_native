import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import {style, useColor} from 'util/style'
import Form from 'component/form'
import Input from 'component/input'
import Button from 'component/button'
import {useTasks} from 'util/storage'
import {timeOfDay, useTimer} from 'util'
import TaskUpdateDialog from 'feature/taskupdatedialog'
import Body from 'feature/body'
import moment from 'moment'

const TaskPick = ({navigation}) => {
  const {tasks, chooseTask} = useTasks()
  const [taskText, setTaskText] = useState('What to do?')
  const [randTask, setRandTask] = useState()
  const [location, setLocation] = useState()
  const [taskFinished, setTaskFinished] = useState()
  const [timeString, setTimeString] = useState()

  const {timeLeft, paused, pause, resume, reset, clear} = useTimer()

  useEffect(() => {
    // TODO: get if current location is home or NOT
    setLocation('home')
  }, [])

  useEffect(() => {
    if (randTask && tasks[randTask]) setTaskText(tasks[randTask].text)
  }, [randTask, tasks])

  useEffect(() => {
    if (timeLeft && !paused && timeLeft <= 0) {
      pause()
      // show notification
    }
  }, [timeLeft, paused, pause])

  useEffect(() => {
    if (timeLeft) {
      const timeObj = moment.duration(timeLeft * 1000)
      setTimeString(
        `for ${timeObj.hours()} hr ${timeObj.minutes()} min ${timeObj.seconds()} sec`,
      )
    }
  }, [timeLeft])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerLeft: () => (
        <Button
          icon="arrow-left"
          onPress={() => navigation.navigate('TaskList')}
        />
      ),
    })
  }, [navigation])

  return (
    <Body padTop>
      {taskFinished && (
        <TaskUpdateDialog
          id={randTask}
          open={taskFinished}
          onClose={() => {
            setRandTask()
            setTaskText('What to do?')
            setTaskFinished()
            clear()
          }}
        />
      )}
      {timeLeft ? (
        <View>
          <View>
            <Text>{taskText}</Text>
            <Text>{timeString}</Text>
          </View>
          <View>
            <Button
              icon={paused ? 'play' : 'pause'}
              onPress={() => {
                if (paused) resume()
                else pause()
              }}
            />
            <Button
              icon="stop"
              onPress={() =>
                Alert.alert('STOP', 'Stop the task completely?', [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Ok',
                    onPress: () => {
                      pause()
                      setTaskFinished(true)
                    },
                  },
                ])
              }
            />
          </View>
        </View>
      ) : (
        <Form
          data={{
            list: 'all',
            opposite_loc: false,
            limit: 60,
            relax: false,
            ignore_time: false,
          }}>
          {({list, limit, relax, ignore_time}) => [
            <View key="roll_container">
              <Button
                style={styles('Roll')}
                title={taskText}
                onPress={() =>
                  setRandTask(chooseTask({list, relax, last_choice: randTask}))
                }
              />
              {randTask && [
                <Text key="reroll">(Click to reroll)</Text>,
                <Button
                  key="start"
                  icon="play"
                  onPress={() => reset(limit * 60)}
                />,
              ]}
            </View>,
            <View key="inputs">
              <Input
                type="select"
                name="list"
                choices={[
                  {key: 'all', value: 'all', label: 'Any task'},
                  ...Object.keys(tasks)
                    .filter(
                      (t) =>
                        t !== '_root' &&
                        !tasks[t].exclude_all &&
                        tasks[t].children &&
                        tasks[t].children.length > 0,
                    )
                    .map((t) => ({key: t, value: t, label: tasks[t].text})),
                ]}
              />
              <Input label="Need to relax?" type="checkbox" name="relax" />
              <Input
                label="Time limit?"
                type="select"
                name="limit"
                choices={[
                  {key: 15, value: 15, label: '15 min time limit'},
                  {key: 30, value: 30, label: '30 min time limit'},
                  {key: 60, value: 60, label: '1 hr time limit'},
                  {key: 0, value: 0, label: 'None'},
                ]}
              />
              <Input
                label={`Ignore time of day (${timeOfDay()})?`}
                type="checkbox"
                name="ignore_time"
              />
              <Input
                label={location === 'home' ? "I'm going out" : "I'm going home"}
                type="checkbox"
                name="opposite_loc"
              />
            </View>,
          ]}
        </Form>
      )}
    </Body>
  )
}

const styles = style({
  Roll: {},
})

export default TaskPick
