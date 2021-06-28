export const colors = {
  background: '#eee',
  card: '#fff',
  border: '#000',
  primary: '#8e24aa',
  secondary: '#2e7d32',
};

// Time to wait between fetches
export const fetchDebounce = 10;

// Number of seconds until a race should dissapear after it starts
export const timeUntilRemove = 60;

export const racingEndpoint = 'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10';
