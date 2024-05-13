import { delay, http, HttpResponse } from 'msw';
import { server } from './server';

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};

export const simulateSuccess = (endpoint: string) => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json([]);
    })
  );
};
