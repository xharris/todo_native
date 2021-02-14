import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {style, useColor, pickFontColor} from 'util/style'
import {View, Text, Button, FlatList, TouchableOpacity} from 'react-native'
import {useTasks} from 'util/storage'
import {useNavigation} from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'

const Task = ({
  id,
  text,
  color: _color = 'grey500',
  parts_done,
  parts_total,
  children,
}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(true)
  const {addTask} = useTasks()
  const color = useColor()
  console.log(_color)
  return (
    <View style={styles('Task')}>
      <TouchableOpacity
        onLongPress={() => navigation.push('TaskEdit', {id})}
        onPress={() =>
          children ? setExpanded(!expanded) : navigation.push('TaskEdit', {id})
        }>
        <View
          style={styles('TaskBorder', {
            borderColor: color[_color],
          })}>
          {color[_color] && (
            <LinearGradient
              style={styles('TaskGradient', {})}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={
                parts_total
                  ? [parts_done / parts_total, parts_done / parts_total]
                  : [1, 1]
              }
              colors={[color[_color], 'rgba(0,0,0,0)']}>
              <Text
                style={styles('TaskText', {
                  backgroundColor: color[_color],
                  color: pickFontColor(color[_color]),
                })}>{`${text}${children ? ` (${children.length})` : ''}`}</Text>
            </LinearGradient>
          )}
        </View>
      </TouchableOpacity>
      {children && expanded && <TaskChildren color={_color} list={children} />}
      {children && (
        <View style={styles('TaskAddChild')}>
          <Button title="+" onPress={() => addTask(id) && setExpanded(true)} />
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
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <Button title="->" onPress={() => navigation.navigate('TaskPick')} />
      ),
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
    <View style={styles('TaskList')}>
      {/* ctrl */}
      {tasks && tasks._root && (
        <TaskChildren list={tasks._root.children} root={true} />
      )}
      <View style={styles('TaskAdd')}>
        <Button title="+" onPress={() => addTask(null, true)} />
      </View>
    </View>
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
  TaskAddChild: {
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
})

export default TaskList
