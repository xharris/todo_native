import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {style, useColor, pickFontColor} from 'util/style'
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native'
import {useTasks} from 'util/storage'
import {useNavigation} from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import Button from 'component/button'
import Icon from 'component/icon'
import Body from 'feature/body'
import FAB from 'react-native-fab'
import {timeOfDay} from 'util'

const Task = ({
  id,
  text,
  color: _color = 'grey500',
  parts_done = 0,
  parts_total,
  feeling = 2,
  children,
  archived,
}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(true)
  const {tasks, addTask, selecting, select, selected} = useTasks()
  const {ground, ...color} = useColor()

  const feeling_colors = ['300', '500', '700']
  const avg_feeling =
    children && children.length > 0
      ? Math.floor(
          children.reduce(
            (sum, c) => sum + (parseInt(tasks[c].feeling, 10) || 2),
            0,
          ) / children.length,
        )
      : feeling || 2
  const task_color =
    color[`${_color.slice(0, -3)}${feeling_colors[avg_feeling - 1]}`]

  return (
    <View style={styles('Task')}>
      <TouchableOpacity
        style={styles('TaskTouchable')}
        activeOpacity={0.75}
        onLongPress={() => !selecting && navigation.push('TaskEdit', {id})}
        onPress={() =>
          selecting
            ? select(id)
            : children
            ? setExpanded(!expanded)
            : navigation.push('TaskEdit', {id})
        }>
        <View
          style={styles('TaskBorder', {
            borderColor: task_color,
          })}>
          {task_color && (
            <LinearGradient
              style={styles('TaskGradient', {})}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={
                parts_total
                  ? [parts_done / parts_total, parts_done / parts_total]
                  : [1, 1]
              }
              colors={[task_color, 'rgba(0,0,0,0)']}>
              <View style={styles('TaskTextContainer')}>
                {selecting && (
                  <View
                    style={styles('TaskSelectView', {
                      backgroundColor: ground,
                    })}>
                    <Button
                      style={styles('TaskSelectButton')}
                      iconStyle={styles('TaskSelectIcon', {
                        color: task_color,
                      })}
                      icon={
                        selected[id]
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      onPress={() => select(id)}
                    />
                  </View>
                )}
                <Text
                  style={styles('TaskText', {
                    backgroundColor: task_color,
                    color: pickFontColor(task_color),
                    textDecorationLine: archived ? 'line-through' : 'none',
                    fontStyle: archived ? 'italic' : 'normal',
                  })}>{`${text}${
                  children ? ` (${children.length})` : ''
                }`}</Text>
              </View>
              {children && (
                <Icon
                  style={styles('TaskExpand')}
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                />
              )}
            </LinearGradient>
          )}
        </View>
      </TouchableOpacity>
      {children && expanded && <TaskChildren color={_color} list={children} />}
      {children && (
        <View style={styles('TaskAddChild')}>
          <Button
            style={styles('TaskAdd')}
            icon="plus"
            onPress={() => {
              addTask(id)
              setExpanded(true)
            }}
          />
        </View>
      )}
    </View>
  )
}

const TaskChildren = ({root, color, list}) => {
  const {tasks} = useTasks()
  const data = list
    .sort((a, b) =>
      tasks[a].archived === tasks[b].archived ? 0 : tasks[a] ? -1 : 1,
    )
    .map((id) => ({
      ...tasks[id],
      id,
    }))

  const renderItem = ({item}) => <Task {...item} color={color || item.color} />
  const el_flatlist = useRef()

  return (
    <FlatList
      ref={el_flatlist}
      style={styles(root ? 'TaskChildrenRoot' : 'TaskChildren')}
      contentContainerStyle={{flexGrow: 1}}
      data={data}
      keyExtractor={(task) => task.id}
      renderItem={renderItem}
      // onContentSizeChange={() => el_flatlist.current.scrollToEnd()}
    />
  )
}

const TaskList = ({navigation}) => {
  const {uiBg} = useColor()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const {
    tasks,
    updateTask,
    addTask,
    editing,
    setEditing,
    selecting,
    select,
    selected,
    toggleSelecting,
    deleteSelected,
    unarchiveSelected,
    archiveSelected,
  } = useTasks()

  return (
    <Body>
      <View style={styles('MainView')}>
        <View style={styles('Controls')}>
          {tasks._root && tasks._root.children.length > 0 && (
            <Button
              style={styles('Control')}
              icon={selecting ? 'checkbox-blank' : 'checkbox-blank-outline'}
              onPress={() => toggleSelecting()}
            />
          )}
          {selecting && [
            <Button
              key="del"
              style={styles('Control')}
              icon="delete-outline"
              onPress={() => {
                const amt = Object.keys(selected).filter(
                  (id) => selected[id] && !tasks[id].children,
                ).length
                Alert.alert(
                  'DELETE',
                  `Delete ${amt} task${amt === 1 ? '' : 's'}?`,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => {
                        deleteSelected()
                      },
                    },
                  ],
                )
              }}
            />,
            <Button
              key="archive"
              style={styles('Control')}
              icon="archive"
              onPress={() => archiveSelected()}
            />,
            <Button
              key="unarchive"
              style={styles('Control')}
              icon="archive-arrow-up-outline"
              onPress={() => unarchiveSelected()}
            />,
          ]}
        </View>
        <View style={styles('TaskList')}>
          {/* ctrl */}
          {tasks && tasks._root && (
            <TaskChildren list={tasks._root.children} root={true} />
          )}
        </View>
        <View style={styles('TaskAddRoot')}>
          <Button
            style={styles('TaskAdd')}
            icon="folder-plus-outline"
            onPress={() => addTask(null, true)}
          />
        </View>
      </View>
      <FAB
        buttonColor={uiBg}
        iconTextComponent={<Icon name="dice-multiple-outline" />}
        onClickAction={() => navigation.navigate('TaskPick')}
      />
    </Body>
  )
}

const styles = style({
  MainView: {
    flexDirection: 'column',
    flex: 1,
  },
  Controls: {
    paddingHorizontal: 20,
    flexBasis: 40,
    flexDirection: 'row',
    flex: 1,
    flexShrink: 0,
  },
  TaskList: {
    padding: 15,
    flex: 1,
    flexShrink: 1,
    flexBasis: '100%',
  },
  TaskAddRoot: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flex: 1,
    flexShrink: 0,
    flexBasis: 50,
  },
  TaskChildrenRoot: {
    flex: 1,
    flexGrow: 1,
    flexBasis: '100%',
  },
  Task: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  TaskAdd: {
    alignSelf: 'flex-start',
  },
  Control: {
    marginRight: 15,
  },
  TaskChildren: {
    paddingLeft: 20,
  },
  TaskBorder: {
    borderWidth: 2,
    borderRadius: 3,
    marginBottom: 2,
  },
  TaskGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TaskText: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  TaskTextContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  GoRandom: {},
  TaskAddChild: {
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
  TaskSelectView: {
    width: 14,
    height: 12,
    borderRadius: 3,
    overflow: 'visible',
  },
  TaskSelectButton: {
    width: 18,
    height: 18,
    position: 'absolute',
    overflow: 'visible',
    top: -3,
    left: -3,
  },
  TaskSelectIcon: {},
  TaskExpand: {},
})

export default TaskList
