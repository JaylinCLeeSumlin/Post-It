// Global Variables
let events = []; // Array to store events
let eventIdCounter = 1;

// Input References
const eventDateInput = document.getElementById("taskDate");
const eventTitleInput = document.getElementById("taskTitle");
const eventDescriptionInput = document.getElementById("taskDescription");
const taskForm = document.getElementById("taskForm");
const reminderList = document.getElementById("reminderList");

// Date Variables
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Calendar Initialization
let calendar;
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Calendar
    const calendarEl = document.getElementById("calendar");
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        editable: true,
        selectable: true,
        events: loadEventsFromStorage(), // Load events from localStorage
    });
    calendar.render();

    // Modal Handling
    const modal = document.getElementById("taskModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    openModalBtn.addEventListener("click", () => modal.style.display = "block");
    closeModalBtn.addEventListener("click", () => modal.style.display = "none");
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = "none";
    };

    // Handle Form Submission
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Fetch input values
        const title = eventTitleInput.value.trim();
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();

        if (title && date) {
            // Add event to calendar
            calendar.addEvent({
                title: `${title} - ${description}`,
                start: date,
                allDay: true,
                id: eventIdCounter++,
            });

            // Update global events array
            events.push({ id: eventIdCounter, date, title, description });
            saveEventsToStorage();

            // Clear form and close modal
            taskForm.reset();
            modal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modal = document.getElementById("taskModal");

    // Open Modal
    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close Modal
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal if user clicks outside of modal content
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Form Submission
    document.getElementById("taskForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("taskTitle").value;
        const date = document.getElementById("taskDate").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;

        if (title && date && description) {
            console.log("New Task:", { title, date, description, priority });
            alert("Task Created Successfully!");

            // Close modal after submission
            modal.style.display = "none";
            document.getElementById("taskForm").reset(); // Reset form fields
        } else {
            alert("Please fill in all required fields.");
        }
    });
});

// Save Events to Local Storage
function saveEventsToStorage() {
    localStorage.setItem("events", JSON.stringify(events));
}

// Load Events from Local Storage
function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        return events.map(event => ({
            id: event.id,
            title: `${event.title} - ${event.description}`,
            start: event.date,
            allDay: true
        }));
    }
    return [];
}

// Clear Form Inputs
function clearFormInputs() {
    taskForm.reset();
}




// Function to add events
function addEvent() {
	let date = eventDateInput.value;
	let title = eventTitleInput.value;
	let description = eventDescriptionInput.value;

	if (date && title) {
		// Create a unique event ID
		let eventId = eventIdCounter++;

		events.push(
			{
				id: eventId, date: date,
				title: title,
				description: description
			}
		);
		showCalendar(currentMonth, currentYear);
		eventDateInput.value = "";
		eventTitleInput.value = "";
		eventDescriptionInput.value = "";
		displayReminders();
	}
}

// Function to delete an event by ID
function deleteEvent(eventId) {
	// Find the index of the event with the given ID
	let eventIndex =
		events.findIndex((event) =>
			event.id === eventId);

	if (eventIndex !== -1) {
		// Remove the event from the events array
		events.splice(eventIndex, 1);
		showCalendar(currentMonth, currentYear);
		displayReminders();
	}
}

// Function to display reminders
function displayReminders() {
	reminderList.innerHTML = "";
	for (let i = 0; i < events.length; i++) {
		let event = events[i];
		let eventDate = new Date(event.date);
		if (eventDate.getMonth() ===
			currentMonth &&
			eventDate.getFullYear() ===
			currentYear) {
			let listItem = document.createElement("li");
			listItem.innerHTML =
				`<strong>${event.title}</strong> - 
			${event.description} on 
			${eventDate.toLocaleDateString()}`;

			// Add a delete button for each reminder item
			let deleteButton =
				document.createElement("button");
			deleteButton.className = "delete-event";
			deleteButton.textContent = "Delete";
			deleteButton.onclick = function () {
				deleteEvent(event.id);
			};

			listItem.appendChild(deleteButton);
			reminderList.appendChild(listItem);
		}
	}
}
$(document).ready(function () {
    $("#taskForm").on("submit", function (e) {
        e.preventDefault();

        const title = $("#taskTitle").val();
        const description = $("#taskDescription").val();
        const date = $("#taskDate").val();
        const priority =$("taskPriority").val();

        if (!title || !description || !date ||!priority) {
            alert("Please fill in all fields.");
            return;
        }

        // Send task details to the backend
        $.ajax({
            url: "/addTask",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                title: title,
                description: description,
                date: date,
                status: "Pending", // Default status
                priority:priority,
            }),
            success: function (response) {
                alert(response.message);
                window.location.href = "/dashboard"; // Redirect to dashboard after adding task
            },
            error: function (err) {
                console.error("Error adding task:", err);
                alert("Failed to add task. Try again.");
            },
        });
    });
});