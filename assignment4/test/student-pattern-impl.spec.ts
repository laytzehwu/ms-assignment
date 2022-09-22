import 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const { assert, expect } = chai;
import { stubInterface } from "ts-sinon";

import { Student, StudentPattern, StudentPatternImpt } from '../src-ts/modules/student';
import rows from '../src-ts/modules/student/row';

describe('StudentPattern', () => {
    
    let service: StudentPattern;
    let newStudent: Student;
    beforeEach(() => {
        service = new StudentPatternImpt();
        newStudent = new Student({name: 'Ah Kao', studentNo: 4});
    });

    let allStudents: Array<Student>;
    describe('getAllStudents', () => {
        describe('Given the instance first initiated', () => {
            beforeEach(() => {
                allStudents = service.getAllStudents();
            });

            it('should have same number with the source', () => {
                assert.equal(allStudents.length, rows.length);
            });

            it('should include all student name from source', () => {
                expect(allStudents.map(student => student.getName())).to.have.members(rows.map(row => row.name));
            });

            it('should include all student no from source', () => {
                expect(allStudents.map(student => student.getStudentNo())).to.have.members(rows.map(row => row.studentNo));
            });

            it('should not include new student', () => {
                expect(allStudents).not.to.include(newStudent)
            });
        });
    });

    describe('Given adding a new student', () => {
        beforeEach(() => {
            service.addStudent(newStudent);
        });

        it('should include the new student', () => {
            allStudents = service.getAllStudents();
            expect(allStudents).to.include(newStudent)
        });

    });

    describe('Given adding an existing study', () => {
        let existingStudent: Student;
        beforeEach(() => {
            existingStudent = service.getAllStudents().pop(); 
        });

        beforeEach(() => {
            service.addStudent(existingStudent);
        });

        it('should not increase number of student', () => {
            allStudents = service.getAllStudents();
            assert.equal(allStudents.length, rows.length);
        });
    });

    describe('Given adding an existing study which has changed name', () => {
        let updatedStudent: Student;
        let existingNo: Number;
        beforeEach(() => {
            // Get first student no
            existingNo = service.getAllStudents().pop().getStudentNo();
            updatedStudent = new Student({studentNo: existingNo, name: 'New guy'});
            service.addStudent(updatedStudent);
        });

        it('should not increase number of student', () => {
            allStudents = service.getAllStudents();
            assert.equal(allStudents.length, rows.length);
        });

        it('should not change the name', () => {
            const matchedStudent = service.getAllStudents().find(student => student.getStudentNo() == existingNo);
            assert.notEqual(matchedStudent.getName(), updatedStudent.getName());
        });
    });

    describe('Given updating an existing student name', () => {
        const newName = 'New name';
        let existingNo: Number;
        let existingStudent: Student;
        beforeEach(() => {
            existingStudent = service.getAllStudents().pop(); 
            existingNo = existingStudent.getStudentNo();
        });

        it('should update student name', () => {
            existingStudent.setName(newName);
            const matchedStudent = service.getAllStudents().find(student => student.getStudentNo() == existingNo);
            // No need call update
            assert.equal(matchedStudent.getName(), newName);
        });

        it('should update student even pass-in new instance', () => {
            const updatedStudent = new Student({name: newName, studentNo: existingNo});
            const matchedStudent = service.getAllStudents().find(student => student.getStudentNo() == existingNo);
            assert.notEqual(matchedStudent.getName(), newName);
            service.updateStudent(updatedStudent);
            assert.equal(matchedStudent.getName(), newName);
        });
    });

    describe('Given deleting an existing student', () => {
        let existingStudent: Student;
        let existingNo: Number;
        beforeEach(() => {
            existingStudent = service.getAllStudents().pop();
            existingNo = existingStudent.getStudentNo();
        });

        it('should not find it again', () => {
            service.deleteStudent(existingStudent);
            const matchedStudent = service.getAllStudents().find(student => student.getStudentNo() == existingNo);
            expect(matchedStudent).to.be.undefined;
        });

        describe('and even deleted by new instant', () => {
            beforeEach(() => {
                service.deleteStudent(new Student({studentNo: existingNo}));
            });

            it('should not find it again', () => {
                const matchedStudent = service.getAllStudents().find(student => student.getStudentNo() == existingNo);
                expect(matchedStudent).to.be.undefined;
            });
        });


    });

    
});