// ------ Import npm modules
// import cors    from 'cors'
import express from 'express'
import helmet from 'helmet'
import logRoutes from './routes'
import errorHandler from './middlewares/errorHandler'

const { createBullBoard } = require('@bull-board/api')
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'

import logQueue from './services/queueService'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/bulls')

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(logQueue)],
  serverAdapter: serverAdapter
})

const app: express.Application = express()

app.use('/bulls', serverAdapter.getRouter())

app.use(express.json())
app.use(helmet())

// Routes
app.use('/', logRoutes)

// Error Handling Middleware
app.use(errorHandler)

export default app
