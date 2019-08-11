import React from 'react';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';

import styles from './styles';

function Header({ fontSize }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.header, { color: '#E64C3C', fontSize }]}>c</Text>
      <Text style={[styles.header, { color: '#E57E31', fontSize }]}>o</Text>
      <Text style={[styles.header, { color: '#F1C431', fontSize }]}>l</Text>
      <Text style={[styles.header, { color: '#68CC73', fontSize }]}>o</Text>
      <Text style={[styles.header, { color: '#3998DB', fontSize }]}>r</Text>
      <Text style={styles.header}>blinder</Text>
    </View>
  );
}

Header.propTypes = {
  fontSize: PropTypes.number,
};

Header.defaultProps = {
  fontSize: 55,
};

export default Header;
