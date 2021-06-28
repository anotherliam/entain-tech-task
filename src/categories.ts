export const categories: Record<string, string> = {
  '9daef0d7-bf3c-4f50-921d-8e818c60fe61': 'Greyhound Racing',
  '161d9be2-e909-4326-8c2c-35ed71fb460b': 'Horse Racing',
  '4a2788f8-e825-4d36-9894-efd4baf1cfae': 'Harness Racing',
};

export const categoryIds = Object.keys(categories);

export const categoryIdToName = (id: string) => categories[id] || 'Unknown';
