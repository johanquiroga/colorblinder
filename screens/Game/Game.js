import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';

import { Header } from '../../components';

import styles from './styles';

import { generateRGB, mutateRGB } from '../../utils';

class Game extends React.Component {
  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1 }));
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
      this.setState(prevState => ({ timeLeft: prevState.timeLeft - 2 }));
    }
  };

  render() {
    const { rgb, size, diffTileIndex, diffTileColor } = this.state;
    const { width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Header />
        <View
          style={{
            height: width * 0.875,
            width: width * 0.875,
            flexDirection: 'row',
          }}
        >
          {Array(size)
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
                      onPress={() => this.onTilePress(rowIndex, columnIndex)}
                    ></TouchableOpacity>
                  ))}
              </View>
            ))}
        </View>
      </View>
    );
  }
}

export default Game;
