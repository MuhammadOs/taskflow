import request from 'supertest';
import app from '../app';

describe('Task Authorization & Validation API Tests', () => {
  it('GET /api/tasks should return 401 Unauthorized without Bearer token', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body.message).toContain('Not authorized');
  });

  it('POST /api/tasks should return 401 Unauthorized without Bearer token', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Unauthorized Task',
    });

    expect(response.status).toBe(401);
  });
});
