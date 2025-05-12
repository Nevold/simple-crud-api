# Usage SIMPLE CRUD API

# Install dependencies

- git clone https://github.com/Nevold/crud-api.git
- go to folder develop
- npm install

# Run in development

npm run start:dev

# Run in production

npm run start:prod

# Run multiple instances

npm run start:multi

# Run tests

npm run test

# How to use the app

For use, try for example Postman.

1. The server runs on port 4000 by default. You can change it in the file .env
2. API path `/users`:
   - **GET** `/users` or `/users/${userId}` should return all users or user with corresponding `userId`
   - **POST** `/users` is used to create record about new user and store it in database
   - **PUT** `/users/${userId}` is used to update record about existing user
   - **DELETE** `/users/${userId}` is used to delete record about existing user from database

# Example

1. `http://localhost:4000/users` or `http://localhost:4000/users/8af2be1c-a69e-4876-bed3-ad94df2ceb21` and choose the method "GET" to get data
2. `{ "name": "Andy", "age": 20, "hobbies": ["fishing", "hunter"] }` and choose the method "POST" to create new user
3. `http://localhost:4000/users/8af2be1c-a69e-4876-bed3-ad94df2ceb21` change the `"name": "Andy"` on `"name": "Mike"` and choose the method "PUT" for update current user
4. `http://localhost:4000/users/8af2be1c-a69e-4876-bed3-ad94df2ceb21` and choose the method "DELETE" to remove the current user
