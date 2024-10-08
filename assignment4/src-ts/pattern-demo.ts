import { Request, Response } from 'express';
import { Student } from './modules/student';
import { StudentPattern } from './modules/student/student-pattern';

export class PatternDemo {
    private service: StudentPattern;

    constructor(service: StudentPattern) {
        this.service = service;
    }

    handleGet(request: Request, response: Response): void {
        switch(request.path) {
            case '/all':
                response.json(
                    this.service.getAllStudents().map( (student: Student) => {
                        return {
                            studentNo: student.getStudentNo(),
                            name: student.getName()
                        };
                    })
                );
                return;
        }
        response.status(404).end();
    }

    handle(request: Request, response: Response): void {
        switch(request.method) {
            case 'GET':
                this.handleGet(request, response);
                return;

            case 'POST':
                // To create a new student record
                this.service.addStudent(new Student(request.body));
                response.sendStatus(201);
                return;

            case 'PUT':
                // To update an existing study record
                this.service.updateStudent(new Student(request.body));
                response.sendStatus(201);
                return;
            
            case 'DELETE':
                // To delete an existing study record
                this.service.deleteStudent(new Student(request.body));
                response.sendStatus(201);
                return;
        }
        response.status(404).end();
    }

}