// Initialize date and month
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");
const currdate = document.querySelector(".calendar-current-date");
const prenexIcons = document.querySelectorAll(".calendar-navigation span");

// Array of month names
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Function to generate the calendar
const manipulate = () => {
    let dayone = new Date(year, month, 1).getDay();
    let lastdate = new Date(year, month + 1, 0).getDate();
    let dayend = new Date(year, month, lastdate).getDay();
    let monthlastdate = new Date(year, month, 0).getDate();
    let calendarHTML = "";

    for (let i = dayone; i > 0; i--) {
        calendarHTML += `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    for (let i = 1; i <= lastdate; i++) {
        let isToday = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "active" : "";
        calendarHTML += `<li class="${isToday}" onclick="openModal('${year}-${month + 1}-${i}')">${i}</li>`;
    }

    for (let i = dayend; i < 6; i++) {
        calendarHTML += `<li class="inactive">${i - dayend + 1}</li>`;
    }

    currdate.innerText = `${months[month]} ${year}`;
    day.innerHTML = calendarHTML;
};

// Initial manipulation call
manipulate();

// Calendar navigation
prenexIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        if (month < 0 || month > 11) {
            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();
        } else {
            date = new Date();
        }

        manipulate();
    });
});

// Open and close modal functions
function openModal(date) {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'block';
    document.getElementById('taskForm').dataset.date = date;
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Task and calendar initialization
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    
    // Check if FullCalendar is loaded
    if (typeof FullCalendar === 'undefined') {
        console.error('FullCalendar library did not load correctly.');
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            openModal(info.dateStr);
        }
    });

    calendar.render();
    window.calendarInstance = calendar;

    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const date = taskForm.dataset.date;

            const taskList = document.getElementById('task-list'); // Ensure task-list element exists in HTML
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <p><strong>Task:</strong> ${title}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Date:</strong> ${date}</p>
                <button class="complete-btn">Complete</button>
                <button class="progress-btn">In Progress</button>
            `;
            
            taskList.appendChild(taskElement);

            // Add to FullCalendar instance
            window.calendarInstance.addEvent({
                title: title,
                start: date,
                description: description
            });

            // Button event handlers
            taskElement.querySelector('.complete-btn').addEventListener('click', () => {
                taskElement.remove();
                alert(`Task "${title}" marked as "Completed"`);
            });

            taskElement.querySelector('.progress-btn').addEventListener('click', () => {
                alert(`Task "${title}" marked as "In Progress"`);
            });

            closeModal();
            taskForm.reset();
        });
    } else {
        console.error("Form with ID 'taskForm' not found.");
    }
});

  // JavaScript for modal handling
document.querySelector('.task-modal').addEventListener('click', function() {
    document.getElementById('taskModal').style.display = 'block';
});
  
function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

  // Close modal if clicked outside
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
}