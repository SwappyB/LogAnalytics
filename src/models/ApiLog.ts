import { Schema, model } from 'mongoose'

/**
 * Define schema for mongodb here, no value on the api log schema other than the default log id needs to be unqiue.
 */
const ApiLogSchema = new Schema({
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
})

ApiLogSchema.index({ endpoint: 1, timestamp: -1 })
ApiLogSchema.index({ userId: 1, timestamp: -1 })

export default model('ApiLog', ApiLogSchema)
