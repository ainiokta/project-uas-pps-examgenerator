// getquestionbank.test.js

const request = require('supertest');
const express = require('express');

// Import your getquestionbank function and the database connection logic
const { getquestionbank } = require('./controller/questionController');
const connection = require('./config/config'); // Import your database connection logic

const app = express();

// Mock the route in the express app
app.get('/questionbank', getquestionbank);

// Mock the database connection
jest.mock('./config/config', () => {
  return {
    query: jest.fn()
  };
});

describe('GET /questionbank', () => {
  it('should return a list of questions on successful database query', async () => {
    // Mock the database query result
    const mockResults = [{ id: 1, question: 'Sample question' }];
    connection.query.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    // Make a request to the mocked route
    const response = await request(app).get('/questionbank');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults);
  });

  it('should return an error message on database query failure', async () => {
    // Mock the database query error
    const errorMessage = 'Database error';
    connection.query.mockImplementationOnce((query, callback) => {
      callback(new Error(errorMessage), null);
    });

    // Make a request to the mocked route
    const response = await request(app).get('/questionbank');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Gagal memuat bank soal' });
  });
});
