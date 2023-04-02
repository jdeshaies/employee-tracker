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

// Function that allows user to select what they would like to do
function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "\nWhat would you like to do?\n",
        name: "choice",
        choices: [
          "Exit Program",
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
      if (choice === "Exit Program") {
        process.exit();
      }
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
      if (choice === "Add Role") {
        addRole();
      }
      if (choice === "Add Employee") {
        addEmployee();
      }
      if (choice === "Update Employee Role") {
        updateEmployeeRole();
      }
    });
}

// Shows all departments
function viewDepartments() {
  const sql = `SELECT * FROM department;`;
  db.query(sql, (err, departments) => {
    if (err) throw err;
    console.log("\n===== DEPARTMENTS =====\n");
    console.table(departments);
    promptUser();
  });
}

// Shows all roles, the department it belongs to, and the salary
function viewRoles() {
  const sql = `SELECT role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
                FROM role 
                INNER JOIN department ON role.department_id = department.id 
                ORDER BY role.id;`;
  db.query(sql, (err, roles) => {
    if (err) throw err;
    console.log("\n===== ROLES =====\n");
    console.table(roles);
    promptUser();
  });
}

// Shows all employees, their role, department, and manager (if there is one)
function viewEmployees() {
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
  db.query(sql, (err, employees) => {
    if (err) throw err;
    console.log("\n===== EMPLOYEES =====\n");
    console.table(employees);
    promptUser();
  });
}

// Function to add a new department
function addDepartment() {
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
      });
      console.log("\nDepartment Added\n");
      promptUser();
    });
}

//Function to add a new role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "role",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "salary",
      },
    ])
    .then(({ role, salary }) => {
      const roleValues = [role, salary];
      db.query(
        "SELECT id AS value, name AS name FROM department",
        (err, departments) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departments,
              },
            ])
            .then(({ department_id }) => {
              roleValues.push(department_id);
              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
              db.query(sql, roleValues, (err, result) => {
                if (err) throw err;
              });
              console.log("\Role Added\n");
              promptUser();
            });
        }
      );
    });
}

// Function to add a new employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name",
      },
    ])
    .then(({ first_name, last_name }) => {
      const employeeValues = [first_name, last_name];
      db.query("SELECT id AS value, title AS name FROM role", (err, roles) => {
        if (err) throw err;
        inquirer
          .prompt([
            {
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then(({ role_id }) => {
            employeeValues.push(role_id);
            db.query(
              "SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee",
              (err, managers) => {
                managers.unshift({ value: null, name: "None" });
                if (err) throw err;
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "manager_id",
                      message: "Who is the employee's manager?",
                      choices: managers,
                    },
                  ])
                  .then(({ manager_id }) => {
                    employeeValues.push(manager_id);
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(sql, employeeValues, (err, result) => {
                      if (err) throw err;
                    });
                    console.log("\nEmployee Added\n");
                    promptUser();
                  });
              }
            );
          });
      });
    });
}

// Function to update the selected employee's role
function updateEmployeeRole() {
  db.query(
    "SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee",
    (err, employees) => {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Which employee's role do you want to update?",
          choices: employees,
        },
      ])
      .then(( {employee_id }) => {
        const employeeUpdateValues = [employee_id];
        db.query(
          "SELECT id AS value, title AS name FROM role",
          (err, roles) => {
            if (err) throw err;
            inquirer.prompt([
              {
                type: "list",
                name: "role_id",
                message: "Which role do you want to assign the selected employee?",
                choices: roles,
              },
            ])
            .then(( {role_id }) => {
              employeeUpdateValues.unshift(role_id);
              const sql = "UPDATE employee SET role_id=? WHERE id=?";
              db.query(sql, employeeUpdateValues, (err, result) => {
                if (err) throw err;
              });
              console.log("\nEmployee Role Updated\n");
              promptUser();
            })
          }
        )
      })
    }
  );
}

promptUser();
