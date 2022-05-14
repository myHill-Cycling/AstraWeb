/// <reference lib="WebWorker" />
declare let self: ServiceWorkerGlobalScope
import registration from "./workerRegistration";

import * as googleAnalytics from 'workbox-google-analytics';

googleAnalytics.initialize({
  parameterOverrides: {
    cd1: 'offline',
  },
});

registration();


self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
      self.skipWaiting()
  })