<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Ok dann machen wir weiter mit dem Secruity Hardening.

Was genau wären die nächsten Schritte dafür ?

Perfect! Hier ist dein **Security Hardening Action Plan** mit konkreten Code-Beispielen:[^1][^2][^3]

## 🔒 Security Hardening - Step-by-Step Guide

### Schritt 1: Dependencies installieren

```bash
npm install helmet express-mongo-sanitize hpp express-rate-limit
npm install --save-dev @types/express-rate-limit  # Falls du TypeScript nutzt
```


***

### Schritt 2: Helmet konfigurieren (app.js)

Helmet setzt wichtige HTTP-Security-Headers:[^4][^1]

```javascript
// app.js
const express = require('express');
const helmet = require('helmet');

const app = express();

// Helmet mit Custom-Config GANZ AM ANFANG einbinden
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Für Swagger UI nötig
      styleSrc: ["'self'", "'unsafe-inline'"],  // Für Swagger UI nötig
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Für Swagger UI nötig
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 Jahr
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
}));

// Rest deiner Middlewares...
```

**Was macht Helmet?**[^1]

- `Content-Security-Policy`: Verhindert XSS-Angriffe
- `Strict-Transport-Security`: Erzwingt HTTPS
- `X-Content-Type-Options`: Verhindert MIME-Sniffing
- `X-Frame-Options`: Verhindert Clickjacking
- `Referrer-Policy`: Kontrolliert Referrer-Header

***

### Schritt 3: NoSQL-Injection Prevention

Schützt vor MongoDB Query-Injection:[^3][^5]

```javascript
// app.js
const mongoSanitize = require('express-mongo-sanitize');

// Nach body-parser, VOR deinen Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NoSQL-Injection verhindern
app.use(mongoSanitize({
  replaceWith: '_', // Ersetzt $ und . Zeichen
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  NoSQL injection attempt detected: ${key} in ${req.path}`);
  }
}));
```

**Was wird verhindert?**

```javascript
// Ohne Sanitization gefährlich:
// POST /api/auth/login
{
  "email": {"$ne": null},  // Gibt ersten User zurück
  "password": {"$ne": null}
}

// Mit mongoSanitize wird daraus:
{
  "email": {"_ne": null},  // Harmlos
  "password": {"_ne": null}
}
```


***

### Schritt 4: HTTP Parameter Pollution Prevention

Verhindert doppelte Query-Parameter:[^1]

```javascript
// app.js
const hpp = require('hpp');

// Nach mongoSanitize, VOR Routes
app.use(hpp({
  whitelist: [
    // Erlaubte Array-Parameter (z.B. für Filter)
    'roles',
    'status',
    'type',
    'priority',
    'sort',
    'fields'
  ]
}));
```

**Was wird verhindert?**

```bash
# Ohne HPP könnte ein Angriff so aussehen:
GET /api/users?id=1&id=2&id=3

# Mit HPP wird nur der letzte Wert genutzt:
GET /api/users?id=3
```


***

### Schritt 5: Rate Limiting erweitern

Ergänze dein bestehendes Rate Limiting:[^2][^1]

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

// Globales Rate Limit (für alle Routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests pro IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'You have exceeded the request limit. Please try again later.',
      statusCode: 429,
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Strenges Rate Limit für Auth-Endpunkte
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // Max 5 Login-Versuche
  skipSuccessfulRequests: true, // Erfolgreiche Logins nicht zählen
  message: {
    error: 'Too many login attempts, please try again later.',
    statusCode: 429
  }
});

// Moderates Limit für Write-Operations
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Minuten
  max: 30, // Max 30 POST/PUT/PATCH/DELETE Requests
  message: {
    error: 'Too many write operations, please slow down.',
    statusCode: 429
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  writeLimiter
};
```

**In app.js einbinden:**

```javascript
// app.js
const { globalLimiter } = require('./middleware/rateLimit');

// Globales Rate Limit für alle Routes
app.use('/api', globalLimiter);
```

**In auth.routes.js:**

```javascript
// routes/auth.routes.js
const { authLimiter } = require('../middleware/rateLimit');

router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);
```


***

### Schritt 6: CORS richtig konfigurieren

Sichere CORS-Config für Production:[^1]

```javascript
// app.js
const cors = require('cors');

// CORS-Konfiguration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',      // Vite Dev
      'http://localhost:3000',      // React Dev
      'https://yourdomain.com',     // Production Frontend
      'https://www.yourdomain.com'  // Production Frontend (www)
    ];

    // API-Calls ohne Origin erlauben (z.B. Postman, cURL)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cookies erlauben
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'], // Für Pagination
  maxAge: 86400 // Preflight-Cache: 24 Stunden
};

app.use(cors(corsOptions));
```

**Alternativ für Development (einfacher):**

```javascript
// Nur für Development!
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: true, // Alle Origins erlauben
    credentials: true
  }));
} else {
  app.use(cors(corsOptions)); // Production: Strict
}
```


***

### Schritt 7: Cookie-Security verbessern

Sichere Cookie-Settings:[^1]

```javascript
// controllers/auth.controller.js oder middleware/auth.js

const setCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('jwt', token, {
    httpOnly: true,           // Nicht mit JavaScript lesbar (XSS-Schutz)
    secure: isProduction,     // Nur über HTTPS in Production
    sameSite: 'strict',       // CSRF-Schutz (oder 'lax' für Cross-Site)
    maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
    signed: false,            // Oder true mit cookie-parser secret
    path: '/',                // Cookie-Pfad
    domain: isProduction ? '.yourdomain.com' : undefined // Subdomain-Support
  });
};

// Beispiel in Login-Controller:
exports.login = async (req, res, next) => {
  try {
    // ... Login-Logik ...
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    setCookie(res, token);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    next(error);
  }
};
```


***

### Schritt 8: Input-Validation erweitern

Zusätzliche Validierung in Joi-Schemas:

```javascript
// validators/user.schema.js (Beispiel)
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
      'string.min': 'Password must be at least 8 characters long'
    }),
  
  displayName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z0-9\s\-_]+$/) // Nur alphanumerisch, Leerzeichen, - und _
    .required()
    .messages({
      'string.pattern.base': 'Display name can only contain letters, numbers, spaces, hyphens and underscores'
    })
});

module.exports = { userSchema };
```


***

### Schritt 9: Environment-Variablen validieren

Stelle sicher, dass alle kritischen Env-Vars gesetzt sind:

```javascript
// config/validateEnv.js (NEU erstellen)
const requiredEnvVars = [
  'MONGODB_URI',
  'DATABASE',
  'JWT_SECRET',
  'JWT_EXPIRES',
  'NODE_ENV'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }
  
  // JWT_SECRET sollte mindestens 32 Zeichen haben
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
};

module.exports = validateEnv;
```

**In server.js einbinden:**

```javascript
// server.js
const validateEnv = require('./config/validateEnv');

// Ganz am Anfang
validateEnv();

// Rest deines Codes...
```


***

### Schritt 10: Vollständige app.js Struktur

So sollte deine `app.js` jetzt aussehen:

```javascript
// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { globalLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const eventRoutes = require('./routes/event.routes');
const invitationRoutes = require('./routes/invitation.routes');

const app = express();

// 1. Security Headers (GANZ AM ANFANG)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 2. CORS
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProduction 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// 3. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Body Parsing
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. NoSQL Injection Prevention
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  NoSQL injection attempt: ${key} in ${req.path}`);
  }
}));

// 6. HTTP Parameter Pollution Prevention
app.use(hpp({
  whitelist: ['roles', 'status', 'type', 'priority', 'sort', 'fields']
}));

// 7. Rate Limiting
app.use('/api', globalLimiter);

// 8. Health Check (OHNE Auth/Rate Limit)
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// 9. Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/invitations', invitationRoutes);

// 10. 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  });
});

// 11. Global Error Handler (GANZ AM ENDE)
app.use(errorHandler);

module.exports = app;
```


***

## ✅ Security Checklist

Nach der Implementierung prüfen:

- [ ] Helmet installiert und konfiguriert
- [ ] `express-mongo-sanitize` aktiv
- [ ] `hpp` (HTTP Parameter Pollution) aktiv
- [ ] CORS nur für erlaubte Origins
- [ ] Rate Limiting auf Auth-Routes (max 5/15min)
- [ ] Rate Limiting auf API-Routes (max 100/15min)
- [ ] Cookies: `httpOnly: true`, `secure: true` in Production, `sameSite: 'strict'`
- [ ] Body-Payload auf 10kb limitiert
- [ ] Environment-Variablen beim Start validiert
- [ ] JWT_SECRET mindestens 32 Zeichen
- [ ] Keine sensiblen Daten in Logs (Passwörter, Tokens)
- [ ] `X-Powered-By` Header entfernt (Helmet)

***

## 🧪 Security Testing

Teste die Implementierung:

```bash
# 1. NoSQL-Injection-Test (sollte fehlschlagen)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'

# 2. Rate-Limit-Test (sollte nach 5 Versuchen 429 geben)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# 3. CORS-Test (sollte nur erlaubte Origins akzeptieren)
curl -X GET http://localhost:3000/api/users \
  -H "Origin: https://evil-site.com" \
  -v

# 4. Security-Headers prüfen
curl -I http://localhost:3000/api/health
# Sollte enthalten: X-Content-Type-Options, Strict-Transport-Security, etc.
```


***

## 📝 .env.sample erstellen

```bash
# .env.sample (für Dokumentation)
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE=orgaapp

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES=24h

# CORS (Production)
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```


***

Das ist dein komplettes Security Hardening Setup! Alle Maßnahmen sind Production-ready und folgen den aktuellen Best Practices. Nach der Implementierung hast du ein robustes, sicheres Backend! 🔒[^2][^3][^1]
<span style="display:none">[^10][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://expressjs.com/en/advanced/best-practice-security.html

[^2]: https://dev.to/govind_tiwari/best-security-practices-in-expressjs-a-beginners-guide-19k1

[^3]: https://dev.to/liyang51827/thoughts-on-how-to-prevent-nosql-injection-for-nodejs-express-server-b1m

[^4]: https://helmetjs.github.io

[^5]: https://stackoverflow.com/questions/13436467/javascript-nosql-injection-prevention-in-mongodb

[^6]: https://expressjs.com/2025/05/19/security-releases.html

[^7]: https://openjsf.org/blog/openjs-security-checkpoint-2025-so-far

[^8]: https://javascript.plainenglish.io/️-10-node-js-security-best-practices-you-shouldnt-ignore-in-2025-a066ea08caf6

[^9]: https://github.com/helmetjs/helmet/issues/178

[^10]: https://www.reddit.com/r/expressjs/comments/1lwda5e/express_security_best_practices_for_software/

