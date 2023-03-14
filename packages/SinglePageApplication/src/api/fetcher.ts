type FetchMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const fetcher = (method: FetchMethods) => (url: string) => {
  return fetch(url, { method }).then((res) => res.json());
};
