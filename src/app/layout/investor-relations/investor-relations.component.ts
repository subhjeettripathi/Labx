import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-investor-relations',
  templateUrl: './investor-relations.component.html',
  styleUrls: ['./investor-relations.component.scss']
})
export class InvestorRelationsComponent implements OnInit {
  invester: any;
  show:boolean=false;
  clickedIndex:boolean=true;
  constructor(private ds:DataService) { }

  ngOnInit(): void {
    this.investerData()
    window.scroll(0, 0)
  }

  investerData() {
    this.ds.json2().subscribe((data: any) => {
      this.invester = data.Form[0].investor_relations  
    
      
    })
  }
  openFirst(){
    this.show=false;
 
  }
  openTab(data:any){
    if(data=='agm'){
  
    this.show=false;
   
    }else{
      this.clickedIndex=false
      this.show=true;
     
    }
  }

}
