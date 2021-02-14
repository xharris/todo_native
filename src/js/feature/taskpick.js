import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, Text, Alert, ToastAndroid} from 'react-native'
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
  const [taskFinished, setTaskFinished] = useState(false)
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
      const hours = timeObj.hours()
      const minutes = timeObj.minutes()
      const seconds = timeObj.seconds()
      setTimeString(
        `${hours > 0 ? `${hours} hr ` : ''}${
          minutes > 0 || hours > 0 ? `${minutes} min ` : ''
        }${seconds > 0 || minutes > 0 || hours > 0 ? `${seconds} sec ` : ''}`,
      )
    }
  }, [timeLeft])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerLeft: () =>
        timeLeft ? null : (
          <Button
            icon="arrow-left"
            onPress={() => navigation.navigate('TaskList')}
          />
        ),
    })
  }, [navigation, timeLeft])

  return (
    <Body>
      <TaskUpdateDialog
        id={randTask}
        visible={taskFinished}
        onClose={() => {
          setRandTask()
          setTaskText('What to do?')
          setTaskFinished(false)
          clear()
        }}
      />
      {timeLeft ? (
        <View style={styles('ViewTimer')}>
          <View>
            <Text style={styles('TaskText')}>{taskText}</Text>
            <Text style={styles('TimerText')}>{timeString}</Text>
          </View>
          <View style={styles('TimerControls')}>
            <Button
              style={styles('TimerButton')}
              icon={paused ? 'play' : 'pause'}
              onPress={() => {
                if (paused) resume()
                else pause()
              }}
            />
            <Button
              style={styles('TimerButton')}
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
          style={styles('View')}
          data={{
            list: 'all',
            opposite_loc: false,
            limit: 60,
            relax: false,
            ignore_time: false,
          }}>
          {({list, limit, relax, ignore_time}) => [
            <View key="roll_container" style={styles('RollContainer')}>
              <Button
                style={styles('RollButton')}
                textStyle={styles('RollText')}
                title={taskText}
                onPress={() => {
                  const choice = chooseTask({
                    list,
                    relax,
                    last_choice: randTask,
                    ignore_time,
                  })
                  if (choice) setRandTask(choice)
                  else
                    ToastAndroid.show(
                      'No task found with given options!',
                      ToastAndroid.LONG,
                    )
                }}
              />
              {randTask && [
                <Text key="reroll">(Press again to reroll)</Text>,
                <Button
                  key="start"
                  icon="play"
                  label="Start"
                  style={styles('PlayButton')}
                  onPress={() => reset(limit * 60)}
                />,
              ]}
            </View>,
            <View key="inputs" style={styles('FormInputs')}>
              <Input
                type="select"
                name="list"
                choices={[
                  {key: 'all', value: 'all', label: 'Any task'},
                  ...Object.keys(tasks)
                    .filter(
                      (t) =>
                        t !== '_root' &&
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
  View: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 20,
  },
  RollContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  RollButton: {
    paddingVertical: 30,
  },
  RollText: {
    fontSize: 25,
  },
  PlayButton: {
    marginTop: 20,
    width: 'auto',
  },
  FormInputs: {},
  ViewTimer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TimerControls: {
    flexDirection: 'row',
    marginTop: 50,
  },
  TaskText: {
    textAlign: 'center',
    fontSize: 18,
  },
  TimerText: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 50,
  },
  TimerButton: {
    marginRight: 10,
  },
})

export default TaskPick
