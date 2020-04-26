# Pubquiz websocket application

This application was made as an assignment for the HAN Hogeschool van Arnhem en Nijmegen in 2019. It's a pubquiz application that uses an Express-based REST API and a minimalistic React frontend. It uses the WebSocket architecture to add near-real-time functionality to the app. MongoDB is used for data storage and session recovery.

## How it works

A "quizmaster" can create a new room by supplying a room name and password. Pubquiz attendees can then join this quiz using a randomly generated room id and the password the quizmaster set. The quizmaster can then choose a few categories, start the round and select a fun question for the contestants to answer. The Quizzer contestants use their cell phones while the quizmaster uses a tablet. The interface is tailored to that usage, but still somewhat responsive.

![image](https://user-images.githubusercontent.com/24809068/74977428-f7bdeb80-542a-11ea-9fe8-e1026bd26457.png)
![image](https://user-images.githubusercontent.com/24809068/74977588-44a1c200-542b-11ea-9d86-0704172802a8.png)
![image](https://user-images.githubusercontent.com/24809068/74977492-18864100-542b-11ea-816c-34b4ed7ee946.png)
![image](https://user-images.githubusercontent.com/24809068/74977547-30f65b80-542b-11ea-8ac5-caf7e6e988be.png)
