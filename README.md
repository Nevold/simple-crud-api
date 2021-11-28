# Usage SIMPLE CRUD API

# Install dependencies

git clone https://github.com/Nevold/simple-crud-api.git
go to folder simple-crud-api
npm install

# Run in develpment

npm run start:dev

# Run in production

npm run start:prod

# How to use the app

For use, try for example Postman.

1. The server runs on port 3000 by default. You can change it in the file .env
2. API path `/person`:
   - **GET** `/person` or `/person/${personId}` should return all persons or person with corresponding `personId`
   - **POST** `/person` is used to create record about new person and store it in database
   - **PUT** `/person/${personId}` is used to update record about existing person
   - **DELETE** `/person/${personId}` is used to delete record about existing person from database

# Example

1. `http://localhost:3000/person` or `http://localhost:3000/person/8af2be1c-a69e-4876-bed3-ad94df2ceb21` and choose the method "GET" to get data
2. `{ "name": "Andy", "age": 20, "hobbies": ["fishing", "hunter"] }` and choose the method "POST" to create new person
3. `http://localhost:3000/person/8af2be1c-a69e-4876-bed3-ad94df2ceb21` change the `"name": "Andy"` on `"name": "Mike"` and choose the method "PUT" for update current person
4. `http://localhost:3000/person/8af2be1c-a69e-4876-bed3-ad94df2ceb21` and choose the method "DELETE" to remove the current person
