import 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const { assert, expect } = chai;
import { stubInterface } from "ts-sinon";

import { Request } from 'express';

import { Student, StudentPattern } from '../src-ts/modules/student';
import { PatternDemo } from '../src-ts/pattern-demo';

describe('PatternDemo', () => {
    const student1: Student = new Student({name: 'Ah Kao', studentNo: 1});
    const student2: Student = new Student({name: 'Abu', studentNo: 2});
    const mockStudents = [ student1, student2 ];
    const mockStudentPattern: StudentPattern = {
        getAllStudents: sinon.fake.returns(mockStudents),
        updateStudent: sinon.fake(),
        addStudent: sinon.fake(),
        deleteStudent: sinon.fake(),
    };

    let handler: PatternDemo;
    beforeEach(() => {
        handler = new PatternDemo(mockStudentPattern);
    });

    let mockRequest: Request;
    let mockRespond: Response;
    beforeEach(() => {
        mockRequest = stubInterface<Request>();
        mockRespond = stubInterface<Response>();
        mockRespond.json = sinon.fake();
    });

    it('should initate', () => {
        expect(handler).not.to.be.empty;
    });

    describe('When receive GET /all', () => {
        beforeEach(() => {
            mockRequest.method = 'GET';
            mockRequest.path = '/all';
            handler.handle(mockRequest, mockRespond);
        });

        it('should call getAllStudents()', () => {
            assert.isTrue(mockStudentPattern.getAllStudents.called);
        });
    });

    describe('When receive POST', () => {
        beforeEach(() => {
            mockRequest.method = 'POST';
            mockRequest.body = JSON.stringify({name: 'James Bone'});
            handler.handle(mockRequest, mockRespond);
        });

        it('should call addStudent()', () => {
            assert.isTrue(mockStudentPattern.addStudent.called);
        });
    });

    describe('When receive PUT', () => {
        beforeEach(() => {
            mockRequest.method = 'PUT';
            mockRequest.body = JSON.stringify({name: 'Abu Suka', studentNo: 1});
            handler.handle(mockRequest, mockRespond);
        });

        it('should call updateStudent()', () => {
            assert.isTrue(mockStudentPattern.updateStudent.called);
        });
    });

    describe('When receive DELETE', () => {
        beforeEach(() => {
            mockRequest.method = 'DELETE';
            mockRequest.body = JSON.stringify({studentNo: 1});
            handler.handle(mockRequest, mockRespond);
        });

        it('should call deleteStudent()', () => {
            assert.isTrue(mockStudentPattern.deleteStudent.called);
        });
    });

});