import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, ScrollView} from 'react-native'
import {useTasks} from 'util/storage'
import Text from 'component/text'
import Form from 'component/form'
import Input from 'component/input'
import Button from 'component/button'
import {style, useColor} from 'util/style'
import Body from 'feature/body'

const TaskEdit = ({route, navigation}) => {
  const {tasks, updateTask} = useTasks()
  const {id} = route.params
  const [task, setTask] = useState()

  useLayoutEffect(() => {
    if (task) {
      navigation.setOptions({
        title: tasks[id].text,
        headerTransparent: true,
        headerLeft: () => (
          <Button icon="arrow-left" onPress={() => navigation.pop()} />
        ),
      })
    } else if (tasks) {
      setTask(tasks[id])
    }
  }, [navigation, tasks, id, task])

  const feelings = ['Relaxing', 'Neutral', 'Important']
  const feeling_icons = [
    'emoticon-excited-outline',
    'emoticon-neutral-outline',
    'emoticon-frown-outline',
  ]

  return !task ? null : (
    <Body padTop>
      <ScrollView
        style={styles('TaskEdit')}
        contentContainerStyle={{flexGrow: 1}}>
        <Form
          data={{feeling: 2, ...task}}
          onSubmit={(data) => {
            updateTask({
              id,
              dline: data.dline,
              has_dline: data.dline != null && data.has_dline,
              ...data,
            })
          }}>
          {({text, children, feeling, parts_total, has_dline}) => (
            <>
              {children
                ? [
                    <Input
                      key="name"
                      name="text"
                      icon="label-outline"
                      placeholder="Text"
                    />,
                    <Input
                      key="color"
                      name="color"
                      type="color"
                      icon="palette-outline"
                    />,
                    <Input
                      key="exclude"
                      name="exclude_all"
                      type="checkbox"
                      label="Exclude from 'All'?"
                    />,
                  ]
                : [
                    <Input
                      key="name"
                      name="text"
                      icon="label-outline"
                      placeholder="Text"
                    />,

                    <Input
                      key="feeling"
                      name="feeling"
                      type="select"
                      icon={feeling_icons[feeling == null ? 0 : feeling - 1]}
                      choices={[1, 2, 3].map((f) => ({
                        key: f,
                        value: f,
                        label: feelings[f - 1],
                      }))}
                    />,
                    <Input
                      key="onlyhome"
                      placeholder="Only at home?"
                      type="checkbox"
                      name="only_at_home"
                    />,
                    parts_total && (
                      <Input
                        key="parts_done"
                        name="parts_done"
                        icon="card-outline"
                        keyboardType="numeric"
                        placeholder="Parts completed (0)"
                      />
                    ),
                    <Input
                      key="parts_total"
                      name="parts_total"
                      icon="card-text-outline"
                      keyboardType="numeric"
                      placeholder="# of Parts"
                    />,
                    <Input
                      key="has_dline"
                      name="has_dline"
                      type="checkbox"
                      placeholder="Has a deadline?"
                    />,
                    has_dline && (
                      <Input
                        key="date"
                        type="date"
                        name="dline"
                        icon="calendar-month"
                        placeholder="Pick a date"
                      />
                    ),
                    <Text key="timeofday">Time of day</Text>,
                    ...['day_start', 'day_mid', 'day_end'].map((d) => (
                      <Input key={d} type="checkbox" name={d} placeholder={d} />
                    )),
                    <Text key="recur">Occurs every</Text>,
                    <Input
                      key="recur_amt"
                      name="recur_amt"
                      keyboardType="numeric"
                      placeholder="Number of..."
                    />,
                    <Input
                      key="recur_type"
                      name="recur_type"
                      type="select"
                      choices={[
                        {key: 'none', value: 'none', label: 'N/A'},
                        {key: 'daily', value: 'daily', label: 'days'},
                        {key: 'weekly', value: 'weekly', label: 'weeks'},
                        {key: 'monthly', value: 'monthly', label: 'months'},
                        {key: 'yearly', value: 'yearly', label: 'years'},
                      ]}
                    />,
                  ]}
              <Button key="submit" title="Save" submit />
            </>
          )}
        </Form>
      </ScrollView>
    </Body>
  )
}

const styles = style({
  TaskEdit: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 3,
  },
})

export default TaskEdit
