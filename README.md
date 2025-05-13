# fso-part4

Testing express servers, user administrations

## 4.1 - 4.2

- Reorganized files in part3 according to tutorial
- Connect bloglist to mongodb: add dotenv and cors. Refactor URL to .env file
- Test connection with Restapi (NOTE: posting to localhost:3001 is enough. Do not post to MongoDB)
- Connection will break if data is in wrong format (error handling is not implemented yet)

## 4.3 - 4.7

- Pretty easy, follow tutorial
- Use hashmap for last two exercises

## 4.8 - 4.14

- Add cross-env & NODE_ENV to package file to separate production/development/test modes
- Add separate url to mongodb testing in .env file
- supertest will automatically connect to an ephemeral port if there is no connections
- blogs.includes('') must exactly match the phrase
- remove _id and __v for testing
- put request: do not use blog = new Blog({ a: "b" }), simply blog = { a: "b" } is enough. We're updating, not posting a new blog