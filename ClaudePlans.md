# ClaudePlans.md — projectStudentPortal

## Purpose

This is the student-facing portal. A student "logs in" using just their **first name and last name**
(no password) and sees their own course scores. This is a lightweight identity check, not real
authentication — there is no password, token, or session security. It is meant to demonstrate a
distinct, restricted-access frontend origin in the CORS system.

This frontend runs on port **5176** and communicates with the backend at:
- Production: `https://cors-dashboard-backend.onrender.com/api`
- Local dev: `http://localhost:5000/api`

---

## Current State

This project does not exist yet. Needs full scaffolding.

---

## Scaffolding

```bash
npm create vite@latest projectStudentPortal -- --template react-ts
cd projectStudentPortal
npm install
npm install react-router-dom axios
npm install -D tailwindcss @tailwindcss/vite
```

Configure Tailwind the same way as the other frontends.

---

## Important Backend Dependency

The current `Student` model stores a single `name` field (e.g. `"John Doe"`), not separate
`first_name` / `last_name` fields. To match a login of "first name + last name" reliably, one of
two approaches is needed — **flag this to the user before building the login page**:

- **Option A (no backend change):** Concatenate the student's typed first + last name into a full
  name string, then call `GET /students` and filter client-side for a case-insensitive match against
  the `name` field. Works immediately with the existing backend, but pulls the entire student list
  to the browser on every login attempt, which leaks all student data to an unauthenticated request.
- **Option B (backend change):** Split `Student.name` into `first_name` and `last_name` fields, and
  add a backend endpoint like `GET /students/lookup?first_name=...&last_name=...` that returns only
  the matching student. More correct and more secure, but requires editing the `server` codebase
  (out of scope for "frontend only" work).

**This plan proceeds with Option A for now** since the instruction is to scaffold frontends only,
but the recommendation is to revisit Option B before this app is ever exposed beyond local testing.

---

## Files to Create

### Types

**`src/types/Student.ts`** — same shape as in `projectLecturerConsole`:

```ts
export interface CourseScore {
  course_name: string;
  score: number;
}

export interface Student {
  _id: string;
  name: string;
  matric_number: string;
  courses: CourseScore[];
}
```

---

### API Layer

**`src/api/client.ts`** — axios instance, `baseURL` from `import.meta.env.VITE_API_URL`.

**`src/api/students.ts`**

```ts
findStudentByName(firstName: string, lastName: string): Promise<Student | null>
```

Implementation: call `GET /students`, then find the first record where
`student.name.trim().toLowerCase() === \`${firstName} ${lastName}\`.trim().toLowerCase()`.
Return `null` if no match.

---

### Session Handling (Client-Side Only)

**`src/context/StudentSessionContext.tsx`**

A simple React Context that holds the currently "logged in" student object in memory plus
`sessionStorage` (so a page refresh doesn't immediately log the user out, but closing the tab does).

```ts
const StudentSessionContext = createContext<{
  student: Student | null;
  login: (student: Student) => void;
  logout: () => void;
}>(...)
```

---

### Routing

**`src/App.tsx`**

```tsx
<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
</Routes>
```

**`src/components/ProtectedRoute.tsx`** — redirects to `/` if no student is in session context.

---

### Pages

**`src/pages/LoginPage.tsx`**

- Heading: "Student Portal"
- Two text inputs: First Name, Last Name
- "View My Results" button
- On submit: call `findStudentByName(firstName, lastName)`
  - If found → call `login(student)` from session context, navigate to `/results`
  - If not found → show inline error: "No student found with that name. Check spelling and try again."
- Loading state while the lookup request is in flight

**`src/pages/ResultsPage.tsx`**

- Heading: "Welcome, {student.name}"
- Display matric number
- Table of courses and scores: Course Name | Score | Grade (computed client-side: A/B/C/D/F bands)
- An overall average score, computed client-side
- "Logout" button — calls `logout()` from session context, navigates back to `/`

---

## Vite Dev Port

**`vite.config.ts`**

```ts
server: { port: 5176 }
```

---

## Final File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── types/
│   └── Student.ts
├── api/
│   ├── client.ts
│   └── students.ts
├── context/
│   └── StudentSessionContext.tsx
├── components/
│   └── ProtectedRoute.tsx
└── pages/
    ├── LoginPage.tsx
    └── ResultsPage.tsx
vite.config.ts
```

---

## Backend Endpoints Used

| Use Case | Method | Endpoint |
|---|---|---|
| Look up a student by name (client-filtered) | `GET` | `/students` |

---

## How This Connects to the System

- This origin must be registered in the CORS origins list via `projectDashboard`
- Recommended rule: `allowed_methods: ['GET']` only, `allow_credentials: false` — this portal never
  writes data, so it should not be granted POST/PUT/DELETE
- There is no real authentication here — name-based login is intentionally simple and should never
  be treated as a security boundary
