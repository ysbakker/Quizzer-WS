# Quizzer Server

The quizzer server can host multiple Quizzer rooms at once. It includes an easy-to-use REST API for accessing the mongodb database. Quizzer server uses the WebSocket architecture to make the application real-time.

## Installation
To run the server, copy the files to your server and run `npm install` in the install directory.

To run the server, just run `node server.js`. The default configuration looks for a Mongo server running on `127.0.0.1:27017`.
To populate the 'Questions' collection, run `node /questions/insert.js`, the `questions.json` file contains example data. The application expects this data structure.

## API
The Quizzer API runs on the `/quizzer` resource. All API routes are described below. The routes used by the Quizmaster can be found in `./routes/quizmaster.js`, routes used by teams live in `./routes/teams.js`

| Client     | Method | Route                           | Request                          | Response                                                        | Information                                                                                    |
| ---------- | ------ | ------------------------------- | -------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Any        | GET    | /session                        | -                                | `{ gamestate }`                                                 | Returns the game state based on the session                                                    |
| Any        | GET    | /categories                     | -                                | `{ categories }`                                                | Returns all categories from the questions collection                                           |
| Any        | POST   | /rooms/:roomid/teams            | `{ password }`                   | `{ success: 'Authenticated succesfully', roomname, teamid}`     | Allows the team to 'log in' to the room and creates a new (empty) team in the database         |
| Quizmaster | GET    | /questions/random?count={count} | -                                | `{ questions }`                                                 | Returns {count} random questions with the given categories                                     |
| Quizmaster | POST   | /rooms                          | -                                | `{ success: 'Created room succesfully', number }`               | Creates a new room and authenticates the user as quizmaster.                                   |
| Quizmaster | DELETE | /rooms/:roomid                  | -                                | `{ success: 'Deleted room succesfully' }`                       | Deletes the specified room                                                                     |
| Quizmaster | PATCH  | /rooms/:roomid                  | `{ property: value }`            | `{ success: 'Updated room data succesfully', property: value}`  | Allows the quizmaster to update the room data, like the current round                          |
| Quizmaster | GET    | /rooms/:roomid/teams            | -                                | `{ [teams] }`                                                   | This gives the quizmaster all teams in his room to update the team list                        |
| Quizmaster | PUT    | /rooms/:roomid/round            | -                                | `{ success: 'Created new round succesfully' }`                  | Starts a new round and calculates points for previous rounds                                   |
| Quizmaster | PUT    | /rooms/:roomid/round/categories | `{ categories }`                 | `{ success: 'Changed round categories', [categories] }`         | Changes the current round's categories                                                         |
| Quizmaster | PUT    | /rooms/:roomid/round/question   | `{ questionid }`                 | `{ success: 'Started new question succesfully', questiondata }` | Starts a new question                                                                          |
| Quizmaster | PATCH  | /rooms/:roomid/round/score      | `{ [{team, questionsCorrect}] }` | `{ success: 'Updated score succesfully' }`                      | Updates the round score based on relative amount of correct questions                          |
| Team       | PATCH  | /rooms/:roomid/teams/:teamid    | `{ name }`                       | `{ success: 'Changed name succesfully', name }`                 | Changes the team name to the specified name in the database to the quizmaster can approve/deny |
| Team       | PATCH  | /rooms/:roomid/round/answers    | `{ answer }`                     | `{ success: 'Submitted answer succesfully' }`                   | Lets a team submit an answer to the current question                                           |
