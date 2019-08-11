import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import styles from './styles';

import { Header } from '../../components';

import playIcon from '../../assets/icons/play_arrow.png';
import trophyIcon from '../../assets/icons/trophy.png';
import leaderboardIcon from '../../assets/icons/leaderboard.png';
import speakerOnIcon from '../../assets/icons/speaker-on.png';
import speakerOffIcon from '../../assets/icons/speaker-off.png';

export default class Home extends Component {
  state = {
    isSoundOn: true,
  };

  onPlayPress = () => {
    console.log('onPlayPress event handler');
  };

  onLeaderboardPress = () => {
    console.log('onLeaderboardPress event handler');
  };

  onToggleSound = () => {
    this.setState(prevState => ({ isSoundOn: !prevState.isSoundOn }));
  };

  render() {
    const { isSoundOn } = this.state;
    const imgSrc = isSoundOn ? speakerOnIcon : speakerOffIcon;
    return (
      <View style={styles.container}>
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
          <Text style={styles.hiscore}>Hi-score: 0</Text>
        </View>
        <TouchableOpacity
          onPress={this.onLeaderboardPress}
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 80 }}
        >
          <Image source={leaderboardIcon} style={styles.leaderboardIcon} />
          <Text style={styles.leaderboard}>Leaderboard</Text>
        </TouchableOpacity>
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
