document.addEventListener("DOMContentLoaded", function() {
    const API_URL = "http://localhost:3000";
  
    // Handle registration form submission
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const first_name = document.getElementById("first_name").value;
        const last_name = document.getElementById("last_name").value;
        const phone = document.getElementById("phone").value;
  
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, first_name, last_name, phone })
        });
  
        if (response.ok) {
          alert("Registration successful!");
          window.location.href = "login.html";
        } else {
          alert("Registration failed!");
        }
      });
    }
  
    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          alert("Login successful!");
          window.location.href = "messages.html";
        } else {
          alert("Login failed!");
        }
      });
    }
  
    // Fetch and display messages
    const messagesDiv = document.getElementById("messages");
    if (messagesDiv) {
      fetchMessages();
    }
  
    async function fetchMessages() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view messages.");
        window.location.href = "login.html";
        return;
      }
  
      const response = await fetch(`${API_URL}/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
  
      if (response.ok) {
        const data = await response.json();
        messagesDiv.innerHTML = "";
        data.messages.forEach(message => {
          const messageDiv = document.createElement("div");
          messageDiv.innerHTML = `<b>From:</b> ${message.from_user.username}<br><b>To:</b> ${message.to_user.username}<br><b>Message:</b> ${message.body}`;
          messagesDiv.appendChild(messageDiv);
        });
      } else {
        alert("Failed to fetch messages.");
      }
    }
  
    // Fetch users and handle new message form submission
    const newMessageForm = document.getElementById("newMessageForm");
    if (newMessageForm) {
      fetchUsers();
      newMessageForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const to_user = document.getElementById("to_user").value;
        const body = document.getElementById("body").value;
        const token = localStorage.getItem("token");
  
        const response = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ to_user, body })
        });
  
        if (response.ok) {
          alert("Message sent!");
          window.location.href = "messages.html";
        } else {
          alert("Failed to send message.");
        }
      });
    }
  
    async function fetchUsers() {
      const response = await fetch(`${API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        const toUserSelect = document.getElementById("to_user");
        data.users.forEach(user => {
          const option = document.createElement("option");
          option.value = user.username;
          option.textContent = user.username;
          toUserSelect.appendChild(option);
        });
      } else {
        alert("Failed to fetch users.");
      }
    }
  });
  