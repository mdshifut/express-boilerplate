const request = require('supertest');

let server;

describe('Not found route', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    server = require('../server');
  });

  afterEach(async () => {
    await server.close();
  });

  it('should return 404 if route does not exist', async () => {
    expect.assertions(2);

    const { status, body } = await request(server).post('/api/invalid');

    expect(status).toBe(404);
    expect(body).toHaveProperty('error.message');
  });
});
