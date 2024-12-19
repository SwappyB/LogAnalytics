/**
 * Database seeder to generate large amount of logs in the database
 */

import mongoose from 'mongoose'
import connectDB from '../connect'
import { faker } from '@faker-js/faker'
import ApiLog from '../../models/ApiLog'
import logger from '../../utils/logger'
import fs from 'fs'
import userIds from './data/users.json'
import endpoints from './data/endpoints.json'

// Generate a fixed set of user IDs
const generateUserIds = (userCount: number): string[] => {
  const userIds = []
  for (let i = 0; i < userCount; i++) {
    userIds.push(faker.database.mongodbObjectId())
  }
  return userIds
}

// Generate a fixed set of endpoints
const generateEndpoints = (totalEndpoint: number): string[] => {
  const endpoints = []
  for (let i = 0; i < totalEndpoint; i++) {
    endpoints.push(faker.internet.url())
  }
  return endpoints
}

// Generate random log data with repeating user IDs
const generateLogData = (userIds: string[], endpoints: string[], logCount: number) => {
  const logs = []
  for (let i = 0; i < logCount; i++) {
    logs.push({
      endpoint: faker.helpers.arrayElement(endpoints),
      method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
      userId: faker.helpers.arrayElement(userIds),
      timestamp: faker.date.recent({ days: 30 })
    })
  }
  return logs
}

const createUserIds = () => {
  // Random X users
  const userCount = 200
  const userIds = generateUserIds(userCount)

  fs.writeFileSync('./users.json', JSON.stringify(userIds))
}

const createEndpoints = () => {
  // Random X endpoints
  const endpointCount = 200
  const endpoints = generateEndpoints(endpointCount)

  fs.writeFileSync('./endpoint.json', JSON.stringify(endpoints))
}

// Seed data into the database
const seedData = async () => {
  // Total logs to generate
  const logCount = 200000

  const logs = generateLogData(userIds, endpoints, logCount)

  try {
    logger.info(`Inserting ${logCount} logs into the database...`)
    await ApiLog.insertMany(logs)
    logger.info('Data seeded successfully!')
  } catch (error) {
    logger.error('Error seeding data:', error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the script
const runSeeder = async () => {
  await connectDB()
  await seedData()
}

// createUserIds()
// createEndpoints()
runSeeder()
