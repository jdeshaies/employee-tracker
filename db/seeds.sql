INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Roseanna", "Santos", 1, null),
       ("Rico", "Dean", 2, 1),
       ("Santiago", "Walton", 3, null),
       ("Keane", "Bridges", 4, 3),
       ("Francis", "Davidson", 5, null),
       ("Lily-Rose", "Carter", 6, 5),
       ("Laila", "Ibarra", 7, null),
       ("Annabel", "Pittman", 8, 7);