// Import our custom CSS
// import "../css/styles.css";

// Import only the Bootstrap components we need
// import { Popover } from "bootstrap";

import { initializeWebSocket } from "./myWebSocket.js";

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
  new Popover(popover);
});

//CHANGE THE PAGE
document.addEventListener("DOMContentLoaded", (event) => {
  initializeWebSocket();
  
  const loginButton = document.getElementById("loginButton");

  if (loginButton) {
    loginButton.addEventListener("click", function () {
      //check if the user is named "admin" and the password is "admin"
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username !== "admin" || password !== "admin") {
        alert("Invalid credentials");
        return;
      }
      window.location.href = "local_menu.html";
    });
  }
});

// document.getElementById('avatarUpload').addEventListener('change', function (event) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       const img = document.getElementById('avatarPreview');
//       img.src = e.target.result;
//       img.style.display = 'block';
//     };
//     reader.readAsDataURL(file);
//   }
// });

// document.getElementById('saveSettings').addEventListener('click', function () {
//   const img = document.getElementById('avatarPreview');
//   if (img.src) {
//     const canvas = document.getElementById('avatarCanvas');
//     const ctx = canvas.getContext('2d');
//     const avatar = new Image();
//     console.log(img.src);
//     avatar.src = img.src;
//     avatar.onload = function () {
//       // Clear the canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       // Draw the avatar on the canvas next to the player name
//       ctx.drawImage(avatar, 10, 10, 50, 50); // Adjust position and size as needed
//       ctx.fillStyle = 'white';
//       ctx.font = '20px Arial';
//       ctx.fillText('Player 1', 70, 40); // Adjust position as needed
//     };
//   }
//   //change player info card with new avatar
//   const player = document.getElementById('playerAvatar');
//   player.style.display = 'none';
  

// });


// document.getElementById('modal-content').addEventListener('click', function (event) {
//   event.stopPropagation();
// });
