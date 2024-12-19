import dotenv from 'dotenv'
import { ConfigModel, EnvironmentModel } from '../types/Config'
dotenv.config()

const env = JSON.parse(JSON.stringify(process.env)) as EnvironmentModel

// All Configs that needed to be centralized
export const config: ConfigModel = {
  // App Environment Variables
  env
}
