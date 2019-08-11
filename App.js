import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import Routes from './screens/Routes';

class App extends Component {
  state = {
    isFontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      dogbyte: require('./assets/fonts/dogbyte.otf'),
    });
    this.setState({ isFontLoaded: true });
  }

  render() {
    if (!this.state.isFontLoaded) {
      return <AppLoading />;
    }
    return (
      <>
        <StatusBar barStyle="light-content"></StatusBar>
        <Routes />
      </>
    );
  }
}

export default App;
