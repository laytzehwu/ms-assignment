export class Student {
    private _name: String;
    private _studentNo: Number;

    constructor(input: any) {
        this._name = input?.name ?? '';
        this._studentNo = input?.studentNo ?? -1;
    }

    getName():String {
        return this._name;
    } 

    setName(name: String) {
        this._name = name;
    }

    getStudentNo(): Number {
        return this._studentNo;
    }

    setStudentNo(studentNo: Number) {
        this._studentNo = studentNo;
    }

}