# 📊 Finance Tracker

A full stack finance tracker application built with **React** and **Spring Boot**. Spring Boot manages user requests and data storage in a **PostgreSQL** database using **Spring JPA ORM**.

## 📦 Technologies

- `Vite`
- `React.js`
- `TypeScript`
- `Java`
- `Maven`
- `Spring Boot`
- `Spring JPA`
- `PostgreSQL`
- `ShadCN`

## 🚀 Features

This application includes:

- **Auth**: Uses Spring Security for storing user credentials, Bcrypt for encryption, and JWTokens for session management.
- **Bank Accounts**: Tracks user balances across accounts.
- **Financial Management**: Handles expenses, incomes, and investments with a detailed dashboard for net worth progression.

## 📚 Learnings

Key insights gained from this project:

### Spring Boot Development Cycle

- Built my first comprehensive Spring Boot application.

### Spring JPA

- Gained familiarity with Spring JPA for database interactions.

### Spring Security

- Implemented an auth system using Spring Security independently.

### Component Reusability

- Employed techniques to minimize code duplication on the front end.

### Error and Response Handling

- Enhanced understanding of Java's exception handling for richer notifications.

## 💡 Improvements

Potential enhancements:

- Make the app responsive.
- Add CSV data import for users.
- Implement real-time investment tracking.

## 🚦 Running the Project

To set up locally:

0. **Configure .env file**:
   ```
   DB_USERNAME=username
   DB_PASSWORD=password
   JWT_SECRET=jwt_secret
   ```
1. Clone the repository to your local machine.
2. Execute `.mvn clean install` to install backend dependencies.
3. Run `cd ./frontend && npm install` to set up frontend dependencies.
4. Start the backend with `mvn spring-boot:run` and the frontend with `cd ./frontend && npm run dev`.
5. Open [http://localhost:5173](http://localhost:5173) in your web browser to view the app.

## 🎥 Video

Watch a demonstration here: [Video](https://youtu.be/8If4jhFIqis)
