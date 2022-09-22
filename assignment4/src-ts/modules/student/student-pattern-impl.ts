import { Student } from "./student";
import { StudentPattern } from "./student-pattern";
import rows from './row';

export class StudentPatternImpt implements StudentPattern {
    
    private static _instance: StudentPattern;
    private _students: Array<Student>;
    constructor() {
        this._students = rows.map(row => new Student(row));
    }
    
    getAllStudents(): Array<Student> {
        return [ ...this._students];
    }

    updateStudent(student: Student): void {
        this._students
            .find(ref => ref.getStudentNo() == student.getStudentNo())?.setName(student.getName());
    }
    
    addStudent(student: Student): void {
        const targetStudentNo = student.getStudentNo();
        const match = this._students.find(ref => ref.getStudentNo() == targetStudentNo);
        if (!match) {
            this._students.push(student);
        }
    }

    deleteStudent(student: Student): void {
        const targetStudentNo = student.getStudentNo();
        const targetIndex = this._students.findIndex(ref => ref.getStudentNo() == targetStudentNo);
        if (targetIndex > -1) {
            this._students.splice(targetIndex, 1);
        }
    }

    static getInstace():StudentPattern {

        if (!StudentPatternImpt._instance) {
            StudentPatternImpt._instance = new StudentPatternImpt();
        }

        return StudentPatternImpt._instance;
    }

}