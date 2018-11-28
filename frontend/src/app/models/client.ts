export class Client {

    constructor(_id = '', name = '', surname = '', email = '', username = '', password = '', image = '', role = '', status = '',balance=0){
        this._id=_id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.image = image;
        this.role = role;
        this.status = status;
        this.balance = balance;
    }

    public _id: string;
    public name: string;
    public surname: string;
    public email: string;
    public username: string;
    public password: string;
    public image: string;
    public role: string;
    public status: string;
    public balance: Number;
}
