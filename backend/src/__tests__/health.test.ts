import request from 'supertest';
import app from '../app';

describe('Health Check API Endpoint', () => {
  it('GET /api/health should return status 200 and success status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message');
  });

  it('GET /api/invalid-route should return status 404', async () => {
    const response = await request(app).get('/api/invalid-route-xyz');

    expect(response.status).toBe(404);
  });
});
