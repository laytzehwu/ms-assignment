import { Student } from "./student";

export interface StudentPattern {
    getAllStudents(): Array<Student>;
    updateStudent(student: Student): void;
    addStudent(student: Student): void;
    deleteStudent(student: Student): void;
}