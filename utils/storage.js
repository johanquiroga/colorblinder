import { AsyncStorage } from 'react-native';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`@ColorBlinder:${key}`, String(value));
  } catch (err) {
    console.log(err);
  }
};

export const retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(`@ColorBlinder:${key}`);
    if (value !== null) {
      return value;
    }
  } catch (err) {
    console.log(err);
  }
};
