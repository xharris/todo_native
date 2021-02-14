import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {style, useColor, pickFontColor} from 'util/style'
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
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
  parts_done,
  parts_total,
  feeling = 1,
  children,
}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(true)
  const {tasks, addTask} = useTasks()
  const color = useColor()

  const feeling_colors = ['300', '500', '700']
  const avg_feeling = children
    ? Math.floor(
        children.reduce((sum, c) => sum + (tasks[c].feeling || 2), 0) /
          children.length,
      )
    : feeling
  const task_color =
    color[`${_color.slice(0, -3)}${feeling_colors[avg_feeling - 1]}`]

  return (
    <View style={styles('Task')}>
      <TouchableOpacity
        onLongPress={() => navigation.push('TaskEdit', {id})}
        onPress={() =>
          children ? setExpanded(!expanded) : navigation.push('TaskEdit', {id})
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
                  ? [
                      Math.max(parts_done - 5, 0) / parts_total,
                      parts_done / parts_total,
                    ]
                  : [1, 1]
              }
              colors={[task_color, 'rgba(0,0,0,0)']}>
              <Text
                style={styles('TaskText', {
                  backgroundColor: task_color,
                  color: pickFontColor(task_color),
                })}>{`${text}${children ? ` (${children.length})` : ''}`}</Text>
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
            onPress={() => addTask(id) && setExpanded(true)}
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

  return (
    <FlatList
      style={!root && styles('TaskChildrenRoot')}
      data={data}
      keyExtractor={(task) => task.id}
      renderItem={renderItem}
    />
  )
}

const TaskList = ({navigation}) => {
  const {level2} = useColor()
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
  } = useTasks()

  return (
    <Body>
      <View style={styles('TaskList')}>
        {/* ctrl */}
        {tasks && tasks._root && (
          <TaskChildren list={tasks._root.children} root={true} />
        )}
        <View style={styles('TaskAdd')}>
          <Button
            style={styles('TaskAdd')}
            icon="plus"
            onPress={() => addTask(null, true)}
          />
        </View>
      </View>
      <FAB
        buttonColor={level2}
        iconTextComponent={<Icon name="dice-multiple-outline" />}
        onClickAction={() => navigation.navigate('TaskPick')}
      />
    </Body>
  )
}

const styles = style({
  TaskList: {
    padding: 15,
  },
  TaskChildrenRoot: {
    paddingLeft: 20,
  },
  Task: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  TaskBorder: {
    borderWidth: 2,
    borderRadius: 3,
    marginBottom: 2,
  },
  TaskGradient: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  TaskText: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  TaskAdd: {
    alignSelf: 'flex-start',
  },
  GoRandom: {},
  TaskAddChild: {
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
})

export default TaskList
