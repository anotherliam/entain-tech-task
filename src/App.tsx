import React, { useCallback, useEffect, useState } from 'react';
import {
  SectionList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SectionListData,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, fetchDebounce, racingEndpoint, timeUntilRemove } from './constants';
import { categoryIds, categoryIdToName } from './categories';
import { RaceSummary } from './types';
import RaceCard from './components/RaceCard';
import unionBy from 'lodash/unionBy';

type APIResponse = {
  data: {
    next_to_go_ids: string[];
    race_summaries: Record<string, RaceSummary>;
  };
};

const getCurrentTimeInSeconds = () => Math.floor(Date.now() / 1000);

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [category, setCategory] = useState<string>('');
  const [sortedRaceData, setSortedRaceData] = useState<RaceSummary[]>([]);
  const [time, setTime] = useState<number>(0);

  /**
   * Called both on mount and periodically to fetch data.
   */
  const updateRaces = useCallback(async () => {
    setLastFetchTime(getCurrentTimeInSeconds);
    try {
      const response = await fetch(racingEndpoint);
      const body: APIResponse = await response.json();
      // Merge old races and new ones together, removing any that are more than 1 minute ago
      setSortedRaceData((prevRaces) => {
        const newRaces = body.data.next_to_go_ids.map((id) => body.data.race_summaries[id]);
        return unionBy(newRaces, prevRaces, 'race_id').sort(
          // sort by time then by id (to prevent elements jumping around if they have the same start time)
          (a, b) =>
            a.advertised_start.seconds - b.advertised_start.seconds ||
            a.race_id.localeCompare(b.race_id),
        );
      });
    } catch (e) {
      console.warn(e);
      setError('Failed to fetch data');
    }
  }, []);

  /**
   * Update timer every 100ms
   */
  useEffect(() => {
    let timer = setInterval(() => setTime(getCurrentTimeInSeconds()), 100);
    return () => clearInterval(timer);
  }, [setTime]);

  /**
   * On mount, do initial fetch
   */
  useEffect(() => {
    updateRaces();
  }, [updateRaces]);

  // Create the data for the section list
  const firstRaceToShowIndex =
    sortedRaceData.findIndex((race) => time <= race.advertised_start.seconds + timeUntilRemove) ||
    0;
  const racesToShow = sortedRaceData
    .slice(firstRaceToShowIndex, firstRaceToShowIndex + 5)
    .filter((race) => category === '' || category === race.category_id);
  const sectionListData: SectionListData<RaceSummary>[] = [
    {
      title: 'Started Races',
      data: racesToShow.filter((race) => race.advertised_start.seconds <= time),
    },
    {
      title: 'Upcoming Races',
      data: racesToShow.filter((race) => race.advertised_start.seconds > time),
    },
  ];

  // Trigger a new fetch if the most recent item in sorted races has expired and if its been at least 10s since the last fetch
  if (time >= lastFetchTime + fetchDebounce && firstRaceToShowIndex !== 0) {
    updateRaces();
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle={'light-content'} />

      <View style={styles.categoryList}>
        <Picker selectedValue={category} onValueChange={(newCategory) => setCategory(newCategory)}>
          <Picker.Item label="All Categories" value={''} />
          {categoryIds.map((categoryId) => (
            <Picker.Item key={categoryId} value={categoryId} label={categoryIdToName(categoryId)} />
          ))}
        </Picker>
      </View>

      {error !== null ? (
        <View style={styles.errorMessageContainer}>
          <Text>{error}</Text>
        </View>
      ) : sortedRaceData.length <= 0 ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <SectionList
          sections={sectionListData}
          keyExtractor={(race) => race.race_id}
          renderItem={({ item }) => <RaceCard race={item} time={time} />}
          renderSectionHeader={({ section }) =>
            section.data.length >= 1 ? (
              <Text style={styles.sectionTitleText}>{section.title}</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 12,
  },

  sectionTitleText: {
    marginLeft: 8,
    fontSize: 14,
  },

  categoryList: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },

  errorMessageContainer: {
    alignItems: 'center',
  },
});

export default App;
