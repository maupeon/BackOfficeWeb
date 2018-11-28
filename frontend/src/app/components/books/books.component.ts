import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { NgForm } from '@angular/forms';
import { Book } from 'src/app/models/book';

declare var M: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  providers: [BookService]
})
export class BooksComponent implements OnInit {

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.getBooks();
  }

  addBook(form: NgForm) {
    if(form.value._id){
      this.bookService.putBook(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Updated Successfully'});
          this.getBooks();
        });
    }else{
      console.log('CREATE');
      this.bookService.postBook(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Successfully'});
        this.getBooks();
      }, err => {
        alert("El libro no se creo correctamente");
      });
    }
  }

  getBooks(){
    this.bookService.getBooks()
      .subscribe(
        response => {
        this.bookService.books = response as Book[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  editBook(book: Book){
    this.bookService.selectedBook = book;
  }

  deleteBook(_id: string){
    if(confirm('Are you sure you want to delete it?')){
      console.log(_id);
      this.bookService.deleteBook(_id)
        .subscribe(res => {
          M.toast({html: 'Book Deleted'});
          this.getBooks();
        });
    }
  }

  resetForm(form?: NgForm) {
    if(form){
      form.reset();
      this.bookService.selectedBook = new Book;
    }
  }

}
