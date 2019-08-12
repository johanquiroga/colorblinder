import React from 'react';
import { View, Dimensions, TouchableOpacity, Text, Image } from 'react-native';

import { Header } from '../../components';

import styles from './styles';

import { generateRGB, mutateRGB } from '../../utils';

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
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    gameState: 'INGAME', // three possible states: 'INGAME', 'PAUSED' and 'LOST'
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      const { gameState } = this.state;
      if (gameState === 'INGAME') {
        this.setState(
          prevState => ({ timeLeft: Math.max(prevState.timeLeft - 1, 0) }),
          () => this.setGameState()
        );
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
    const { gameState, timeLeft } = this.state;
    if (gameState === 'INGAME' && timeLeft <= 0) {
      this.setState({ gameState: 'LOST' });
    }
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex } = this.state;
    if (rowIndex === diffTileIndex[0] && columnIndex === diffTileIndex[1]) {
      // Good tile
      this.setState(
        prevState => ({
          points: prevState.points + 1,
          timeLeft: prevState.timeLeft + 2,
        }),
        () => this.generateNewRound()
      );
    } else {
      // Wrong tile
      this.setState(
        prevState => ({ timeLeft: Math.max(prevState.timeLeft - 2, 0) }),
        () => this.setGameState()
      );
    }
  };

  onBottomBarPress = () => {
    const { gameState } = this.state;
    switch (gameState) {
      case 'INGAME':
        this.setState({ gameState: 'PAUSED' });
        break;
      case 'PAUSED':
        this.setState({ gameState: 'INGAME' });
        break;
      case 'LOST':
        this.setState({ points: 0, timeLeft: 15, size: 2 }, () => {
          this.generateNewRound();
          this.setState({ gameState: 'INGAME' });
        });
        break;
      default:
        break;
    }
  };

  onExitPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      points,
      timeLeft,
      gameState,
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
          <View
            style={{
              height: width * 0.875,
              width: width * 0.875,
              flexDirection: 'row',
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
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomSectionContainer}>
              <Text style={styles.counterCount}>{points}</Text>
              <Text style={styles.counterLabel}>points</Text>
              <View style={styles.bestContainer}>
                <Image source={bestPointsIcon} style={styles.bestIcon}></Image>
                <Text style={styles.bestLabel}>0</Text>
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
                <Text style={styles.bestLabel}>0</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Game;
