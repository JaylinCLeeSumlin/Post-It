const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'postit',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});

pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("Connection error", err.stack));

// Correctly using 'async' instead of 'sync'
async function addUser(name, email, password) {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [name, email, password];

    try {
        const res = await pool.query(query, values);
        console.log("User added:", res.rows[0]);
        return res.rows[0].user_id;  // Get the newly inserted user_id
    } catch (err) {
        console.error("Error inserting user", err.stack);
    }
}

// Example usage
//addUser('John Doe', 'john@gmail.com').then(usr_id => {
    //console.log("New user ID:", usr_id);  // Log the newly created user ID
//}).catch(err => {
    //console.error("Error in addUser:", err);
//});

async function addTask(user_id, title, due_date, start_time, end_time, description, priority, location, status) {
    const query = `
        INSERT INTO tasks (user_id, title, due_date, start_time, end_time, description, priority, location, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const values = [user_id, title, due_date, start_time, end_time, description, priority, location, status];

    try {
        const res = await pool.query(query, values);
        console.log("Task added:", res.rows[0]);
    } catch (err) {
        console.error("Error inserting task", err.stack);
    }
}

// Example usage
// addTask(1, 'Complete report', '2024-10-10', '09:00', '11:00', 'Finish the monthly report', 2, 'Office', 'pending');

async function getTasksByUser(user_id) {
    const query = `
        SELECT * FROM tasks WHERE user_id = $1;
    `;

    try {
        const res = await pool.query(query, [user_id]);
        console.log("Tasks:", res.rows);
        return res.rows;
    } catch (err) {
        console.error("Error retrieving tasks", err.stack);
    }
}

// Example usage
// getTasksByUser(1);

async function updateTaskStatus(task_id, new_status) {
    const query = `
        UPDATE tasks
        SET status = $1
        WHERE task_id = $2
        RETURNING *;
    `;
    const values = [new_status, task_id];

    try {
        const res = await pool.query(query, values);
        console.log("Updated task:", res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error("Error updating task", err.stack);
    }
}

// Example usage
// updateTaskStatus(1, 'completed');

async function deleteTask(task_id) {
    const query = `
        DELETE FROM tasks
        WHERE task_id = $1
        RETURNING *;
    `;

    try {
        const res = await pool.query(query, [task_id]);
        console.log("Deleted task:", res.rows[0]);
    } catch (err) {
        console.error("Error deleting task", err.stack);
    }
}

module.exports = {
    addUser,
    addTask,
    getTasksByUser,
    updateTaskStatus,
    deleteTask
}

// Example usage
// deleteTask(1);
