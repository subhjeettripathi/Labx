import { animate, query, style, transition, trigger, group, stagger, keyframes } from '@angular/animations';
  
  export function routerAnimation() {
    return trigger('routerAnimation', [
      // One time initial load. Move page from left -100% to 0%
      transition('-1 => *', [
        query(':enter', [
          style({
            position: 'fixed',
            width: '100%',
            // transform: 'translateX(-100%)',
            transform: 'translateX(-100%)',
          }),
          animate(
            '300ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%)',
            }),
          ),
        ]),
      ]),
  
      // Previous, slide left to right to show left page
      transition(':decrement', [
        // set new page X location to be -100%
        query(
          ':enter',
          style({
            position: 'fixed',
            width: '100%',
            // transform: 'translateX(-100%)',
            transform: 'translateX(-100%)',
          }),
        ),
  
        group([
          // slide existing page from 0% to 100% to the right
          query(
            ':leave',
            animate(
              '300ms ease',
              style({
                position: 'fixed',
                width: '100%',
                transform: 'translateX(100%)',
              }),
            ), { optional: true}
          ),
          // slide new page from -100% to 0% to the right
          query(
            ':enter',
            animate(
              '300ms ease',
              style({
                opacity: 1,
                transform: 'translateX(0%)',
              }),
            ),
          ),
        ]),
      ]),
  
      // Next, slide right to left to show right page
      transition(':increment', [
        // set new page X location to be 100%
        query(
          ':enter',
          style({
            position: 'fixed',
            width: '100%',
            transform: 'translateX(100%)',
          }),
        ),
  
        group([
          // slide existing page from 0% to -100% to the left
          query(
            ':leave',
            animate(
              '300ms ease',
              style({
                position: 'fixed',
                width: '100%',
                transform: 'translateX(-100%)',
              }),
            ), { optional: true}
          ),
          // slide new page from 100% to 0% to the left
          query(
            ':enter',
            animate(
              '300ms ease',
              style({
                opacity: 1,
                transform: 'translateX(0%)',
              }),
            ),
          ),
        ]),
      ]),
    ]);
  }
  export const dataAnimation =  trigger('dataAnimation', [
    transition('* => *', [

      query(':enter', style({ opacity: 0 }), {optional: true}),

      query(':enter', stagger('40ms', [
        animate('.6s ease-in', keyframes([
          style({opacity: 0, transform: 'translateY(-75px)', offset: 0}),
          style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
        ]))]), {optional: true})
        ,
      query(':leave', stagger('40ms', [
        animate('.6s ease-out', keyframes([
          style({opacity: 1, transform: 'translateY(0)', offset: 0}),
          style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
          style({opacity: 0, transform: 'translateY(-75px)',     offset: 1.0}),
        ]))]), {optional: true})
    ])
  ]);