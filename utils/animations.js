import { Animated } from 'react-native';

export const shakeAnimation = val =>
  Animated.sequence([
    Animated.timing(val, {
      toValue: 50,
      duration: 100,
      // useNativeDriver: true,
    }),
    Animated.timing(val, {
      toValue: -50,
      duration: 100,
      // useNativeDriver: true,
    }),
    Animated.timing(val, {
      toValue: 50,
      duration: 100,
      // useNativeDriver: true,
    }),
    Animated.timing(val, {
      toValue: -50,
      duration: 100,
      // useNativeDriver: true,
    }),
    Animated.timing(val, {
      toValue: 0,
      duration: 100,
      // useNativeDriver: true,
    }),
  ]).start();
