import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgForm } from '@angular/forms';
import { Client } from 'src/app/models/client';

declare var M: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  providers: [ClientService]
})
export class ClientsComponent implements OnInit {

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    console.log('OnInit');
    this.getClients();
  }

  addClient(form: NgForm) {
    if(form.value._id){
      console.log('Update Client');
      this.clientService.putClient(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Updated Successfully'});
          this.getClients();
        });
    }else{
      console.log('CREATE');
      this.clientService.postClient(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Successfully'});
        this.getClients();
      }, err => {
        alert("El cliente no se creo correctamente");
      });
    }
  }

  getClients(){
    this.clientService.getClients()
      .subscribe(
        response => {
          console.log("CLIENTS1");
        this.clientService.clients = response as Client[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  editClient(client: Client){
    this.clientService.selectedClient = client;
  }

  deleteClient(_id: string){
    if(confirm('Are you sure you want to delete it?')){
      console.log(_id);
      this.clientService.deleteClient(_id)
        .subscribe(res => {
          M.toast({html: 'client Deleted'});
          this.getClients();
        });
    }
  }

  resetForm(form?: NgForm) {
    if(form){
      form.reset();
      this.clientService.selectedClient = new Client;
    }
  }

}
