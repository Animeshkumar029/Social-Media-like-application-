# Social-media-backend
## Introduction
This is a social media-like application built using Node.js, Express.js, EJS for templating, and MongoDB as the database. The application allows users to connect, share posts, comment on posts, and like posts. Users can sign in with their username or email and interact with other users within the platform.

## Features
- Authentication:

  *  Users can sign in using their username and password or email using Google OAuth2 service.
  *  User registration for new users.
  *  Session authentication.
- User Profile:

  * Users have profiles displaying their information, including username, email, and profile picture.
  * Users can edit their profiles.
- Posts:

  * Users can create and delete posts.
  * Posts support text content and timestamps.
- Comments:

  * Users can comment on posts.
  * Comments can be edited and deleted.
- Likes:

  * Users can like posts.
  * Display the number of likes on each post.

- Security:

  * Authentication middleware protects routes.
  * Secure user sessions.
  * Data validation and security measures against web vulnerabilities.
- Forgot Password:

  * Users will receive a link on their registered email.
  * Can reset passwords.
  * Data validation and security measures against web vulnerabilities.
- Database:

  * MongoDB stores user data, posts, comments, likes, etc.
  * Defined schemas and models for data storage.
- Error Handling:

  * Graceful error handling with user-friendly error messages.
