import { GroupData } from '@showcase/restapi/types';

type FetchMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const fetcher = (method: FetchMethods) => (url: string, body?: string) => {
  return fetch(url, { method, body }).then((res) => res.json());
};

export async function addGroupToDatabase(name: string) {
  return (await fetcher('POST')(`/api/groups?name=${name}`)) as GroupData;
}
