import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import { THEME } from '../theme';
import { TodoContext } from '../context/todo/todoContext';
import { ScreenContext } from '../context/screen/screenContext';
import { AddTodo } from '../components/AddTodo';
import { Todo } from '../components/Todo';
import { AppLoading } from '../components/UI/AppLoading';
import { AppText } from '../components/UI/AppText';
import { AppButton } from '../components/UI/AppButton';

export const MainScreen = () => {
  const { addTodo, removeTodo, todos, fetchTodos, loading, error } = useContext(TodoContext);
  const { changeScreen } = useContext(ScreenContext);
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2);

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos]);

  useEffect(() => {
    loadTodos()
  }, []);

  useEffect(() => {
    const update = () => {
      const width =
        Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2;
      setDeviceWidth(width)
    };

    Dimensions.addEventListener('change', update);

    return () => {
      Dimensions.removeEventListener('change', update);
    }
  });

  if (loading) {
    return <AppLoading />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.error}>{error}</AppText>
        <AppButton onPress={loadTodos}>Try again</AppButton>
      </View>
    )
  }

  let content =
    <View style={{ width: deviceWidth }}>
      <FlatList
        data={todos}
        renderItem={({item}) => <Todo todo={item} onRemove={removeTodo} onOpen={changeScreen} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>;

  if (!todos.length) {
    content = <View style={styles.imgWrap}>
      <Image
        style={styles.image}
        source={require('../../assets/no_item.png')}
      />
    </View>
  }

  return (
    <View>
      <AddTodo onSubmit={addTodo} />
      { content }
    </View>
  )
};

const styles = StyleSheet.create({
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 300
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    fontSize: 20,
    marginBottom: 20,
    color: THEME.DANGER_COLOR
  }
});
