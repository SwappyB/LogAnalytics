import { Schema, model } from 'mongoose'

/**
 * Similar to ApiLogSchema though its only purpose is to store archieved logs which are older than 30 days.
 * No indexes created as this will not be queried.
 */
const ApiLogArchiveSchema = new Schema({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, required: true }
})

export default model('ApiLogArchive', ApiLogArchiveSchema)
