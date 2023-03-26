const mysql = require("mysql2");
const inquirer = require("inquirer");
// const query = require("./db/queries");
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
      if (choice === "View All Roles") {
        viewRoles();
      }
      if (choice === "View All Employees") {
        viewEmployees();
      }
      if (choice === "Add Department") {
        addDepartment();
      }
    });
};

const viewDepartments = () => {
  const sql = `SELECT * FROM department;`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch(console.log)
    .then(() => db.end());
};

const viewRoles = () => {
  const sql = `SELECT role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
                FROM role 
                INNER JOIN department ON role.department_id = department.id 
                ORDER BY role.id;`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch(console.log)
    .then(() => db.end());
};

const viewEmployees = () => {
  const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title,
                department.name AS department, 
                role.salary, 
                CONCAT(manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch(console.log)
    .then(() => db.end());
};

const addDepartment = () => {
    inquirer
    .prompt({
        type: "input",
        message: "What is the name of the department?",
        name: "department",
    })
    .then(({ department }) => {
        const sql = `INSERT INTO department (name) 
                    VALUES (?)`;
        db.query(sql, department, (err, result) => {
            if (err) throw err;
          })
    })
}

askUser();
