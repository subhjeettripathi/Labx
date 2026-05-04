import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Svgs } from './svgs.icons';
import { Isvgs } from './svgs.model';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MatIconRegisterModule {
  svgs: Isvgs[] = Svgs;
  constructor(public matIconRegistry: MatIconRegistry, private domsanitiser: DomSanitizer) {
    this.svgs.forEach((element) => {
      this.matIconRegistry.addSvgIcon(element.name, this.domsanitiser.bypassSecurityTrustResourceUrl(element.path));
    });
  }
  static forRoot(): ModuleWithProviders<MatIconRegisterModule> {
    return {
      ngModule: MatIconRegisterModule,
      providers: [MatIconRegistry],
    };
  }
}
