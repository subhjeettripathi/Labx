import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation.service';
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }

  

}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe1 implements PipeTransform {
//searchmodule
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }

  

}

@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe2 implements PipeTransform {
//continue watching
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }

  

}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe3 implements PipeTransform {
//live-events
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }

  

}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe4 implements PipeTransform {
//movies
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }

  

}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe5 implements PipeTransform {
//my-account-module
  constructor(private translationService: TranslationService) {}

transform(key: string): string {
  let result: any = key;

  // handle nested array keys like "genders.0"
  if (key.includes('.')) {
    const [mainKey, indexStr] = key.split('.');
    const arr: any = this.translationService.instant(mainKey);
    const index = parseInt(indexStr, 10);

    if (Array.isArray(arr) && arr[index] !== undefined) {
      result = arr[index];
    }
  } else {
    // fallback
    const value = this.translationService.instant(key);
    if (typeof value === 'string') {
      result = value;
    }
  }

  // ✅ Remove colons
  if (typeof result === 'string') {
    result = result.replace(/:/g, '');
  }

  return result;
}

 
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe6 implements PipeTransform {
//radio-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe7 implements PipeTransform {
//showdetail-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe8 implements PipeTransform {
//susbcribe-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe9 implements PipeTransform {
//faq- module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe10 implements PipeTransform {
//audioplayer-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe11 implements PipeTransform {
//carousel-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe12 implements PipeTransform {
//my-list-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe13 implements PipeTransform {
//paymentpack-module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe14 implements PipeTransform {
//event-statuscomponent(app module)
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe15 implements PipeTransform {
//newscomponent -module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe16 implements PipeTransform {
//webcast -module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}
@Pipe({
  name: 'translate',
    pure: false
})
export class TranslatePipe17 implements PipeTransform {
//zoom component -module
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    const value = this.translationService.instant(key);
    return typeof value === 'string' ? value : key; 
  }
}