document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('addTaskForm').addEventListener('submit', handleAddTask);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);

    checkAuthStatus();
});

async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful. Please login.');
            event.target.reset();
        } else {
            alert(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration.');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        if (response.ok) {
            showTaskSection();
            fetchTasks();
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
}

async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        if (response.ok) {
            showAuthSection();
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
    }
}

async function handleAddTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (response.ok) {
            fetchTasks();
            event.target.reset();
        } else {
            alert('Failed to add task. Please try again.');
        }
    } catch (error) {
        console.error('Add task error:', error);
        alert('An error occurred while adding the task.');
    }
}

async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else if (response.status === 401) {
            // Unauthorized, user needs to login again
            showAuthSection();
        } else {
            throw new Error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Fetch tasks error:', error);
        alert('An error occurred while fetching tasks.');
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
            <p>Priority: ${task.priority}</p>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(taskElement);
    });
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTasks();
        } else if (response.status === 401) {
            // Unauthorized, user needs to login again
            showAuthSection();
        } else {
            alert('Failed to delete task. Please try again.');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        alert('An error occurred while deleting the task.');
    }
}

function showTaskSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('taskSection').style.display = 'block';
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
}

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
            showTaskSection();
            fetchTasks();
        } else {
            showAuthSection();
        }
    } catch (error) {
        console.error('Auth status check error:', error);
        showAuthSection();
    }
}

