export type RaceSummary = {
  race_id: string;
  race_name: string;
  advertised_start: {
    seconds: number;
  };
  meeting_name: string;
  race_number: number;
  category_id: string;
};
