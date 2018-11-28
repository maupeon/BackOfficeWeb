import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { BookService } from './services/book.service';
import { Employee } from './models/employee';
import { Book } from './models/book';
import { Client } from './models/client';
import { NgForm } from '@angular/forms';
import { ClientService } from './services/client.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EmployeeService, BookService, ClientService]
})

export class AppComponent implements OnInit {
  title = 'frontend';
  public employee: Employee;
  public employee_register: Employee;
  public identity: Employee;
  public token;
  public errorMessage;
  public alertRegister;
  public bookWindow: boolean = false;
  public employeeWindow: boolean = false;
  public clientWindow: boolean = false;
  public googleWindow: boolean = false;


  constructor(
    private employeeService:EmployeeService
  ){
    this.employee = new Employee('','','','','','','','ROLE_EMPLOYEE','');
    this.employee_register = new Employee('','','','','','','','ROLE_EMPLOYEE','');
  }

  //MANTENER LA SESIÓN ABIERTA
  ngOnInit(){
    this.identity = this.employeeService.getIdentity();
    this.token = this.employeeService.getToken();
    //console.log(this.identity);
    //console.log(this.token);
  }

  //FUNCIÓN PARA HACER LOGIN
  public onSubmit(){
    //Conseguir datos de usuario identificado
    this.employeeService.signup(this.employee).subscribe(
      response => {
        var myJSON = JSON.stringify(response);
        var iden = JSON.parse(myJSON);
        let identity = iden.employee;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no está correctamente identificado");

        } else {
          console.log(this.identity._id);
          // Crear elemento en el local storage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //Conseguir token para enviarselo a cada petición
          this.employeeService.signup(this.employee, 'true').subscribe(
            response => {
              var myJSON2 = JSON.stringify(response);
              var iden2 = JSON.parse(myJSON2);
              let token = iden2.token;
              this.token = token;

              if(this.token.length <= 1){
                alert("El token no se ha generado");
              } else {
                // Crear elemento en el local storage para tener el token disponible
                localStorage.setItem('token', token);
                this.employee = new Employee('','','','','','','','ROLE_USER','');
                console.log(this.employeeService.getIdentity());
                console.log(this.employeeService.getToken());
              }
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        alert("El usuario no está correctamente identificado");
        console.log(error);
        /*
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }*/
    });
  }

  public logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }


  public showBooks(){
    this.bookWindow = true;
    this.employeeWindow = false;
    this.clientWindow = false;
  }

  public showEmployees(){
    this.bookWindow = false;
    this.employeeWindow = true;
    this.clientWindow = false;
    this.googleWindow= false;
  }
  public showClients(){
    this.bookWindow = false;
    this.employeeWindow = false;
    this.clientWindow = true;
    this.googleWindow= false;
  }
  public showGoogleAPI(){
    this.bookWindow = false;
    this.employeeWindow = false;
    this.clientWindow = false;
    this.googleWindow= true;
  }
}
