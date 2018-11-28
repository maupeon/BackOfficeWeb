export class Book {

    constructor(_id = '',title = '',description='', genre='',year = 0,pages = 0,editorial='',total = 0,onloan = 0,inhouse = 0, image = '',type = '',file = '', status = ''){
        this._id=_id;
        this.title= title;
        this.description= description;
        this.genre= genre;
        this.year= year;
        this.pages= pages;
        this.editorial= editorial;
        this.total= total;
        this.onloan= onloan;
        this.inhouse= inhouse;
        this.image= image;
        this.type= type;
        this.file= file;
        this.status= status;
    }
   public _id: string;
   public title: string;
   public description: string;
   public genre: string;
   public year: Number;
   public pages: Number;
   public editorial: string;
   public total: Number;
   public onloan: Number;
   public inhouse: Number;
   public image: string;
   public type: string;
   public file: string;
   public status: string;
}
