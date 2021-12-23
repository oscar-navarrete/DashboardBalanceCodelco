import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { environment } from 'environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Favorites } from '../../../app/main/models/security.model';
import { DataService } from '../../../app/main/services/data.service';

@Component({
    selector   : 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls  : ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, AfterViewInit, OnDestroy
{
    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;
    token = '';
    favorites: Favorites[];

    @Input()
    navigation: any;

    @ViewChild('searchInput', {static: false})
    searchInputField;

    @ViewChild('shortcuts', {static: false})
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {MediaObserver} _mediaObserver
     * @param {Renderer2} _renderer
     */
    constructor(
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _mediaObserver: MediaObserver,
        private _renderer: Renderer2,
        private _httpClient: HttpClient,
        private _ds: DataService
    )
    {
        // Set the defaults

        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

        this._ds.menu
        // .pipe(takeUntil(this._unsubscribeAll))
        .subscribe( async (menu) => {
            this.navigation = menu;
            this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);
            this.getFavorites().then( (favorites: any) => {
                    this.shortcutItems = favorites || [];
            });
        });

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    async loadToken() {
        this.token = await localStorage.getItem('authToken') || this.token || null;
      }
    

    getFavorites(): Promise<any> {
        return new Promise( async (resolve, reject) => {
            await this.loadToken();
            if (!this.token) {
                resolve([]);
            }
            const url: string = environment.api_server + 'user/favorites';
            const headers = new HttpHeaders({
                'auth-token': this.token,
                'system_id': environment.system_identifier
          });
            this._httpClient.get(url, { headers }).subscribe((response: any) => {
              this.favorites = response;
              resolve(this.favorites);
               }, reject);
        }
        );
    }  


    addShortcut(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
          const url: string = environment.api_server + 'user/favorites/add';
          const headers = new HttpHeaders({
                'auth-token': this.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.post(url, { feature: id },  { headers }).subscribe((response: any) => {
              resolve(true);
               }, reject);
        }
        );
    }  


    deleteShortcut(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
          const url: string = environment.api_server + 'user/favorites/delete';
          const headers = new HttpHeaders({
                'auth-token': this.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.post(url, { feature: id },  { headers }).subscribe((response: any) => {
              resolve(true);
               }, reject);
        }
        );
    }  

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit()
    {
        // Get the navigation items and flatten them
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);
        this.token = '';
        this.getFavorites().then( (favorites: any) => {
            this.shortcutItems = favorites;
        });

    }

    ngAfterViewInit(): void
    {
        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if ( this._mediaObserver.isActive('gt-sm') )
                {
                    this.hideMobileShortcutsPanel();
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search
     *
     * @param event
     */
    search(event): void
    {
        const value = event.target.value.toLowerCase();

        if ( value === '' )
        {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }

        this.searching = true;

        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }

    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void
    {

        console.log(itemToToggle);
        event.stopPropagation();

        for ( let i = 0; i < this.shortcutItems.length; i++ )
        {
            if ( this.shortcutItems[i].id === itemToToggle.id )
            {

                this.deleteShortcut(itemToToggle.id).then( (response: any) => {
                    this.shortcutItems.splice(i, 1);
                });
                
                // Save to the cookies
                // this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));

                return;
            }
        }

        this.addShortcut(itemToToggle.id).then( (response: any) => {
            this.shortcutItems.push(itemToToggle);
        });

        // Save to the cookies
        // this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any
    {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void
    {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }
}
