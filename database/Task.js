const pool = require('./db'); // Import the database pool
const crypto = require('crypto'); // Use crypto for hashing

// Helper function to hash using MD5 and hexadecimal encoding
function hashMD5(value) {
    return crypto.createHash('md5').update(value).digest('hex');
}

// Task class to manage tasks
class Task {
    constructor(task_id, user_id, title, description, status = 'pending', start_time, end_time, due_date, priority, location) {
        this.task_id = task_id;
        this.user_id = user_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.start_time = start_time;
        this.end_time = end_time;
        this.due_date = due_date;
        this.priority = priority;
        this.location = location;
    }

    // Add a new task
    async addTask() {
        try {
            const hashedTitle = hashMD5(this.title); // Hash the task title

            // Check if a task with this title already exists for the user
            const existingTask = await pool.query(
                'SELECT * FROM tasks WHERE title_hash = $1 AND user_id = $2',
                [hashedTitle, this.user_id]
            );

            if (existingTask.rows.length > 0) {
                throw new Error('Task with this title already exists for this user.');
            }

            // Insert the new task
            const result = await pool.query(
                `INSERT INTO tasks (user_id, title, description, status, start_time, end_time, due_date, priority, location, title_hash) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                [this.user_id, this.title, this.description, this.status, this.start_time, this.end_time, this.due_date, this.priority, this.location, hashedTitle]
            );
            this.task_id = result.rows[0].task_id;
            return result.rows[0];
        } catch (err) {
            console.error('Error adding task:', err);
            throw err;
        }
    }

    // Update an existing task
    async updateTask() {
        try {
            const result = await pool.query(
                `UPDATE tasks 
                 SET title = $1, description = $2, status = $3, start_time = $4, end_time = $5, due_date = $6, priority = $7, location = $8 
                 WHERE task_id = $9 RETURNING *`,
                [this.title, this.description, this.status, this.start_time, this.end_time, this.due_date, this.priority, this.location, this.task_id]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Error updating task:', err);
            throw err;
        }
    }

    // Delete a task by task_id
    static async deleteTask(task_id) {
        try {
            const result = await pool.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [task_id]);
            return result.rows[0];
        } catch (err) {
            console.error('Error deleting task:', err);
            throw err;
        }
    }

    // Retrieve all tasks with tags for a specific user
    static async getAllTasksWithTagsByUser(user_id) {
        try {
            const result = await pool.query(
                `SELECT t.task_id, t.title, t.description, t.status, t.start_time, t.end_time, t.due_date, t.priority, t.location, tt.tag_id, tg.tag_name
                 FROM tasks t
                 LEFT JOIN task_tags tt ON t.task_id = tt.task_id
                 LEFT JOIN tags tg ON tt.tag_id = tg.tag_id
                 WHERE t.user_id = $1`,
                [user_id]
            );
            return result.rows;
        } catch (err) {
            console.error('Error retrieving tasks with tags:', err);
            throw err;
        }
    }
}

module.exports = Task; // Export the Task class


