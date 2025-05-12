import http from 'http';
import { server } from '../server.ts';
import { Item } from '../types.ts';

describe('CRUD API', () => {
  let createdUserId: string;
  let baseUrl: string;

  beforeAll((done) => {
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === 'string' ? 0 : address?.port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  const makeRequest = async (method: string, path: string, data?: unknown) => {
    const url = new URL(path, baseUrl);

    return new Promise<{ status: number; body: Item }>((resolve, reject) => {
      const req = http.request(
        {
          method,
          host: url.hostname,
          port: url.port,
          path: url.pathname,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const parsedBody = body ? JSON.parse(body) : null;
              resolve({
                status: res.statusCode || 0,
                body: parsedBody,
              });
            } catch (e) {
              reject(e);
            }
          });
        },
      );

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  };

  it('should create a new user', async () => {
    const { status, body } = await makeRequest('POST', '/users', {
      username: 'Test user',
      age: 100,
      hobbies: [],
    });

    expect(status).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body.username).toBe('Test user');
    createdUserId = body.id;
  });

  it('should get all users', async () => {
    const { status, body } = await makeRequest('GET', '/users');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it('should get a specific user', async () => {
    const { status, body } = await makeRequest('GET', `/users/${createdUserId}`);

    expect(status).toBe(200);
    expect(body.id).toBe(createdUserId);
  });

  it('should update an user', async () => {
    const { status, body } = await makeRequest('PUT', `/users/${createdUserId}`, {
      username: 'New name',
    });

    expect(status).toBe(200);
    expect(body.username).toBe('New name');
  });

  it('should delete an user', async () => {
    const { status } = await makeRequest('DELETE', `/users/${createdUserId}`);
    expect(status).toBe(204);

    const { status: verifyStatus } = await makeRequest('GET', `/users/${createdUserId}`);
    expect(verifyStatus).toBe(404);
  });
});
