# fso-part4

Testing express servers, user administrations

##

- async/await vs chaining: <https://maximorlov.com/async-await-better-than-chaining-promises/>
- use try-catch with async/await (or express-async-errors library. **WARNING: dead**) for error handling.
- package.json script:

```json
  "start": "cross-env NODE_ENV=production node index.js",
  "dev": "cross-env NODE_ENV=development node --watch index.js",
  "test": "cross-env NODE_ENV=test node --test"
```

- testing:

  ```js
  npm test -- --test-name-pattern="something"
  npm test -- tests/note_api.test.js
  npm test -- --test-only
  ```

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

##

- Instead of testing functions manually (w/ Postman/Restclient, etc.) now we can do automated testing (user.test.js)
- Test-driven development: tests for new functionalities are written before they are implemented, then implement code such that it passes the test, and then repeat
- Mongoose does not have a way to check uniqueness of a value $\rightarrow$ use uniqueness field instead:

```js
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // this ensures the uniqueness of username
  },
  ...
  })
```

  However, do notice that if there is already violation in the database, **no new notes will be created**. So the database must be in a healthy state before any addition is being performed.

##

- Testing JWT authorization with Restclient:
  - Post to /api/login and get the token
  - Add

  ```rest
  Authorization: Bearer {token}
  ```

  to Restclient below Content-Type

- Problems with token-based authorization: 
  - Once you have the token $\rightarrow$ unlimited access. How to revoke token access? 
  - Two ways:
    - 1: limit access to token

    ```js
    // controllers/login.js
    const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: 60*60 });

    // middleware.js
    ... 
    else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      })
    }
    ```

    - 2: store token in database and check if it is still valid (session-based)
  
  - **WATCH**: - <https://www.youtube.com/watch?v=fyTxwIa-1U0> 
