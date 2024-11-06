const adminPassword = "rajababuiiiyyy";
let isAdmin = false;
let lastUsernameChange = localStorage.getItem('lastUsernameChange');
let username = localStorage.getItem('username');
let selectedImage = null; // To store the uploaded image file
let likedPosts = new Set(); // To track liked posts by users

// Check username change restriction
function canChangeUsername() {
    if (!lastUsernameChange) return true;
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const lastChange = new Date(lastUsernameChange);
    return (new Date() - lastChange) >= oneWeekInMs;
}

// Login function
function login() {
    const password = document.getElementById('password').value;

    if (password === adminPassword) {
        isAdmin = true;
        alert("Logged in as Admin!");
    } else {
        isAdmin = false;
        alert("Logged in as Viewer");
    }

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('username-section').style.display = 'block';
}

// Set Username function
function setUsername() {
    const inputUsername = document.getElementById('username').value;

    if (!username || canChangeUsername()) {
        username = inputUsername;
        localStorage.setItem('username', username);
        localStorage.setItem('lastUsernameChange', new Date().toISOString());
        alert(`Username set to: ${username}`);
    } else {
        alert("You can only change your username once every 7 days.");
    }

    document.getElementById('username-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    document.getElementById('current-username').innerText = username;

    if (isAdmin) {
        document.getElementById('post-creation').style.display = 'block';
    }
}

// Logout function
function logout() {
    isAdmin = false;
    selectedImage = null; // Clear the selected image
    likedPosts.clear(); // Clear the liked posts when logging out
    document.getElementById('image-preview').style.display = 'none'; // Hide the image preview
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('post-creation').style.display = 'none';
}

// Preview Image function
function previewImage(event) {
    const imagePreview = document.getElementById('image-preview');
    selectedImage = event.target.files[0]; // Store the uploaded image file
    const reader = new FileReader();
    
    reader.onload = function(e) {
        imagePreview.src = e.target.result; // Set the image source to the uploaded file
        imagePreview.style.display = 'block'; // Show the image preview
    };
    
    reader.readAsDataURL(selectedImage);
}

// Create Post function
function createPost() {
    const content = document.getElementById('post-content').value;
    const postList = document.getElementById('post-list');
    
    if (!content && !selectedImage) {
        alert("Please write something or upload an image to post.");
        return;
    }

    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    // Create post header with username
    const postHeader = document.createElement('div');
    postHeader.innerHTML = `<strong>${username}:</strong> `;
    postDiv.appendChild(postHeader);

    // Add post content
    if (content) {
        postDiv.innerHTML += `<p>${content}</p>`;
    }

    // Add uploaded image if it exists
    if (selectedImage) {
        postDiv.innerHTML += `<img src="${URL.createObjectURL(selectedImage)}" style="max-width: 100%; border-radius: 10px; margin-top: 10px;" alt="Uploaded Image">`;
    }

    // Add like button
    const likeButton = document.createElement('button');
    likeButton.innerText = 'Like (0)';
    likeButton.onclick = () => {
        const postId = postList.childNodes.length; // Unique identifier for the post
        if (likedPosts.has(postId)) {
            alert("You can only like a post once.");
        } else {
            let likes = parseInt(likeButton.innerText.match(/\d+/)[0]);
            likes++;
            likedPosts.add(postId); // Add to liked posts
            likeButton.innerText = `Like (${likes})`;
        }
    };

    postDiv.appendChild(likeButton);
    postList.appendChild(postDiv);

    // Clear input and image preview
    document.getElementById('post-content').value = ''; // Clear input
    document.getElementById('image-preview').style.display = 'none'; // Hide image preview
    document.getElementById('image-upload').value = ''; // Reset file input
    selectedImage = null; // Clear the selected image
}

// On load, show the username if set
window.onload = function() {
    if (username) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('username-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        document.getElementById('current-username').innerText = username;

        if (isAdmin) {
            document.getElementById('post-creation').style.display = 'block';
        }
    }
};

// Toggle Notice function
function toggleNotice() {
    const noticeContent = document.getElementById('notice-content');
    if (noticeContent.style.display === 'none') {
        noticeContent.style.display = 'block';
    } else {
        noticeContent.style.display = 'none';
    }
}