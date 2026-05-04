import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration'
})
export class TimeDurationPipe implements PipeTransform {
  transform(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);

    if (hours === 0) {
      return `${minutes} m`;
    }

    return `${hours} h ${minutes} m`;
  }
}

@Pipe({
  name: 'truncate'
})
export class TruncateWordPipe implements PipeTransform {
  transform(value: string, limit: number = 20, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    // Adjust limit to complete the last word, if specified
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}

@Pipe({
  name: 'timeDurationDetail'
})
export class TimeDurationDetailPipe implements PipeTransform {
  transform(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);

    if (hours === 0) {
      return `${minutes} m`;
    }

    return `${hours} h ${minutes} m`;
  }
}