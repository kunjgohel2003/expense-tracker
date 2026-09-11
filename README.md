# Expense Tracker

A simple and interactive **Expense Tracker** web application built using **HTML, CSS, and Vanilla JavaScript**. The application allows users to add, view, manage, and store their daily expenses using a local JSON API powered by `json-server`.

## Features

- Add new expenses
- Enter expense title and amount
- Select expense category
- Select expense date
- View recent expenses
- Calculate total spending
- Edit existing expenses
- Delete expenses
- Store expense data in `db.json`
- Use API requests with `fetch()`
- Asynchronous operations using `async/await`
- Responsive and interactive user interface
- Dark mode styling
- Separate JavaScript files for application and API functionality

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API
- Async/Await
- JSON
- JSON Server
- Git & GitHub

## Project Structure

```text
Expense-Tracker/
│
├── .vscode/
│   └── settings.json
│
├── css/
│   └── styles.css
│
├── js/
│   ├── api.js
│   └── app.js
│
├── db.json
├── index.html
└── README.md
```

## How the Application Works

The application uses `json-server` to create a local REST API from the `db.json` file.

The JavaScript application communicates with the API using the Fetch API.

### GET

Retrieves all stored expenses.

```text
GET http://localhost:3000/expenses
```

### POST

Creates a new expense.

```text
POST http://localhost:3000/expenses
```

### PUT

Updates an existing expense.

```text
PUT http://localhost:3000/expenses/:id
```

### DELETE

Deletes an expense.

```text
DELETE http://localhost:3000/expenses/:id
```

## Installation

Clone the repository:

```bash
git clone https://github.com/kunjgohel2003/Expense-Tracker.git
```

Move into the project directory:

```bash
cd Expense-Tracker
```

Install JSON Server if it is not already installed:

```bash
npm install -g json-server
```

## Run the API Server

Start the JSON Server:

```bash
npx json-server --watch db.json --port 3000
```

The API will be available at:

```text
http://localhost:3000/expenses
```

## Run the Application

After starting JSON Server, open `index.html` in your browser.

You can also use the **Live Server** extension in VS Code for a better development experience.

## API File

The `js/api.js` file contains the functions responsible for communicating with the backend API.

It handles:

- Fetching expenses
- Creating expenses
- Updating expenses
- Deleting expenses

This keeps API-related code separate from the main application logic.

## JavaScript Concepts Used

This project was created to practice important JavaScript concepts including:

- Variables
- Functions
- Arrays and Objects
- Array methods
- DOM manipulation
- Events
- Form handling
- Validation
- Fetch API
- Promises
- Async/Await
- Try/Catch
- JSON
- CRUD operations
- Git branching and commits

## CRUD Operations

The application follows the basic CRUD pattern:

| Operation | HTTP Method | Purpose |
|---|---|---|
| Create | POST | Add an expense |
| Read | GET | Display expenses |
| Update | PUT | Edit an expense |
| Delete | DELETE | Remove an expense |

## Git Workflow

The project uses Git for version control.

Example workflow:

```bash
git status
git add .
git commit -m "Your commit message"
git push
```

Feature branches are used to keep different features organized.

## Future Improvements

Possible improvements for the project include:

- User authentication
- Monthly expense reports
- Expense charts and graphs
- Advanced filtering
- Search functionality
- Export expenses to CSV
- Cloud database integration
- Better mobile responsiveness

## Author

**Kunj Gohel**

GitHub: https://github.com/kunjgohel2003
