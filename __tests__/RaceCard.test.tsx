import 'react-native';
import React from 'react';
import RaceCard from '../src/RaceCard';

import renderer from 'react-test-renderer';
import { RaceSummary } from '../src/types';

const testRaceData: RaceSummary = {
  race_id: 'test-race-id',
  race_name: 'test-race-name',
  race_number: 1,
  meeting_name: 'test-meeting-name',
  advertised_start: {
    seconds: 15000,
  },
  category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b',
};

it('matches snapshot in the future', () => {
  const tree = renderer.create(<RaceCard race={testRaceData} time={11000} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('matches snapshot in the past', () => {
  const tree = renderer.create(<RaceCard race={testRaceData} time={19000} />).toJSON();
  expect(tree).toMatchSnapshot();
});
