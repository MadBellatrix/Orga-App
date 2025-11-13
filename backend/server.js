import express from "express";
import connectDB from "./libs/dbConnect.js";
import validateEnv from "./config/validateEnv.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import eventRouter from "./routes/event.routes.js";
import inviteRouter from "./routes/invitation.routes.js"
import authRouter from "./routes/auth.routes.js";
import healthRouter from "./routes/health.routes.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { globalLimiter, authLimiter, writeLimiter, apiLimiter, loginLimiter } from './middleware/rateLimit.js';

// Validate required environment variables early
validateEnv();

const swaggerDocument = YAML.load(new URL('./docs/openapi.yaml', import.meta.url).pathname);

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.FRONTEND_URL || (isProduction ? '' : 'http://localhost:5173')).split(',').filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!isProduction) return callback(null, true);
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['X-Total-Count']
}));

// Logging
if (!isProduction) app.use(morgan('dev'));

// Body parsing with limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Input sanitization and HPP
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(hpp({ whitelist: ['roles', 'status', 'type', 'priority', 'sort', 'fields'] }));

// Rate limiting (global)
app.use(globalLimiter);

// Health & readiness (mounted at root)
app.use('/', healthRouter);

// Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs.json', (req, res) => res.json(swaggerDocument));

// Routes
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/event', eventRouter);
app.use('/invite', inviteRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
});
