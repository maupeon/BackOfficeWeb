import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  selectedBook: Book;
  books: Book[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';


  constructor(private http: HttpClient) {
    this.selectedBook = new Book();
   }

   getBooks() {
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.get(this.URL_API + 'books',{headers: headers});
  }

  /*LLAMAR ULR PARA CREAR USUARIO*/
  postBook(book: Book) {
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.post(this.URL_API + 'book', book, {headers: headers});
  }

  /*UPDATE AN Book*/
  putBook(book: Book) {
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.put(this.URL_API + 'book/' + `${book._id}`, book, {headers: headers});
  }

  deleteBook (_id: string) {
    console.log('ID::' + _id);
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.delete(this.URL_API + 'book/' + `${_id}`, {headers: headers});
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
