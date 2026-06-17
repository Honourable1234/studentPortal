import { useState, type ReactNode } from 'react';
import type { Student } from '../types/Student';
import { StudentSessionContext } from './useStudentSession';

const STORAGE_KEY = 'studentSession';

const readStoredStudent = (): Student | null => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
};

export const StudentSessionProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(readStoredStudent);

  const login = (newStudent: Student) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newStudent));
    setStudent(newStudent);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStudent(null);
  };

  return (
    <StudentSessionContext.Provider value={{ student, login, logout }}>
      {children}
    </StudentSessionContext.Provider>
  );
};
