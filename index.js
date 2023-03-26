const mysql = require("mysql2");
const inquirer = require("inquirer");
const query = require("./db/queries");
const table = require("console.table");

// Connects to company database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

const askUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then(({ choice }) => {
      if (choice === "View All Departments") {
        viewDepartments();
      }
    });
};

const viewDepartments = () => {
  const query = "SELECT * FROM department;";
  db.promise()
    .query(query)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch(console.log)
    .then(() => db.end())
};

askUser();
