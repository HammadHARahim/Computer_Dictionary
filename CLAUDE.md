# CLAUDE.md - AI Assistant Guide for Computer Dictionary

## Project Overview

**Computer Dictionary** is a web-based dictionary application designed for Computer Science students. It provides definitions, term notes, and language information for computer science terminology.

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Template Engine**: Pug
- **HTTP Client**: Axios
- **Data Source**: CSV file (Book5.csv) with computer science terms
- **Deployment**: Docker + GitHub Actions CI/CD

### Key Features
- Search computer science terms
- RESTful API for term retrieval
- MongoDB data persistence
- CSV data import pipeline
- Modal-based UI for displaying results
- CORS-enabled API

---

## Directory Structure

```
Computer_Dictionary/
├── .github/
│   └── workflows/
│       └── node.yml              # GitHub Actions CI pipeline
├── controller/
│   └── dicterms.controller.js    # Business logic for term operations
├── data/
│   └── Book5.csv                 # Source data (5.5MB CSV file)
├── db/
│   └── connect.js                # MongoDB connection handler
├── middleware/
│   └── auth.js                   # Authentication middleware (currently logs only)
├── modal/                        # Note: Typo - should be "models"
│   ├── dictionay_data_modal.js   # CSV parsing and data processing
│   └── mongo.modal.js            # Mongoose schema definition
├── public/                       # Static frontend files
│   ├── Index.html                # Main HTML page
│   ├── script.js                 # Frontend JavaScript
│   ├── style.css                 # Styling
│   └── src/
│       └── terms.js              # (Additional frontend module)
├── routes/
│   └── terms.routes.js           # API route definitions
├── views/
│   └── Unauthorised.pug          # Pug template for unauthorized access
├── .dockerignore
├── .gitignore
├── Dockerfile                    # Docker containerization
├── package.json                  # Dependencies and scripts
├── package-lock.json
├── README.md
└── server.js                     # Application entry point
```

---

## Architecture & Data Flow

### 1. Application Initialization (server.js:26-34)

```
1. Load environment variables (.env file)
2. Connect to MongoDB using MONGO_URL
3. Start Express server on port 1000
4. Apply middleware (CORS, Morgan logging, auth)
5. Serve static files from /public
```

### 2. Data Import Pipeline (modal/dictionay_data_modal.js)

```
CSV File (Book5.csv)
  → Read Stream
  → CSV Parser
  → Filter (type3 === 'definition')
  → Map to Schema { term, defination, termNote, lang }
  → Export as cloneData array
```

**Important**: This file runs on module load and processes the CSV asynchronously.

### 3. API Request Flow

```
Client Request
  → middleware/auth.js (logs origin, passes through)
  → routes/terms.routes.js (route matching)
  → controller/dicterms.controller.js (business logic)
  → modal/mongo.modal.js (database operations)
  → Response (JSON)
```

### 4. Frontend Flow (public/script.js)

```
User Input (search form)
  → Form Submit Event
  → axios GET request to /api/v1/terms/{term}
  → Open Modal
  → Display Results (term, definition, termNote, lang)
  → Close Modal (X button / Escape / Overlay click)
```

---

## API Endpoints

### Base URL
- **Development**: `http://localhost:1000/api/v1`

### Endpoints

#### 1. GET /api/v1/terms
**Description**: Populates MongoDB with all terms from CSV data
**Authentication**: Required (origin header checked)
**Response**: 200 OK
```json
{
  "cloneData": [ /* array of all terms */ ]
}
```
**Controller**: `getAlldata()` in controller/dicterms.controller.js:9-12
**Note**: Uses `insertMany()` - may cause duplicates on repeated calls

#### 2. GET /api/v1/terms/:id
**Description**: Retrieve a specific term by name
**Parameters**:
- `id` (path): Term name (case-sensitive in DB, lowercased in frontend)
**Authentication**: Required (origin header checked)
**Response**: 200 OK
```json
{
  "findSingleTerms": [
    {
      "term": "string",
      "defination": "string",
      "termNote": "string",
      "lang": "string"
    }
  ]
}
```
**Error Response**: 400 Bad Request
```json
{
  "msg": "Term not available"
}
```
**Controller**: `getDataOnly()` in controller/dicterms.controller.js:15-33

---

## Database Schema

### Collection: `Terms` (modal/mongo.modal.js)

```javascript
{
  term: String (required),
  defination: String (required),  // Note: Typo in field name
  termNote: String (required),
  lang: String (required)
}
```

**Important Notes**:
- Field name is `defination` (not "definition") - this is consistent throughout the codebase
- MongoDB connection requires `MONGO_URL` environment variable
- Connection is established in db/connect.js:3-8

---

## Environment Variables

Required in `.env` file (root directory):

```env
MONGO_URL=mongodb://[username:password@]host[:port]/database
```

**Security Note**: `.env` is gitignored (see .gitignore:2)

---

## Development Workflows

### Starting the Application

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with MONGO_URL

# Start the server
npm start
# Server runs on http://localhost:1000
```

### Docker Deployment

```bash
# Build image
docker build -t computer-dictionary .

# Run container
docker run -p 8080:1000 -e MONGO_URL=<your-mongo-url> computer-dictionary
```

**Note**: Dockerfile exposes port 8080 but app runs on port 1000 (Dockerfile:13, server.js:29)

### CI/CD Pipeline

**Trigger**: Push or PR to `master` branch
**Workflow**: .github/workflows/node.yml
- Checkout code
- Setup Node.js v18
- Run `npm install`

**Note**: No test scripts currently defined (package.json:8)

---

## Code Conventions & Patterns

### 1. Naming Conventions
- **Controllers**: `{resource}.controller.js`
- **Routes**: `{resource}.routes.js`
- **Models**: `{resource}.modal.js` (Note: Should be "model")
- **Functions**: camelCase
- **Constants**: Uppercase (e.g., `URL`)

### 2. Module Pattern
All modules use CommonJS (`require`/`module.exports`)

### 3. Async/Await
Controllers use async/await for database operations (controller/dicterms.controller.js:9, 15)

### 4. Error Handling
- Frontend: Try-catch with axios interceptors (script.js:47-61)
- Backend: HTTP status codes via `http-status-codes` library
- Current gap: No global error handler middleware

### 5. Middleware Order (server.js:13-20)
```javascript
1. morgan('combined')  // Logging
2. cors()              // CORS headers
3. mid_Auth            // Authentication check
4. express.static()    // Static file serving
```

---

## Known Issues & Technical Debt

### 1. Typos in Codebase
- Directory: `modal/` should be `models/`
- Field: `defination` should be `definition`
- File: `dictionay_data_modal.js` has multiple typos

### 2. Authentication
- `middleware/auth.js` is commented out (lines 7-14)
- Currently only logs origin header
- Authorization not enforced

### 3. Database Operations
- `getAlldata()` uses `insertMany()` without duplicate checking
- Could cause duplicate entries on repeated calls
- No indexes defined on `term` field (would improve search performance)

### 4. CORS Configuration
- Hardcoded origin: `http://127.0.0.1:5501` (server.js:16)
- Not suitable for production deployment

### 5. Error Handling
- No validation middleware
- No global error handler
- Database errors not properly caught in db/connect.js

### 6. Frontend
- Hardcoded API URL: `http://localhost:1000` (script.js:45)
- No environment-based configuration
- Page reload on modal close (script.js:41) - not optimal UX

### 7. Port Mismatch
- Dockerfile exposes 8080 but app runs on 1000
- Inconsistent configuration

---

## Common AI Assistant Tasks

### 1. Adding New API Endpoints

**Steps**:
1. Define route in `routes/terms.routes.js`
2. Create controller function in `controller/dicterms.controller.js`
3. Use `termModal` from `modal/mongo.modal.js` for database operations
4. Return appropriate status codes using `StatusCodes` enum

**Example**:
```javascript
// In routes/terms.routes.js
router.post('/terms', createTerm);

// In controller/dicterms.controller.js
async function createTerm(req, res) {
  const newTerm = await termModal.create(req.body);
  res.status(StatusCodes.CREATED).json({ newTerm });
}
```

### 2. Modifying Database Schema

**Location**: `modal/mongo.modal.js`

**Important**:
- Schema changes require data migration
- Consider existing data in CSV file
- Update `dictionay_data_modal.js` mapping logic (line 27-34)

### 3. Frontend Changes

**Files**:
- HTML: `public/Index.html`
- CSS: `public/style.css`
- JavaScript: `public/script.js`

**Notes**:
- Uses vanilla JavaScript (no framework)
- Modal system in place (lines 31-56 in Index.html)
- Axios loaded via CDN (Index.html:8)

### 4. Adding Middleware

**Steps**:
1. Create file in `middleware/` directory
2. Export middleware function
3. Import and apply in `server.js` before routes

**Example**:
```javascript
// middleware/validation.js
module.exports = (req, res, next) => {
  // validation logic
  next();
};

// server.js
const validation = require('./middleware/validation');
app.use('/api/v1', mid_Auth, validation, router);
```

### 5. Environment Configuration

**Current**: Only `MONGO_URL` is used
**To Add**:
1. Add to `.env` file
2. Access via `process.env.VARIABLE_NAME`
3. Update `.env.example` if creating one
4. Document in this file

### 6. Testing

**Current State**: No tests implemented (package.json:8)

**To Implement**:
1. Install testing framework (Jest, Mocha, etc.)
2. Create `test/` or `__tests__/` directory
3. Update `package.json` test script
4. Add test step to GitHub Actions workflow

### 7. Fixing Typos

**Priority Files**:
1. Rename `modal/` → `models/`
2. `defination` → `definition` (requires DB migration)
3. `dictionay_data_modal.js` → `dictionary_data_model.js`

**Important**: Coordinate renames across:
- File names
- Require statements
- Database fields
- Frontend code

---

## Dependencies

### Production Dependencies (package.json:13-22)
- `axios`: ^1.4.0 - HTTP client
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^16.3.1 - Environment variables
- `express`: ^4.18.2 - Web framework
- `http-status-codes`: ^2.2.0 - Status code constants
- `mongoose`: ^7.4.2 - MongoDB ODM
- `morgan`: ^1.10.0 - HTTP request logger
- `pug`: ^3.0.2 - Template engine

### Dev Dependencies
None currently installed

**Suggestions for Development**:
- `nodemon` - Auto-restart on file changes
- `eslint` - Code linting
- `prettier` - Code formatting
- `jest` or `mocha` - Testing framework

---

## Performance Considerations

### 1. CSV Loading
- `dictionay_data_modal.js` loads on module import
- Blocks initial server start
- Consider lazy loading or background processing

### 2. Database Queries
- No indexes on `term` field
- Case-sensitive searches
- Consider: `termModal.createIndex({ term: 1 })`

### 3. Frontend
- Axios loaded from CDN (network dependent)
- Consider bundling for offline capability
- No caching of search results

---

## Security Considerations

### 1. Input Validation
- No validation on term search
- Vulnerable to NoSQL injection
- Recommendation: Use express-validator or Joi

### 2. Authentication
- Currently bypassed (middleware/auth.js:7-14)
- Should implement proper auth if exposing publicly

### 3. CORS
- Overly restrictive in dev (single origin)
- Will need environment-based config for production

### 4. Environment Variables
- Properly gitignored
- Ensure .env is never committed

### 5. Rate Limiting
- No rate limiting implemented
- Consider `express-rate-limit` for production

---

## Deployment Checklist

Before deploying to production:

- [ ] Uncomment and implement authentication in `middleware/auth.js`
- [ ] Configure CORS for production domains
- [ ] Set up environment variables on hosting platform
- [ ] Add database indexes for performance
- [ ] Implement error handling middleware
- [ ] Add input validation
- [ ] Set up logging (consider Winston or Bunyan)
- [ ] Add rate limiting
- [ ] Update frontend API URL to use environment variable
- [ ] Fix port mismatch in Dockerfile
- [ ] Implement health check endpoint
- [ ] Add monitoring (e.g., PM2, New Relic)
- [ ] Set up SSL/TLS
- [ ] Review and update dependencies
- [ ] Add tests before deployment

---

## Quick Reference

### File Locations
- **Entry Point**: server.js
- **API Routes**: routes/terms.routes.js
- **Business Logic**: controller/dicterms.controller.js
- **Database Schema**: modal/mongo.modal.js
- **DB Connection**: db/connect.js
- **Frontend**: public/Index.html, public/script.js
- **Data Source**: data/Book5.csv

### Port Configuration
- Development: 1000
- Docker Exposed: 8080 (needs mapping)

### Git Workflow
- Main branch: `master`
- CI triggers on push/PR to master
- Current branch: `claude/claude-md-mhywtrmnh74qyn50-01R9Vy7LShQk4VujcLvA4xUc`

---

## Additional Resources

- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- MongoDB: https://www.mongodb.com/docs/
- Axios: https://axios-http.com/

---

**Last Updated**: 2025-11-14
**Codebase Version**: Based on commit 92ac985
