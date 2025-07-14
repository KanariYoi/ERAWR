# Kick N' Klean – Shoe Cleaning Service Web App

A modern, full-stack web application for a shoe cleaning service.  
Features a beautiful, responsive frontend and a robust Django REST API backend with JWT authentication, user profile management, and social login (Google, Facebook).

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Python Virtual Environment](#2-python-virtual-environment)
  - [3. Install Backend Dependencies](#3-install-backend-dependencies)
  - [4. Django Setup](#4-django-setup)
  - [5. Frontend Usage](#5-frontend-usage)
  - [6. Social Login Setup](#6-social-login-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- Responsive, modern static frontend (HTML/CSS/JS)
- Sticky, semi-transparent header with smooth UI/UX
- Service showcase, care guides, and contact info
- User registration, login, JWT authentication
- User profile view/edit, password change
- Social login (Google, Facebook)
- Django REST API backend
- Admin panel for account management

---

## Project Structure

```
emtech/
├── Main.html                # Main frontend file
├── Main.css                 # Frontend styles
├── menu.js                  # Frontend interactivity
├── account.js               # Auth/profile JS logic
├── images/                  # Service and UI images
├── emtech_backend/          # Django backend project
│   ├── manage.py
│   ├── db.sqlite3
│   ├── emtech_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   └── accounts/
│       ├── models.py
│       ├── views.py
│       ├── urls.py
│       └── ...
└── venv/                    # Python virtual environment
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/KanariYoi/ERAWR.git
cd ERAWR
git fetch origin
git checkout master
```

### 2. Python Virtual Environment

Create and activate a virtual environment (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Backend Dependencies

Install Django, Django REST Framework, SimpleJWT, CORS headers, dj-rest-auth, django-allauth, and other dependencies:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers dj-rest-auth django-allauth
python -m pip install cryptography
python -m pip install requests
```

If you have a `requirements.txt`, use:

```bash
pip install -r requirements.txt
```

### 4. Django Setup

**a. Migrate the database:**

```bash
cd emtech_backend
python manage.py makemigrations
python manage.py migrate
python ERAWR/emtech_backend/add_sample_data.py
```

**b. Create a superuser (for admin access):**

```bash
python manage.py createsuperuser
```

**c. Run the development server:**

```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/`.

### 5. Frontend Usage

- Open `Main.html` directly in your browser for static testing.
- For full authentication and API features, ensure the Django server is running.
- The frontend expects the backend at `http://127.0.0.1:8000/` (adjust in JS if needed).

### 6. Social Login Setup

- Set up Google and Facebook OAuth apps.
- Add your client IDs in the Django admin under Social Applications (via django-allauth).
- Update the frontend JS with your Google client ID.
- For local testing, set OAuth redirect URIs to `http://127.0.0.1:8000/`.

---

## Usage

- Register or log in via the modals.
- View and edit your profile, change your password.
- Use Google or Facebook login for quick access.
- Admins can manage users via `/admin/`.

---

## API Endpoints

- `POST /api/register/` – Register a new user
- `POST /api/login/` – Obtain JWT tokens
- `GET /api/profile/` – Get current user profile (JWT required)
- `PUT /api/profile/` – Update user profile (JWT required)
- `POST /api/change-password/` – Change password (JWT required)
- Social login endpoints via dj-rest-auth

---

## Troubleshooting

- **CORS errors:** Ensure `django-cors-headers` is installed and configured in `settings.py`.
- **401 Unauthorized:** Make sure your JWT token is present and valid in requests.
- **Static files not loading:** Open `Main.html` directly or serve via a static file server.
- **OAuth issues:** Double-check your client IDs and redirect URIs.

---

## License

MIT License.  
See [LICENSE](LICENSE) for details.

---

**For questions or contributions, open an issue or pull request!**
