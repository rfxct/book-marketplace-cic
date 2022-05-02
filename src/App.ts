import express from 'express'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

import routes from './routes'
import swaggerOutput from './docs/swagger_output.json'
import handleError from '@utils/handleError'

const app = express()

app.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))
app.use(routes)

app.use(handleError)

export default app
