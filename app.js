import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import errorHandler from './middlewares/errorHandler.js'
import userRouter from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import router from './routes/auth.js'
import './passport.js'

const app = express();

// Enable CORS
app.use(cors());
app.options('*', cors());

// Middleware for JSON parsing
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Express session middleware (must come before passport.session())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use(`/api/v1/users`, userRouter);
app.use('/api/v1/auth', router);

// Error handling
app.use(errorHandler);

// 404 handling
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "This resource is not available"
  });
});

export default app;
