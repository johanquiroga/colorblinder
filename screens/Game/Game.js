import React from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';

import { Header } from '../../components';

import styles from './styles';

import {
  generateRGB,
  mutateRGB,
  storeData,
  retrieveData,
  shakeAnimation,
} from '../../utils';

import bestPointsIcon from '../../assets/icons/trophy.png';
import bestTimeIcon from '../../assets/icons/clock.png';
import pausedIcon from '../../assets/icons/mug.png';
import pauseIcon from '../../assets/icons/pause.png';
import playIcon from '../../assets/icons/play.png';
import replayIcon from '../../assets/icons/replay.png';
import deadIcon from '../../assets/icons/dead.png';
import exitIcon from '../../assets/icons/escape.png';

class Game extends React.Component {
  state = {
    points: 0,
    bestPoints: 0,
    timeLeft: 15,
    bestTime: 0,
    rgb: generateRGB(),
    size: 2,
    gameState: 'INGAME', // three possible states: 'INGAME', 'PAUSED' and 'LOST'
    shakeValue: new Animated.Value(0),
  };

  async componentWillMount() {
    const { navigation } = this.props;

    this.backgroundMusic = new Audio.Sound();
    this.exitBtnFX = new Audio.Sound();
    this.correctFX = new Audio.Sound();
    this.incorrectFX = new Audio.Sound();
    this.pauseFX = new Audio.Sound();
    this.playFX = new Audio.Sound();
    this.lostFX = new Audio.Sound();

    this.generateNewRound();
    this.interval = setInterval(() => {
      const { gameState, points, bestPoints, timeLeft, bestTime } = this.state;
      if (gameState === 'INGAME') {
        if (timeLeft > bestTime) {
          this.setState(prevState => ({ bestTime: prevState.timeLeft }));
          storeData('bestTime', timeLeft);
        }
        if (timeLeft <= 0) {
          this.backgroundMusic.stopAsync();
          this.lostFX.replayAsync();
          if (points > bestPoints) {
            this.setState(prevState => ({ bestPoints: prevState.points }));
            storeData('highScore', points);
          }
          this.setState({ gameState: 'LOST', timeLeft: 0 });
        } else {
          this.setState(prevState => ({
            timeLeft: Math.max(prevState.timeLeft - 1, 0),
          }));
        }
      }
    }, 1000);

    await this.initializeMusic();
    const highScore = await retrieveData('highScore');
    const bestTime = await retrieveData('bestTime');
    this.setState({ bestPoints: highScore || 0 });
    this.setState({ bestTime: bestTime || 0 });

    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      async () => {
        try {
          this.backgroundMusic.replayAsync();
          // The sound is playing
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
    clearInterval(this.interval);
    this.willFocusSubscription.remove();
    this.willBlurSubscription.remove();
  }

  initializeMusic = async () => {
    try {
      await this.backgroundMusic.loadAsync(
        require('../../assets/music/Komiku_BattleOfPogs.mp3')
      );
      await this.exitBtnFX.loadAsync(require('../../assets/sfx/button.wav'));
      await this.correctFX.loadAsync(require('../../assets/sfx/tile_tap.wav'));
      await this.incorrectFX.loadAsync(
        require('../../assets/sfx/tile_wrong.wav')
      );
      await this.pauseFX.loadAsync(require('../../assets/sfx/pause_in.wav'));
      await this.playFX.loadAsync(require('../../assets/sfx/pause_out.wav'));
      await this.lostFX.loadAsync(require('../../assets/sfx/lose.wav'));
      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
    } catch (e) {
      console.log(e);
    }
  };

  generateSizeIndex = size => Math.floor(Math.random() * size);

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    const size = Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5);
    this.setState({
      size,
      diffTileIndex: [
        this.generateSizeIndex(size),
        this.generateSizeIndex(size),
      ],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
    });
  };

  setGameState = () => {
    const { gameState, timeLeft, points, bestPoints } = this.state;
    if (gameState === 'INGAME' && timeLeft <= 0) {
      this.backgroundMusic.stopAsync();
      this.lostFX.replayAsync();
      if (points > bestPoints) {
        this.setState({ bestPoints: points });
        storeData('highScore', points);
      }
      this.setState({ gameState: 'LOST' });
    }
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, shakeValue } = this.state;
    if (rowIndex === diffTileIndex[0] && columnIndex === diffTileIndex[1]) {
      // Good tile
      this.setState(
        prevState => ({
          points: prevState.points + 1,
          timeLeft: prevState.timeLeft + 2,
        }),
        () => this.generateNewRound()
      );
      this.correctFX.replayAsync();
    } else {
      // Wrong tile
      shakeAnimation(shakeValue);
      this.setState(prevState => ({
        timeLeft: Math.max(prevState.timeLeft - 2, 0),
      }));
      this.incorrectFX.replayAsync();
    }
  };

  onBottomBarPress = () => {
    const { gameState } = this.state;
    switch (gameState) {
      case 'INGAME':
        this.setState({ gameState: 'PAUSED' });
        this.pauseFX.replayAsync();
        break;
      case 'PAUSED':
        this.setState({ gameState: 'INGAME' });
        this.playFX.replayAsync();
        break;
      case 'LOST':
        this.setState({ points: 0, timeLeft: 15, size: 2 }, () => {
          this.generateNewRound();
          this.setState({ gameState: 'INGAME' });
        });
        this.backgroundMusic.replayAsync();
        break;
      default:
        break;
    }
  };

  onExitPress = () => {
    const { navigation } = this.props;
    this.exitBtnFX.replayAsync();
    navigation.goBack();
  };

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      points,
      bestPoints,
      timeLeft,
      bestTime,
      gameState,
      shakeValue,
    } = this.state;
    const { width } = Dimensions.get('window');
    let bottomIcon;
    if (gameState === 'INGAME') {
      bottomIcon = pauseIcon;
    } else if (gameState === 'PAUSED') {
      bottomIcon = playIcon;
    } else {
      bottomIcon = replayIcon;
    }
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Header />
        </View>
        <View style={{ flex: 5, justifyContent: 'center' }}>
          <Animated.View
            style={{
              height: width * 0.875,
              width: width * 0.875,
              flexDirection: 'row',
              left: shakeValue,
            }}
          >
            {gameState === 'INGAME' ? (
              Array(size)
                .fill()
                .map((_, columnIndex) => (
                  <View
                    style={{ flex: 1, flexDirection: 'column' }}
                    key={columnIndex}
                  >
                    {Array(size)
                      .fill()
                      .map((__, rowIndex) => (
                        <TouchableOpacity
                          key={`${rowIndex}.${columnIndex}`}
                          style={{
                            flex: 1,
                            backgroundColor:
                              rowIndex === diffTileIndex[0] &&
                              columnIndex === diffTileIndex[1]
                                ? diffTileColor
                                : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                            margin: 2,
                          }}
                          onPress={() =>
                            this.onTilePress(rowIndex, columnIndex)
                          }
                        ></TouchableOpacity>
                      ))}
                  </View>
                ))
            ) : (
              <View style={styles.pausedContainer}>
                {gameState === 'PAUSED' ? (
                  <>
                    <Image
                      source={pausedIcon}
                      style={styles.pausedIcon}
                    ></Image>
                    <Text style={styles.pausedText}>COFFEE BREAK</Text>
                  </>
                ) : (
                  <>
                    <Image source={deadIcon} style={styles.pausedIcon} />
                    <Text style={styles.pausedText}>U DED</Text>
                  </>
                )}
                <TouchableOpacity onPress={this.onExitPress}>
                  <Image source={exitIcon} style={styles.exitIcon} />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
        <View style={{ flex: 2 }}>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomSectionContainer}>
              <Text style={styles.counterCount}>{points}</Text>
              <Text style={styles.counterLabel}>points</Text>
              <View style={styles.bestContainer}>
                <Image source={bestPointsIcon} style={styles.bestIcon}></Image>
                <Text style={styles.bestLabel}>{bestPoints}</Text>
              </View>
            </View>
            <View style={styles.bottomSectionContainer}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={this.onBottomBarPress}
              >
                <Image source={bottomIcon} style={styles.bottomIcon}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomSectionContainer}>
              <Text style={styles.counterCount}>{timeLeft}</Text>
              <Text style={styles.counterLabel}>seconds left</Text>
              <View styles={styles.bestContainer}>
                <Image source={bestTimeIcon} style={styles.bestIcon}></Image>
                <Text style={styles.bestLabel}>{bestTime}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Game;
