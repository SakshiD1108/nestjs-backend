*Overview
This project is a NestJS-based backend service designed to handle user authentication, document management, and ingestion controls. It provides a set of APIs for managing users, roles, and document processing while integrating with a mocking ingestion system.

*Features
User Authentication: Secure user registration, login, and logout.

Role-based Access Control (RBAC): Admin, editor, and viewer roles with permissions.

User Management: Admins can manage users and their roles.

Document Management: CRUD operations for document handling and uploads.

Ingestion Trigger API: API to initiate ingestion using mocking.

Ingestion Management: Tracks and monitors ongoing ingestion processes.


*API Endpoints
1. Authentication APIs
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	    Login and receive a JWT token

2. User Management (Admin Only)
Method	Endpoint	Description
GET	    /users	     List all users
PATCH 	/users/:id/role	  Update user role
DELETE	/users/:id	    Delete a user

3. Document Management
Method	 Endpoint  	Description
POST	/documents	  Upload a new document
GET	/documents	    List all documents
PATCH	/documents/:id	  Update document metadata
DELETE	/documents/:id	   Delete a document


4. Ingestion APIs
Method	Endpoint	Description
POST	/ingestion/trigger  	 Trigger document ingestion process
GET	/ingestion/status/:id	     Get ingestion process status


** Test with postman, and write testcsae for end to and and unit testing 
please find the attched 


*Installation & Setup
Clone the Repository

git clone <nestjs-backend>
cd nestjs-backend
Install Dependencies
npm install
Configure Environment Variables Create a .env file:
PORT=4000
DATABASE_URL=<your_database_url>
JWT_SECRET=<your_jwt_secret>


* Start the Server 
npm run start:dev
