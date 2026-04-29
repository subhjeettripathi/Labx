import { Component, Inject, OnInit } from '@angular/core';
import { SeoService } from './services/seo.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'aol';
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private doc: Document,
    private titleService: Title,
    private metaService: Meta,
   private translateService: TranslationService) {
  }

  ngOnInit() {
      this.translateService.loadSavedLang();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let canonicalLink: HTMLLinkElement =
          this.doc.querySelector("link[rel='canonical']") ||
          this.doc.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute(
          'href',
          'https://www.artofliving.app' + event.urlAfterRedirects
        );

        if (!canonicalLink.parentNode) {
          this.doc.head.appendChild(canonicalLink);
        }
      }
    });
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const pageTitle = data['title'] || 'The Art of Living';
        this.titleService.setTitle(pageTitle);

        this.metaService.updateTag({
          property: 'og:title',
          content: pageTitle
        });

        this.metaService.updateTag({
          property: 'og:description',
          content: 'The Art of Living Foundation- a humanitarian organisation devoted for betterment of society, brings smiles by yoga, meditation, Sudarshan Kriya & life skills.'
        });
        this.metaService.updateTag({ name: 'description', content: 'The Art of Living Foundation- a humanitarian organisation devoted for betterment of society, brings smiles by yoga, meditation, Sudarshan Kriya & life skills.' });

        this.metaService.updateTag({
          name: 'twitter:title',
          content: pageTitle
        });
      });
  }



}