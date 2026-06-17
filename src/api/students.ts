import apiClient from './client';
import type { Student } from '../types/Student';

export const findStudentByName = async (
  firstName: string,
  lastName: string,
): Promise<Student | null> => {
  const { data } = await apiClient.get<Student[]>('/students');
  const target = `${firstName} ${lastName}`.trim().toLowerCase();
  const match = data.find((student) => student.name.trim().toLowerCase() === target);
  return match ?? null;
};
