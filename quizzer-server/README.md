# Quizzer Server

The quizzer server can host multiple Quizzer rooms at once. It includes an easy-to-use REST API for accessing the mongodb database. Quizzer server uses the WebSocket architecture to make the application real-time.

## Installation
To run the server, copy the files to your server and run `npm install` in the install directory.

To run the server, just run `node server.js`. The default configuration looks for a Mongo server running on `127.0.0.1:27017`.

## API
The Quizzer API runs on the `/quizzer` resource. All API routes are described below. The routes used by the Quizmaster can be found in `./routes/quizmaster.js`, routes used by teams live in `./routes/teams.js`

| Client     | Method | Route                                    | Request                 | Response                                                       | Information                                                             |
|------------|--------|------------------------------------------|-------------------------|----------------------------------------------------------------|-------------------------------------------------------------------------|
| Any        | GET    | /                                        | -                       | `{ gamestate }`                                                | If the client already has a session, give him the gamestate |
| Quizmaster | POST   | /rooms                                   | -                       | `{ success: 'Created room succesfully', number }`              | Creates a new room and authenticates the user as quizmaster. |
| Quizmaster | DELETE | /rooms/:roomid                           | -                       | `{ success: 'Deleted room succesfully' }`                      | Deletes the specified room |
| Quizmaster | PATCH  | /rooms/:roomid                           | `{ property: value }`   | `{ success: 'Updated room data succesfully', property: value}` | Allows the quizmaster to update the room data, like the current round |
| Quizmaster | GET    | /rooms/:roomid/teams                     | -                       | `{ [teams] }`                                                  | This gives the quizmaster all teams in his room to update the team list |
| Quizmaster | POST   | /rooms/:roomid/rounds                    | -                       | `{ success: 'Created new round succesfully' }`                 | Starts a new round |
| Quizmaster | PATCH  | /rooms/:roomid/rounds/current/categories | `{ categories: [cats]}` | `{ success: 'Changed round categories', [categories] }`        | Changes the current round's categories |
| Quizmaster | GET    | /categories                              | -                       | `{ categories }`                                               | Returns all categories from the questions collection |
| Quizmaster | GET    | /questions/random?count={count}          | `{ categories }`        | `{ questions }`                                                | Returns {count} random questions with the given categories | 
| Team       | POST   | /rooms/:roomid/teams                     | `{ password }`          | `{ success: 'Authenticated succesfully', roomname, teamid}`    | Allows the team to 'log in' to the room and creates a new (empty) team in the database |
| Team       | PATCH  | /rooms/:roomid/teams/:teamid             | `{ name }`              | `{ success: 'Changed name succesfully', name}`                 | Changes the team name to the specified name in the database to the quizmaster can approve/deny |
