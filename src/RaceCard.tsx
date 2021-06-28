import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { RaceSummary } from './types';
import { categoryIdToName } from './categories';
import { colors } from './constants';

type Props = {
  race: RaceSummary;
  time: number;
};

const RaceCard = ({ race, time }: Props) => {
  const timeUntilStart = race.advertised_start.seconds - time;
  const seconds = (timeUntilStart % 60).toString().padStart(2, '0');
  const minutes = Math.floor(timeUntilStart / 60);
  const timeString = timeUntilStart > 0 ? `Starts in ${minutes}:${seconds}` : 'Race has started!';
  return (
    <View style={[styles.card, timeUntilStart >= 0 ? styles.cardUpcoming : styles.cardStarted]}>
      <Text style={styles.raceTitle}>
        {race.meeting_name}, Race Number {race.race_number}
      </Text>
      <Text>{timeString}</Text>
      <Text>{categoryIdToName(race.category_id)}</Text>
    </View>
  );
};

export default RaceCard;

const styles = StyleSheet.create({
  card: {
    // ios shadow style
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // android shadow style
    elevation: 2,

    backgroundColor: colors.card,
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
  },

  cardStarted: {
    borderLeftColor: colors.secondary,
  },

  cardUpcoming: {
    borderLeftColor: colors.primary,
  },

  raceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
