Sutradhar AI

Sutradhar AI is an AI-powered storytelling and business intelligence platform designed for handicraft artisans and MSMEs.

Features
AI Heritage Story Generator
Craft DNA Card
Smart Pricing Assistant
Digital Catalog Builder
Market Readiness Dashboard
Tech Stack
React.js
Tailwind CSS
React Router
FastAPI 
MongoDB Atlas 


## Backend Setup

### Navigate to the backend folder

```bash
cd backend
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the virtual environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux/macOS

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Start the FastAPI server

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```
http://127.0.0.1:8000
```

Swagger API Documentation:

```
http://127.0.0.1:8000/docs
```
## Database

### Database Choice

This project uses **MongoDB Atlas** as the cloud-hosted NoSQL database. MongoDB was chosen because it provides a flexible document-based data model that suits the artisan product information used in Sutradhar AI.

### Database Schema

The project contains the following collections:

- User
- Artisan
- Product

(A schema diagram is included below.)

### Database Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Whitelist your IP address.
4. Create a `.env` file inside the backend folder.
5. Add:

```env
MONGO_URI=your_connection_string
DATABASE_NAME=sutradhar_ai
```

6. Install dependencies:

```bash
pip install -r requirements.txt
```

7. Run the backend:

```bash
uvicorn app.main:app --reload
```
