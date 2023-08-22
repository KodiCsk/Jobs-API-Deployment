require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB=require('./db/connect')

//security packages

const helmet=require('helmet')
const cors=require('cors')
const xssClean=require('xss-clean')
const rateLimiter=require('express-rate-limit')

const authenticateUser=require('./middleware/authentication')

const jobsRouter=require('./routes/jobs')
const authRouter=require('./routes/auth')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs:15*60*1000, //15minutes
  max:100
}));

app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xssClean());


// routes
// app.get('/', (req, res) => {
//   res.send('jobs api');
// });

app.use('/api/v1/jobs',authenticateUser,jobsRouter)
app.use('/api/v1/auth',authRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
