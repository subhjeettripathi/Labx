import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DecryptService } from 'src/app/services/decrypt.service';
export interface DialogData {
  image: any
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  searchForm!:FormGroup
  datas: any = []
  searchcontent: any
  allData: any = [];
  yearData: any = [];
  genreData: any = [];
  languageData: any = [];
  year: any = [];
  genre: any = [];
  returncategory: any = [];
  keyword:any;
  show:boolean=false;
  searchDataShow:any;
  viewSearchFilter: boolean = false;

  thumb_img: any;
  Img_url: any;
  img_size: [] = [];
  windowSize: number = 0;
  img_url: any = [];
  img_identifier: any = [];
  searchImage: any;
  imageData: [] = [];
  data_layout: any = [];
  layout_thumbs: any;
  advancedsearchData: any = [];
  search_url: any = [];
  searchRes: any = true;
  popularSearch: any = true;
 
  UserInfo: any;
  text:any;
  constructor(public dialogRef: MatDialogRef<SearchFilterComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,private _fb: FormBuilder,private auth: AuthService,private DEC_SER: DecryptService,) { }

  ngOnInit(): void {
    this.datas.push(this.data)
    this.keyword=this.data
    this.searchForm = this._fb.group({
      year:['',],
      genre:['',],
      language:['',],
      category:['',],
     
      
    });
    this.allData = this.datas[0].data.content
    for (var i = 0; i < this.allData.length; i++) {

      // FOR YEAR LOOP

      let yearValue = this.allData[i].year
      this.yearData.push(yearValue)
      let removedups = this.yearData.filter((item: any, indx: any, arr: any[]) => {
        if (
          arr.findIndex((x: any) => JSON.stringify(x) === JSON.stringify(item)) ===
          indx
        ) {
          return item;
        }
      });
      this.year = removedups

      // FOR GENRE LOOP

      let genre = this.allData[i].genre

      for (let i = 0; i < genre.length; i++) {
      this.genreData.push(genre[i].genre_name)
        let removedupsGenre = this.genreData.filter((item: any, indx: any, arr: any[]) => {
          if (
            arr.findIndex((x: any) => JSON.stringify(x) === JSON.stringify(item)) ===
            indx
          ) {
            return item;
          }
        });
        this.genre = removedupsGenre
      }

      // FOR LANGUAGE LOOP

      let returnlanguage = this.allData[i].language
      this.languageData.push(returnlanguage)
      let removedupsLanguage = this.languageData.filter((item: any, indx: any, arr: any[]) => {
        if (
          arr.findIndex((x: any) => JSON.stringify(x) === JSON.stringify(item)) ===
          indx
        ) {
          return item;
        }
      });
      this.languageData = removedupsLanguage

      // FOR CATEGORY LOOP

      // category_type

      let returncategory = this.allData[i].category_type
      this.returncategory.push(returncategory)
      let removedupsCategory = this.returncategory.filter((item: any, indx: any, arr: any[]) => {
        if (
          arr.findIndex((x: any) => JSON.stringify(x) === JSON.stringify(item)) ===
          indx
        ) {
          return item;
        }
      });
      this.returncategory = removedupsCategory

    }
  }
  close() {
    this.dialogRef.close();
  }
  clearFIlters(){
    this.searchForm.reset();
  }
  onSubmit(){
   if (this.searchForm.valid) {
      let search_tag={
       q:this.keyword.name,
       language:this.searchForm.value.language,
       year:this.searchForm.value.year,
       genre:this.searchForm.value.genre,
       category:this.searchForm.value.category
        
      }
      const formData: any = new FormData();
      formData.append('search_tag', JSON.stringify(search_tag));
      this.auth.advancedSearch(formData).subscribe((res:any)=> {
        if (res.code==1) {
          this.DEC_SER.getDecryptedData(res.result);
          this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
          this.advancedsearchData = this.UserInfo.content;
         
          
          localStorage.setItem('advancedSearch',this.advancedsearchData)
          if(this.advancedsearchData!=''){
            this.advancedsearchData.map((data: any) => {
              data.sliderImg = "";
              data.sliderIdentifier = "";
              data.layout_thumbs.forEach((thumb: any) => {
              if (thumb.layout == "vertical_9x16") {
                  thumb?.image_size.filter((img: any) => {
                    if (this.windowSize > 480) {

                      if (
                        Number(img.width) <=
                        this.windowSize / 6
                      ) {
                        data.sliderImg = img.url;
                       
                       data.sliderIdentifier = img.identifier;
                      } else if (data.sliderImg == "") {
                        data.sliderImg = thumb?.image_size[1].url;
                        data.sliderIdentifier =
                          thumb?.image_size[1].identifier;
                      } else if (this.windowSize < 480) {
                        if (Number(img.width) <= this.windowSize) {
                          data.sliderImg = img.url;
                          data.sliderIdentifier = img.identifier;
                        } else if (data.sliderImg == "") {
                          data.sliderImg = thumb?.image_size[1].url;
                          data.sliderIdentifier =
                            thumb?.image_size[1].identifier;
                        }
                      }
                    }
                  });

                }

              });

            });
          }
         
        } else {
         
        }
      })
    }
    
  }
}
