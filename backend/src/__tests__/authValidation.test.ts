import request from 'supertest';
import app from '../app';

describe('Auth Validation API Tests', () => {
  it('POST /api/auth/register should fail validation on empty body', async () => {
    const response = await request(app).post('/api/auth/register').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('errors');
  });

  it('POST /api/auth/register should fail on invalid email format', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'not-an-email',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it('POST /api/auth/login should fail validation on missing password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
