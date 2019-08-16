import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import styles from './styles';

import { Header } from '../../components';

import { retrieveData } from '../../utils';

import playIcon from '../../assets/icons/play_arrow.png';
import trophyIcon from '../../assets/icons/trophy.png';
import leaderboardIcon from '../../assets/icons/leaderboard.png';
import speakerOnIcon from '../../assets/icons/speaker-on.png';
import speakerOffIcon from '../../assets/icons/speaker-off.png';

export default class Home extends Component {
  state = {
    isSoundOn: true,
    highScore: 0,
  };

  async componentWillMount() {
    const { navigation } = this.props;
    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();

    await this.initializeMusic();
    const highScore = await retrieveData('highScore');
    this.setState({ highScore: highScore || 0 });

    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      async () => {
        try {
          this.initializeMusic(true);
          // The sound is playing
          const highScore = await retrieveData('highScore');
          this.setState({ highScore: highScore || 0 });
        } catch (err) {
          // An error occurred
          console.log(err);
        }
      }
    );

    this.willBlurSubscription = navigation.addListener('willBlur', async () => {
      try {
        await this.backgroundMusic.stopAsync();
        // The sound is playing
      } catch (err) {
        // An error occurred
        console.log(err);
      }
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
    this.willBlurSubscription.remove();
  }

  initializeMusic = async (replay = false) => {
    try {
      if (replay) {
        await this.backgroundMusic.replayAsync();
      } else {
        await this.backgroundMusic.loadAsync(
          require('../../assets/music/Komiku_Mushrooms.mp3')
        );
        await this.buttonFX.loadAsync(require('../../assets/sfx/button.wav'));
        await this.backgroundMusic.setIsLoopingAsync(true);
        await this.backgroundMusic.playAsync();
      }
    } catch (e) {
      console.log(e);
    }
  };

  onPlayPress = () => {
    this.buttonFX.replayAsync();
    const { navigation } = this.props;
    navigation.navigate('Game');
  };

  onLeaderboardPress = () => {
    console.log('onLeaderboardPress event handler');
  };

  onToggleSound = () => {
    this.setState(prevState => ({ isSoundOn: !prevState.isSoundOn }));
  };

  render() {
    const { isSoundOn, highScore } = this.state;
    const imgSrc = isSoundOn ? speakerOnIcon : speakerOffIcon;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }} />
        <Header />
        <TouchableOpacity
          onPress={this.onPlayPress}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 80 }}
        >
          <Image source={playIcon} style={styles.playIcon} />
          <Text style={styles.play}>PLAY!</Text>
        </TouchableOpacity>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
        >
          <Image source={trophyIcon} style={styles.trophyIcon} />
          <Text style={styles.highScore}>Hi-score: {highScore}</Text>
        </View>
        <TouchableOpacity
          onPress={this.onLeaderboardPress}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 80 }}
        >
          <Image source={leaderboardIcon} style={styles.leaderboardIcon} />
          <Text style={styles.leaderboard}>Leaderboard</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <View style={styles.bottomContainer}>
          <View>
            <Text style={[styles.copyRightText, { color: '#E64C3C' }]}>
              Music: Komiku
            </Text>
            <Text style={[styles.copyRightText, { color: '#F1C431' }]}>
              SFX: SubspaceAudio
            </Text>
            <Text style={[styles.copyRightText, { color: '#3998DB' }]}>
              Development: RisingStack
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity onPress={this.onToggleSound}>
            <Image source={imgSrc} style={styles.soundIcon}></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
