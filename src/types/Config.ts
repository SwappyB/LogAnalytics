export interface EnvironmentModel {
  readonly NODE_ENV: string
  readonly REDIS_URI: string
  readonly DB_URI: string
  readonly SERVER_PORT: string
}

export interface StringType {
  [key: string]: string
}

export interface RegexType {
  [key: string]: RegExp
}

export interface ConfigModel {
  readonly env: EnvironmentModel
}
