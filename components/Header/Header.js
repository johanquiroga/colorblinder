import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

function Header() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.header, { color: '#E64C3C' }]}>c</Text>
      <Text style={[styles.header, { color: '#E57E31' }]}>o</Text>
      <Text style={[styles.header, { color: '#F1C431' }]}>l</Text>
      <Text style={[styles.header, { color: '#68CC73' }]}>o</Text>
      <Text style={[styles.header, { color: '#3998DB' }]}>r</Text>
      <Text style={styles.header}>blinder</Text>
    </View>
  );
}

export default Header;
