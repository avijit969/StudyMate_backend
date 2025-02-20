# StudyMate API Documentation

This is the API documentation for the StudyMate website.

## Endpoints

### Users

| Method | Endpoint   | Description       |
| ------ | ---------- | ----------------- |
| GET    | /users     | Get all users     |
| POST   | /users     | Create a new user |
| GET    | /users/:id | Get a single user |
| PUT    | /users/:id | Update a user     |
| DELETE | /users/:id | Delete a user     |

### Courses

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | /courses     | Get all courses     |
| POST   | /courses     | Create a new course |
| GET    | /courses/:id | Get a single course |
| PUT    | /courses/:id | Update a course     |
| DELETE | /courses/:id | Delete a course     |

### Assignments

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | /assignments     | Get all assignments     |
| POST   | /assignments     | Create a new assignment |
| GET    | /assignments/:id | Get a single assignment |
| PUT    | /assignments/:id | Update an assignment    |
| DELETE | /assignments/:id | Delete an assignment    |

## Authentication

Authentication is required for all endpoints except `/users` and `/users/:id`. You can authenticate using the `Authorization` header with the format `Bearer <token>`.

## Errors

| Code | Description           |
| ---- | --------------------- |
| 400  | Bad request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not found             |
| 500  | Internal server error |

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## Contact

If you have any questions or feedback, please contact [email](abhijitpradhan909@gmail.com).
