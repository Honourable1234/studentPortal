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
