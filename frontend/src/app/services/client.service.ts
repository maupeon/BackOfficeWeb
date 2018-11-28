import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  selectedClient: Client;
  clients: Client[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';

  constructor(private http: HttpClient) {
    this.selectedClient = new Client();
   }

   getClients() {
    console.log('GetClients Service');
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.get(this.URL_API + 'clients',{headers: headers});
  }

  /*LLAMAR ULR PARA CREAR USUARIO*/
  postClient(client: Client) {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.URL_API + 'client', client, {headers: headers});
  }

  /*UPDATE AN Client*/
  putClient(client: Client) {
    console.log('Update Client Service');
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.put(this.URL_API + 'client/' + `${client._id}`, client, {headers: headers});
  }

  deleteClient (_id: string) {
    console.log('ID::' + _id);
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.delete(this.URL_API + 'client/' + `${_id}`, {headers: headers});
  }

  getIdentity(){
  let identity = JSON.parse(localStorage.getItem('identity'));

  if(identity != "undefined"){
    this.identity = identity;
  } else {
    this.identity = null;
  }
  return this.identity;
}

getToken(){
  let token = localStorage.getItem('token');

  if(token != "undefined"){
    this.token = token;
  } else {
    this.token = null;
  }
  return this.token;
}

}
