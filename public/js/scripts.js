document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-btn');
    const mainContent = document.getElementById('main-content');
    const loginPage = document.getElementById('login-page');
    const loginMessage = document.getElementById('login-message');

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        loginPage.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        loginPage.style.display = 'block';
        mainContent.style.display = 'none';
    }

    // Login form submission handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Validate username and password (simplified, should be more secure)
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('isLoggedIn', 'true');
            loginPage.style.display = 'none';
            mainContent.style.display = 'block';
        } else {
            loginMessage.textContent = 'Invalid username or password';
        }
    });

    // Logout button handler
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        loginPage.style.display = 'block';
        mainContent.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('category-select');
    const dueDate = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.querySelector('.task-list');

    // Retrieve tasks and completed tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    // Month and year for the calendar
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Task creation and management
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskText = taskInput.value;
            const category = categorySelect.value;
            const due = dueDate.value;
            const priority = prioritySelect.value;

            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.setAttribute('data-category', category);
            taskElement.setAttribute('data-priority', priority);
            taskElement.setAttribute('data-due', due); // Add due date as attribute
            taskElement.innerHTML = `
                <p><strong>Task:</strong> ${taskText}</p>
                <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
                <p><strong>Due:</strong> ${due}</p>
                <p><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</p>
                <button class="complete-btn">Complete</button>
                <button class="progress-btn">In Progress</button>
            `;

            taskList.appendChild(taskElement);
            tasks.push({
                text: taskText,
                category: category,
                due: due,
                priority: priority,
                status: 'pending' // Default status is pending
            });

            // Save tasks to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            taskInput.value = '';
            dueDate.value = '';

            taskElement.querySelector('.complete-btn').addEventListener('click', () => {
                taskElement.remove();
                const completedTask = tasks.find(t => t.text === taskText && t.due === due);
                completedTask.status = 'completed';
                completedTasks.push(completedTask);
                tasks = tasks.filter(t => t.text !== taskText || t.due !== due);
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
                localStorage.setItem('tasks', JSON.stringify(tasks));
                alert(`Task "${taskText}" marked as "Completed"`);
                generateCalendar(currentMonth, currentYear); // Refresh the calendar to reflect the change
            });

            taskElement.querySelector('.progress-btn').addEventListener('click', () => {
                const taskInProgress = tasks.find(t => t.text === taskText && t.due === due);
                taskInProgress.status = 'in-progress';
                alert(`Task "${taskText}" marked as "In Progress"`);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                generateCalendar(currentMonth, currentYear); // Refresh the calendar to reflect the change
            });
        });
    }

    // Calendar logic
    const calendarContainer = document.getElementById('calendar-container');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    const monthYearDisplay = document.getElementById('month-year');

    if (calendarContainer) {
        function daysInMonth(month, year) {
            return new Date(year, month + 1, 0).getDate();
        }

        function generateCalendar(month, year) {
            calendarContainer.innerHTML = ''; // Clear previous calendar
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const calendarGrid = document.createElement('div');
            calendarGrid.classList.add('calendar-grid');

            // Update month-year display
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

            // Create headers for days of the week
            daysOfWeek.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day-header');
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });

            // Determine the number of days in the month
            const firstDay = new Date(year, month).getDay();
            const numDays = daysInMonth(month, year);

            // Fill in previous month's empty days (if any)
            for (let i = 0; i < firstDay; i++) {
                const emptyDayElement = document.createElement('div');
                emptyDayElement.classList.add('calendar-day');
                calendarGrid.appendChild(emptyDayElement);
            }

            // Create calendar days for the current month
            for (let i = 1; i <= numDays; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                const dateStr = `${year}-${month + 1 < 10 ? '0' : ''}${month + 1}-${i < 10 ? '0' + i : i}`;
                dayElement.textContent = i;

                // Check for tasks on this date
                const tasksForDay = tasks.filter(task => task.due === dateStr);
                if (tasksForDay.length > 0) {
                    const taskListElement = document.createElement('ul');
                    tasksForDay.forEach(task => {
                        const taskItem = document.createElement('li');
                        taskItem.textContent = task.text;
                        taskItem.style.color = task.status === 'completed' ? 'green' : task.status === 'in-progress' ? '#ffeb3b' : '#000';
                        taskListElement.appendChild(taskItem);
                    });
                    dayElement.appendChild(taskListElement);
                }

                calendarGrid.appendChild(dayElement);
            }

            calendarContainer.appendChild(calendarGrid);
        }

        // Initialize the calendar with the current month and year
        generateCalendar(currentMonth, currentYear);

        // Handle next and previous button clicks
        prevButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11; // December
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        nextButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0; // January
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    // Render completed tasks on the Completed Tasks page
    function renderCompletedTasks() {
        const completedTaskList = document.getElementById('completed-task-list');
        completedTaskList.innerHTML = ''; // Clear the list first
        completedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = `${task.text} - Due: ${task.due}`;
            completedTaskList.appendChild(taskItem);
        });
    }

    // If we are on the Completed Tasks page, render the tasks
    if (document.getElementById('completed-task-list')) {
        renderCompletedTasks();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModal = document.getElementById('closeModal');

    // Login/Register form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');

    // Open and close modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Switch between login and register
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Registration Logic
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = registerEmail.value;
        const password = registerPassword.value;
        const confirmPwd = confirmPassword.value;

        if (password !== confirmPwd) {
            alert('Passwords do not match!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert('Email already registered. Please log in.');
            return;
        }

        users.push({ email: email, password: password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please log in.');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login Logic
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            alert('Login successful!');
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            modal.style.display = 'none'; // Close the modal
        } else {
            alert('Invalid email or password!');
        }
    });

    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('You need to log in to access this page.');
        openModalBtn.click(); // Trigger the modal to open if not logged in
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    // Load stored messages if available
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    storedMessages.forEach(message => displayMessage(message));

    // Handle message sending
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        const message = {
            sender: 'You',
            text: messageText,
            timestamp: new Date().toLocaleTimeString()
        };

        displayMessage(message);

        // Store the message in local storage
        storedMessages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(storedMessages));

        messageInput.value = ''; // Clear the input field
    });

    // Display a message in the chat
    function displayMessage(message) {
        const messageElement = document.createElement('li');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${message.sender}</strong> (${message.timestamp}): ${message.text}`;
        chatMessages.appendChild(messageElement);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
