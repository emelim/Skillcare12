// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJyk-MqHFNMFJjZI7bBmBkGr3U4Tx15l8",
    authDomain: "my-inspiration-20bb0.firebaseapp.com",
    projectId: "my-inspiration-20bb0",
    storageBucket: "my-inspiration-20bb0.appspot.com",
    messagingSenderId: "299042550877",
    appId: "1:299042550877:web:7fc146ab7dd78473fe89b4",
    measurementId: "G-D0LY11JJL8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let allVideos = [];

// Toggle between Register and Login Forms
function toggleForms() {
    document.getElementById('register-section').style.display =
        document.getElementById('register-section').style.display === 'none' ? 'block' : 'none';
    document.getElementById('login-section').style.display =
        document.getElementById('login-section').style.display === 'none' ? 'block' : 'none';
}

// Register User
function registerUser() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("Registration successful!");
            loadVideos();
        })
        .catch(error => alert(error.message));
}

// Login User
function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            loadVideos();
        })
        .catch(error => alert(error.message));
}

// Load Videos from Dailymotion API
function loadVideos() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('video-section').style.display = 'block';

    fetch("https://api.dailymotion.com/user/maximusenterpreneurhub/videos?fields=id,title,description,created_time")
        .then(response => response.json())
        .then(data => {
            allVideos = data.list;
            displayVideos(allVideos);
        })
        .catch(error => console.error("Error loading videos:", error));
}

// Display Videos
function displayVideos(videos) {
    const container = document.getElementById('videos-container');
    container.innerHTML = '';

    if (videos.length === 0) {
        document.getElementById('no-results').style.display = 'block';
    } else {
        document.getElementById('no-results').style.display = 'none';
        videos.forEach(video => {
            const videoItem = document.createElement("div");
            videoItem.classList.add("video-item");

            // Create iframe for video with autoplay disabled
            const videoFrame = document.createElement("iframe");
            videoFrame.src = `https://www.dailymotion.com/embed/video/${video.id}?autoplay=0`; // Disable autoplay
            videoFrame.setAttribute("allowfullscreen", "true");

            // Mute/Unmute Button
            const muteButton = document.createElement("button");
            muteButton.classList.add("mute-unmute-btn");
            muteButton.textContent = "Mute";
            muteButton.onclick = () => toggleMute(videoFrame, muteButton);

            const videoTitle = document.createElement("div");
            videoTitle.classList.add("video-title");
            videoTitle.textContent = video.title;

            const videoDate = document.createElement("div");
            videoDate.classList.add("video-date");
            const uploadDate = new Date(video.created_time * 1000);
            videoDate.textContent = `Uploaded on: ${uploadDate.toLocaleString()}`;

            const descriptionButton = document.createElement("button");
            descriptionButton.textContent = "See video description";
            descriptionButton.onclick = () => showDescription(video.description);

            videoItem.appendChild(videoFrame);
            videoItem.appendChild(muteButton);
            videoItem.appendChild(videoTitle);
            videoItem.appendChild(videoDate);
            videoItem.appendChild(descriptionButton);

            container.appendChild(videoItem);
        });
    }
}

// Show Video Description in Modal
function showDescription(description) {
    document.getElementById('full-description').textContent = description;
    document.getElementById('description-modal').style.display = 'flex';
}

// Close the description modal
function closeDescriptionModal() {
    document.getElementById('description-modal').style.display = 'none';
}

// Perform Search
function performSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredVideos = allVideos.filter(video => video.title.toLowerCase().includes(searchInput));
    displayVideos(filteredVideos);
}

// Toggle password visibility
function togglePasswordVisibility(passwordId, eyeIconId) {
    const passwordField = document.getElementById(passwordId);
    const eyeIcon = document.getElementById(eyeIconId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

// Mute/Unmute functionality
function toggleMute(videoFrame, muteButton) {
    const isMuted = videoFrame.muted;

    videoFrame.muted = !isMuted;
    muteButton.textContent = isMuted ? "Mute" : "Unmute";
}
