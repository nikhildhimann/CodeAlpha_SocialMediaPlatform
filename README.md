CodeAlpha_SocialMediaPlatform
A full-stack social media application built as part of the CodeAlpha internship program. This project is a mini-Twitter clone featuring user authentication, posts, comments, likes, and a follow system, built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Material-UI.


✨ Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens) and password hashing (bcrypt).

User Profiles: Viewable user profiles with display name, username, bio, and a list of their posts.

Follow/Unfollow System: Users can follow and unfollow other users to customize their feed.

Create, Read, Update, Delete (CRUD) Posts: Authenticated users can create, edit, and delete their own posts.

Like/Unlike Posts: Users can like and unlike posts.

Full Commenting System: Users can add and delete their own comments on any post.

Personalized Home Feed: The home feed displays the latest posts from the user and the people they follow.

Explore Page: Discover trending posts from across the platform.

Dark/Light Mode Toggle: Switch between a dark and light theme for user comfort.

Responsive Design: The UI is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

Toast Notifications: User-friendly feedback for actions like login, posting, and errors.

🛠️ Tech Stack
Frontend
React.js: A JavaScript library for building user interfaces.

React Router: For client-side routing.

Material-UI (MUI): For a modern and responsive component library.

Axios: For making HTTP requests to the backend API.

React Hot Toast: For user-friendly notifications.

Backend
Node.js: A JavaScript runtime for the server.

Express.js: A web application framework for Node.js.

MongoDB: A NoSQL database for storing user and post data.

Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.

JSON Web Token (JWT): For secure user authentication.

Bcrypt.js: For hashing user passwords.

Express Validator: For validating incoming request data.

Helmet: For securing HTTP headers.

Express Rate Limit: To prevent brute-force attacks.

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v14 or later)

npm (Node Package Manager)

MongoDB (either a local installation or a free MongoDB Atlas cluster)

Installation & Setup
Clone the repository:

git clone [https://github.com/nikhildhimann/CodeAlpha_SocialMediaPlatform.git](https://github.com/nikhildhimann/CodeAlpha_SocialMediaPlatform.git)
cd CodeAlpha_SocialMediaPlatform

Backend Setup:

Navigate to the server directory:

cd server

Install the backend dependencies:

npm install

Create a .env file in the server directory and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

Start the backend server:

node index.js

The server should now be running on http://localhost:5000.

Frontend Setup:

Open a new terminal and navigate to the client directory:

cd client

Install the frontend dependencies:

npm install

Start the React development server:

npm start

The application should now be running and open in your browser at http://localhost:3000.

🖼️ Screenshots
Placeholder: Add screenshots of your application here. For example:

(Login Page)

(Home Feed)

(Profile Page)

(Explore Page)

👤 Contact
Your Name - Nikhil Dhimann   - nikhildhimaann@gmail.com.com

Project Link: https://github.com/nikhildhimann/CodeAlpha_SocialMediaPlatform.git