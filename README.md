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
