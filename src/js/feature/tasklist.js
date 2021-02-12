import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import {useTasks} from 'util/storage'
import {useNavigation} from '@react-navigation/native'

const Task = ({id, text, color = '#e0e0e0', children}) => {
  const navigation = useNavigation()
  const [expanded, setExpanded] = useState(true)
  const {addTask} = useTasks()

  const styleTaskText = StyleSheet.flatten([
    styles.TaskText,
    {
      borderColor: color,
    },
  ])

  return (
    <View style={styles.Task}>
      <TouchableOpacity
        onLongPress={() => navigation.push('TaskEdit', {id})}
        onPress={() =>
          children ? setExpanded(!expanded) : navigation.push('TaskEdit', {id})
        }>
        <Text style={styleTaskText}>{`${text}${
          children ? ` (${children.length})` : ''
        }`}</Text>
      </TouchableOpacity>
      {children && expanded && <TaskChildren color={color} list={children} />}
      {children && (
        <View style={styles.TaskAddChild}>
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

  const renderItem = ({item}) => <Task {...item} color={color} />

  return (
    <FlatList
      style={!root && styles.TaskChildrenRoot}
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
    <View style={styles.TaskList}>
      {/* ctrl */}
      {tasks && tasks._root && (
        <TaskChildren list={tasks._root.children} root={true} />
      )}
      <View style={styles.TaskAdd}>
        <Button title="+" onPress={() => addTask(null, true)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  TaskText: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
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
