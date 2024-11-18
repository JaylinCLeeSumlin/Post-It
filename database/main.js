// main.js
const User = require('./User'); // Adjust the path as necessary
const Task = require('./Task'); // Adjust the path as necessary
const pool = require('./db');

async function exampleUsage() {
    try {
        const user = new User(null, 'johndoe3@example.com', 'securepassword123');
        const newUser = await user.addUser();
        console.log('User added:', newUser);

        const task = new Task(
            null,
            newUser.user_id,
            'Complete report',
            'Finish the monthly report',
            'pending',
            '2024-10-26 09:00:00',
            '2024-10-26 11:00:00',
            '2024-10-26',
            2,
            'Office'
        );
        const newTask = await task.addTask();
        console.log('Task added:', newTask);

    } catch (err) {
        console.error('Error in example usage:', err);
    }
}

exampleUsage();
