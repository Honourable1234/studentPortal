import { createContext, useContext } from 'react';
import type { Student } from '../types/Student';

export interface StudentSessionValue {
  student: Student | null;
  login: (student: Student) => void;
  logout: () => void;
}

export const StudentSessionContext = createContext<StudentSessionValue | undefined>(undefined);

export const useStudentSession = (): StudentSessionValue => {
  const context = useContext(StudentSessionContext);
  if (!context) {
    throw new Error('useStudentSession must be used within a StudentSessionProvider');
  }
  return context;
};
