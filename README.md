# Student Management Dashboard

A modern, responsive React dashboard for managing a list of students. This project demonstrates best practices in React, state management, authentication, and UI/UX, with a focus on extensibility and developer experience.

# Demo Video

https://github.com/user-attachments/assets/2e4d4ed4-7a25-4481-8355-52ae7143f977




---

## 🚀 Features

### Core Features
- **Student List:** View a list of students fetched from a mock API (simulated with artificial delay).
- **Add Student:** Add new students via a form (with validation). Requires Firebase authentication.
- **Student Details:** View detailed information for each student (requires login).
- **Course Filter:** Filter students by course.
- **Responsive Design:** Fully responsive for both mobile and desktop devices.

### ✨ Extra Features (Bonus)
- **Edit & Delete Students:** Edit student details or delete students (with confirmation). Both actions require authentication.
- **Sorting:** Sort students by name, email, course, or date added (ascending/descending).
- **Real-time Search:** Debounced search for student names and emails.
- **Pagination:** Paginated student list for large datasets.
- **Export/Download:**
  - Export the student list to CSV.
  - Generate PDF reports for selected students (using jsPDF).
- **Dark/Light Mode:** Toggle between dark and light themes.
- **Mobile Navigation Drawer:** Mobile-friendly navigation for smaller screens.
- **Toast Notifications:** Success/error toasts for all major user actions.
- **Loading Spinners:** Visual feedback during API calls and data loading.
- **Error Handling:** User-friendly error messages and error boundaries.
- **Highlighting:** Newly added or updated students are highlighted in the list.
- **Protected Routes:** Only authenticated users can access add/edit/delete and student detail pages.
- **Centralized State Management:** Uses React Context for students, filters, pagination, and authentication.
- **Modern UI/UX:** Clean, modern design with Tailwind CSS and Headless UI.

---

## 🛠️ Tech Stack

- **React** (with hooks and context)
- **Tailwind CSS** (for styling and dark mode)
- **Firebase Authentication**
- **jsPDF** (for PDF export)
- **React Router** (for routing and protected routes)
- **React Toastify** (for notifications)
- **Headless UI** (for accessible UI components)
- **Mock API** (in-memory, with artificial delay)

---

## 🔒 Authentication

- **Firebase Authentication** is used for login (email/password or Google).
- Only authenticated users can add, edit, or delete students, or view student details.

---

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/student-dashboard.git
   cd student-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Add your Firebase config to `src/config/firebase.js`.

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
src/
  components/      # Reusable UI components
  context/         # React Context providers (students, auth, theme)
  pages/           # Main pages (list, detail, login, register)
  services/        # Mock API and Firebase config
  assets/          # Images and static assets
  App.jsx          # Main app component
```

---

## 📝 Customization

- **Mock API:** Easily switch to a real backend by replacing the mock API in `src/services/mockApi.js`.
- **Theme:** Tailwind CSS makes it easy to customize colors and styles.
- **Authentication:** Extend or replace Firebase auth as needed.

---

## 🙏 Credits

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Headless UI](https://headlessui.com/)

---

## 📣 Extra Features

This project goes beyond the basic requirements with:
- Edit/delete functionality
- Sorting, search, and pagination
- CSV/PDF export
- Dark/light mode
- Mobile navigation
- Toast notifications
- Error boundaries
- Highlighting and modern UX

---

## 📬 Feedback

Feel free to open issues or submit pull requests for improvements!

---

**Happy coding! 🚀**
