import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import { AddTodo } from '../components/AddTodo';
import { Todo } from '../components/Todo';
import {THEME} from "../theme";

export const MainScreen = ({ addTodo, todos, removeTodo, openTodo }) => {
  const [deviceWidth, setDeviceWidth] = useState(Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2);

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

  let content =
    <View style={{ width: deviceWidth }}>
      <FlatList
        data={todos}
        renderItem={({item}) => <Todo todo={item} onRemove={removeTodo} onOpen={openTodo} />}
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
  }
});
