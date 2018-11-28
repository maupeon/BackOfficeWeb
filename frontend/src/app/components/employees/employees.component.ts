import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { NgForm } from '@angular/forms';
import { Employee } from 'src/app/models/employee';

declare var M: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  addEmployee(form: NgForm) {
    if(form.value._id){
      console.log('UPDATE');
      this.employeeService.putEmployee(form.value)
        .subscribe(res => {
          console.log('UPDATE2');
          this.resetForm(form);
          M.toast({html: 'Updated Successfully'});
          this.getEmployees();
        });
    }else{
      console.log('CREATE');
      this.employeeService.postEmployee(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Successfully'});
        this.getEmployees();
      }, err => {
        alert("El empleado no está correctamente creado");
      });
    }
  }

  getEmployees(){
    this.employeeService.getEmployees()
      .subscribe(
        response => {
        this.employeeService.employees = response as Employee[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  editEmployee(employee: Employee){
    this.employeeService.selectedEmployee = employee;
  }

  deleteEmployee(_id: string){
    if(confirm('Are you sure you want to delete it?')){
      console.log(_id);
      this.employeeService.deleteEmployee(_id)
        .subscribe(res => {
          M.toast({html: 'Employee Deleted'});
          this.getEmployees();
        });
    }
  }

  resetForm(form?: NgForm) {
    if(form){
      form.reset();
      this.employeeService.selectedEmployee = new Employee;
    }
  }

}
