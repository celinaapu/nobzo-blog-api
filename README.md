# Blog API

A simple REST API for a blog application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication**: User registration and login with JWT
- **Posts**: Create, read, update, and delete blog posts
- **Drafts**: Save posts as drafts before publishing
- **Tags**: Organize posts with tags
- **Soft Delete**: Posts are marked as deleted instead of being removed
- **Pagination**: Paginated post listings
- **Search**: Search posts by title and content
- **Rate Limiting**: Protection against excessive requests

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts

- `GET /api/posts` - Get all posts (with pagination, search, and filters)
- `GET /api/posts/:slug` - Get a single post by slug
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/:id` - Update a post (requires authentication)
- `DELETE /api/posts/:id` - Delete a post (requires authentication)

### Health Check

- `GET /api/health` - Check API and database status

## Usage Examples

### Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Create a post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "status": "published",
    "tags": ["nodejs", "tutorial"]
  }'
```

### Get posts with pagination
```bash
curl "http://localhost:5000/api/posts?page=1&limit=10"
```

### Search posts
```bash
curl "http://localhost:5000/api/posts?search=nodejs"
```

## Query Parameters

### GET /api/posts

- `page` - Page number (default: 1)
- `limit` - Number of posts per page (default: 10)
- `search` - Search term for title and content
- `tag` - Filter by tag
- `author` - Filter by author ID
- `status` - Filter by status (draft/published)

## Data Models

### User
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required)

### Post
- `title` (string, required)
- `slug` (string, required, unique, auto-generated)
- `content` (string, required)
- `author` (ObjectId, required)
- `status` (enum: "draft" | "published", default: "draft")
- `tags` (array of strings)
- `createdAt` (date, auto)
- `updatedAt` (date, auto)
- `deletedAt` (date, nullable)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run tests

## License

MIT
# nobzo-blog-api
