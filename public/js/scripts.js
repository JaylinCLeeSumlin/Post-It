document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Section ---
    const modal = document.getElementById('authModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModal = document.getElementById('closeModal');

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

    // Open and Close Modal
    if (openModalBtn && closeModal) {
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });
    }

    // Switch between Login and Register
    goToRegister?.addEventListener('click', (e) => {
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
        if (registerPassword.value !== confirmPassword.value) {
            alert('Passwords do not match!');
            return;
        }
        localStorage.setItem('user', JSON.stringify({ email: registerEmail.value, password: registerPassword.value }));
        alert('Registration successful!');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login Logic
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email === loginEmail.value && user.password === loginPassword.value) {
            alert('Login successful!');
            localStorage.setItem('isLoggedIn', 'true');
            location.reload();
        } else {
            alert('Invalid credentials!');
        }
    });

    // --- Task Management ---
    const taskForm = document.getElementById('task-form');
    const taskList = document.querySelector('.task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <p><strong>${task.title}</strong> - ${task.status}</p>
                <p>${task.description}</p>
                <button onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(taskElement);
        });
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    taskForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskTitle = document.getElementById('task-title').value;
        const taskDesc = document.getElementById('task-desc').value;

        tasks.push({ title: taskTitle, description: taskDesc, status: 'Pending' });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });

    renderTasks();

    // --- Password Strength Validation ---
    const passwordInput = document.getElementById('password');
    const strengthOutput = document.getElementById('passwordStrength');

    passwordInput?.addEventListener('input', () => {
        const value = passwordInput.value;
        const strength = calculatePasswordStrength(value);
        strengthOutput.textContent = `Strength: ${strength}`;
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[\W]/.test(password)) score++;
        return ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score] || 'Weak';
    }

    // --- Calendar ---
    const calendar = document.getElementById('calendar');
    const date = new Date();
    if (calendar) renderCalendar();

    function renderCalendar() {
        calendar.innerHTML = '';
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        }
    }

    // --- Chat Section ---
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    const renderMessages = () => {
        chatMessages.innerHTML = '';
        messages.forEach(msg => {
            const msgElement = document.createElement('li');
            msgElement.textContent = `${msg.sender}: ${msg.text}`;
            chatMessages.appendChild(msgElement);
        });
    };

    messageForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        const message = { sender: 'You', text };
        messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        renderMessages();
        messageInput.value = '';
    });

    renderMessages();
});


$(document).ready(function() {
    $('#Submit').click(function(e) {
        e.preventDefault();

        const taskDate = $('#taskDate').val();
        const taskDescription= $('#taskDescription').val();
        const taskPriority = $('#taskPriority').val();
        const taskTitle = $('#taskTitle').val();

        $.ajax({
            url: '/dashboard',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title:taskTitle, date:taskDate, description:taskDescription,priority:taskPriority }),
            success: function(response) {
                alert('Task added successfully!');

                $('#reminderList').append('<li> ${response.title} - ${response.description} (${response.date}, %{response.priority}) </li> ');
            },
            error:function(error){
                console.error('Error,error')
                alert('failed to add task: please try again')
            }

        });
    });
  });