const request = require('supertest');
const { app } = require('../server');
const db = require('../config/database');

beforeAll(async () => {
  await db.initDatabase();
});

afterAll(async () => {
  await db.pool.end();
});

test('health endpoint reports database connection', async () => {
  const response = await request(app).get('/health');
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe('ok');
  expect(response.body.database).toBe('connected');
});

test('books endpoint returns an array', async () => {
  const response = await request(app).get('/api/books');
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

test('book creation validates required fields', async () => {
  const response = await request(app).post('/api/books').send({ title: 'Only title' });
  expect(response.statusCode).toBe(400);
});
