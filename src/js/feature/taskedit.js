import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {StyleSheet, View, ScrollView} from 'react-native'
import {useTasks} from 'util/storage'
import Text from 'component/text'
import Form from 'component/form'
import Input from 'component/input'
import Button from 'component/button'
import {style, useColor} from 'util/style'
import Body from 'feature/body'
import Icon from 'component/icon'
import TaskUpdateDialog from 'feature/taskupdatedialog'
import moment from 'moment'

const TaskEdit = ({route, navigation}) => {
  const {getTask, updateTask} = useTasks()
  const {id} = route.params
  const [task, setTask] = useState()
  const [updating, setUpdating] = useState(false)
  const [editing, setEditing] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: getTask(id).text,
      headerTransparent: true,
      headerLeft: () => (
        <Button icon="arrow-left" onPress={() => navigation.pop()} />
      ),
      headerRight: () => (
        <Button
          icon={editing ? 'close' : 'pencil'}
          onPress={() => setEditing(!editing)}
        />
      ),
    })
  }, [navigation, getTask, id, editing])

  const feelings = ['Relaxing', 'Neutral', 'Important']
  const feeling_icons = [
    'emoticon-excited-outline',
    'emoticon-neutral-outline',
    'emoticon-frown-outline',
  ]

  return !id ? null : (
    <Body padTop>
      <ScrollView
        style={styles('TaskEdit')}
        contentContainerStyle={{flexGrow: 1}}>
        <Form
          data={{...getTask(id)}}
          onSubmit={(data) => {
            updateTask({
              id,
              dline: data.dline,
              has_dline: data.dline != null && data.has_dline,
              ...data,
            })
            setEditing(false)
          }}>
          {({
            text,
            only_at_home,
            archived,
            children,
            feeling,
            parts_done,
            parts_total,
            has_dline,
            dline,
            notes,
            day_start,
            day_mid,
            day_end,
          }) =>
            editing ? (
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
                        <Input
                          key={d}
                          type="checkbox"
                          name={d}
                          placeholder={d}
                        />
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
            ) : (
              <View style={styles('Preview')}>
                <TaskUpdateDialog
                  id={id}
                  visible={updating}
                  onClose={() => {
                    setUpdating(false)
                  }}
                />
                <View style={styles('PreviewSection')}>
                  <Icon
                    name={feeling_icons[feeling == null ? 0 : feeling - 1]}
                    style={styles('PreviewIcon')}
                  />
                  {!(day_start || day_mid || day_end) ||
                  (day_start && day_mid && day_end) ? (
                    <Icon
                      name="theme-light-dark"
                      style={styles('PreviewIcon')}
                    />
                  ) : day_start ? (
                    <Icon
                      name="weather-sunset-up"
                      style={styles('PreviewIcon')}
                    />
                  ) : day_mid ? (
                    <Icon name="weather-sunny" style={styles('PreviewIcon')} />
                  ) : day_end ? (
                    <Icon name="weather-night" style={styles('PreviewIcon')} />
                  ) : null}
                  {only_at_home && (
                    <Icon name="home" style={styles('PreviewIcon')} />
                  )}
                </View>
                {archived && (
                  <View style={styles('PreviewSection')}>
                    <Icon name="archive" style={styles('PreviewIcon')} />
                    <Text
                      style={styles('PreviewText', {
                        fontStyle: 'italic',
                      })}>
                      archived
                    </Text>
                  </View>
                )}
                {parts_total && (
                  <View style={styles('PreviewSection')}>
                    <Icon
                      name="card-text-outline"
                      style={styles('PreviewIcon')}
                    />
                    <Text
                      style={styles(
                        'PreviewText',
                      )}>{`${parts_done} / ${parts_total}`}</Text>
                    <Button icon="plus" onPress={() => setUpdating(true)} />
                  </View>
                )}
                {has_dline && (
                  <View style={styles('PreviewSection')}>
                    <Icon name="calendar-month" style={styles('PreviewIcon')} />
                    <Text style={styles('PreviewText')}>
                      {moment(dline).format('LL')}
                    </Text>
                  </View>
                )}
                <View style={styles('NotesSection')}>
                  <Input
                    name="notes"
                    placeholder="Notes"
                    numberOfLines={5}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <Button key="submit" title="Save" submit />
              </View>
            )
          }
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
  Preview: {
    paddingHorizontal: 10,
  },
  PreviewIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  PreviewText: {
    fontSize: 18,
  },
  PreviewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  NotesSection: {
    marginBottom: 10,
  },
})

export default TaskEdit
