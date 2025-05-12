import cluster from 'cluster';
import os from 'os';
import http, { IncomingMessage, ServerResponse, RequestOptions } from 'http';
import { URL } from 'url';
import { Utils } from './utils.ts';
import { RouterMethods } from './router.ts';
import { ClusterWorker, WorkerPorts } from './types.ts';

const PORT = Number(process.env.PORT || '4000');
const numCPUs: number = os.cpus().length;
const workerPorts: number[] = Array.from({ length: numCPUs - 1 }, (_, i) => PORT + 1 + i);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const workers: WorkerPorts = {};

  workerPorts.forEach((port) => {
    const worker: ClusterWorker = cluster.fork({ WORKER_PORT: port.toString() });
    workers[worker.id] = port;
    worker.workerPort = port;
  });

  const balancer = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const path = url.pathname;

      const workerIds = Object.keys(cluster.workers as { [key: string]: ClusterWorker });
      const currentWorkerIndex: number = (Utils.lastWorkerIndex || 0) % workerIds.length;
      Utils.lastWorkerIndex = currentWorkerIndex + 1;

      const workerId = workerIds[currentWorkerIndex];
      const worker: ClusterWorker | undefined = (
        cluster.workers as { [key: string]: ClusterWorker }
      )[workerId];

      if (!worker) {
        Utils.sendResponse(res, 503, { error: 'Service Unavailable' });
        return;
      }

      const port: number = worker.workerPort || workerPorts[currentWorkerIndex];

      const options: RequestOptions = {
        hostname: 'localhost',
        port,
        path,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq = http.request(options, (proxyRes: IncomingMessage) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });

      proxyReq.on('error', (err: Error) => {
        console.error('Proxy error:', err);
        Utils.sendResponse(res, 500, { error: 'Internal Server Error' });
      });
    } catch (error: unknown) {
      console.error('Load balancer error:', error);
      Utils.sendResponse(res, 500, {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  balancer.listen(PORT, 'localhost', () => {
    console.log(`Load balancer running on http://localhost:${PORT}`);
  });

  cluster.on('exit', (worker: ClusterWorker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    const newWorker: ClusterWorker = cluster.fork();
    workers[newWorker.id] = worker.workerPort || PORT + 1;
    newWorker.workerPort = worker.workerPort;
  });

  process.on('SIGINT', () => {
    console.log('Shutting down cluster...');
    for (const id in cluster.workers) {
      (cluster.workers[id] as ClusterWorker)?.kill();
    }
    balancer.close(() => {
      process.exit(0);
    });
  });
} else {
  const workerPort = Number(process.env.WORKER_PORT || '4000');

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const path = url.pathname;
      const method = req.method?.toUpperCase() || '';
      const route = RouterMethods.findRouteHandler(method, path);
      if (route) {
        await route.handler(req, res, route.params);
      } else {
        Utils.sendResponse(res, 404, { error: 'The requested resource does not exist' });
      }
    } catch (error) {
      console.error('Server error:', error);
      Utils.sendResponse(res, 500, { error: 'Internal Server Error' });
    }
  });

  server.listen(workerPort, 'localhost', (error?: Error) => {
    if (error) {
      console.error(`Worker ${process.pid} error:`, error);
      process.exit(1);
    }
    console.log(`Worker ${process.pid} listening on http://localhost:${workerPort}`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}
