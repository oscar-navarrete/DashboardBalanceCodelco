import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment.prod';
import { AuthService } from '../../services/auth.service';
import { FuseUtils } from '@fuse/utils';
import { User, UserGroup, Favorites } from 'app/main/models/security.model';
import { Notification } from '../../models/security.model';
import { FunctionsService } from '../../services/functions.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements Resolve<any> {

  onUsersChanged: BehaviorSubject<any>;
  onSelectedUsersChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  users: User[];
  userGroups: UserGroup[];
  user: any;
  selectedUsers: string[] = [];
  userConnected: any;

  filterBy: string;
  searchText: string;

  constructor(private _httpClient: HttpClient, private _auth: AuthService, private _functions: FunctionsService)  {
      // Set the defaults
      this.onUsersChanged = new BehaviorSubject([]);
      this.onSelectedUsersChanged = new BehaviorSubject([]);
      this.onUserDataChanged = new BehaviorSubject([]);
      this.onSearchTextChanged = new Subject();
      this.onFilterChanged = new Subject();
      this.userConnected = this._auth.user;
  }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getUsers(),
                this.getGroups(),
                this.getUserData(),
            ]).then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUsers();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUsers();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getGroups(): Promise<any> {
        return new Promise((resolve, reject) => {
          const url: string = environment.api_server + 'roles/list-all';
          const headers = new HttpHeaders({
                'auth-token': this._auth.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.get(url, { headers }).subscribe((response: any) => {
          this.userGroups = response.data;
          resolve(this.userGroups);
                        }, reject);
            }
        );
    }

    search(searchText: string): void {
        this.searchText = searchText;
        this.getUsers();
    }

    getUsers(data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
          if (data) {
                this.filterBy = data.filterBy; 
          }
          const url: string = environment.api_server + 'user/list-all';
          const headers = new HttpHeaders({
                'auth-token': this._auth.token,
                'system_id': environment.system_identifier
          });
          this._httpClient.get(url, { headers }).subscribe((response: any) => {

          this.users = response.data;

          this.filterBy = this.filterBy || 'active';
          if ( this.filterBy !== '') {

            if (this.filterBy === 'lock') {
                this.users = this.users.filter( _user => {
                    return _user.locked === true;
                });
    
            } else if (this.filterBy === 'active') {
                this.users = this.users.filter( _user => {
                    return _user.locked === false && _user.enabled === true;
                });
    
            } else if (this.filterBy === 'disabled') {
                this.users = this.users.filter( _user => {
                    return _user.enabled === false;
                });
    
            } else {
                this.users = this.users.filter( _user => {
                    return _user.groups.includes(this.filterBy);
                });
            }
        }
   
          if ( this.searchText && this.searchText !== '' ) {
                this.users = FuseUtils.filterArrayByString(this.users, this.searchText);
            }
    
          this.users = this.users.map((_user: any) => {
                                return new User(_user);
                            });

          this.onUsersChanged.next(this.users);
          resolve(this.users);
                        }, reject);
            }
        );
    }

    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'user/75E38CBD-1885-4688-820C-5A1B8394929A';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });
            this._httpClient.get(url, { headers }).subscribe((response: any) => {
                        this.user = response.data.response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    getUserByToken(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'user';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });
            this._httpClient.get(url, { headers }).subscribe((response: any) => {
                        resolve(response.data.response);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedUsers.length > 0 )
        {
            const index = this.selectedUsers.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedUsers.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsersChanged.next(this.selectedUsers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsers.push(id);
        console.log(this.selectedUsers);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedUsers.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void
    {
        this.selectedUsers = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedUsers = [];
            this.users.map(contact => {
                this.selectedUsers.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(mode, contact): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let url: string = environment.api_server + 'user/create';
            if (mode === 'edit') {
                url = environment.api_server + 'user/update';
            }
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            this._httpClient.post(url, {...contact}, {headers})
                .subscribe((response: any) => {
                    if (response.ok === false) {
                        this._functions.notify(`Error al intentar realizar la actualización: ${response.message}`, 4000);
                        reject(response.message);
                        return false;
                    }

                    if (response.data.response.ok === false){
                        this._functions.notify(`Error al intentar realizar la actualización: ${response.data.response.message}`, 4000);
                        reject(response.data.response.message);
                        return false;
                    }
                    this.getUsers();
                    resolve(response);
                });
        });
    }


    sendNotification(message: Notification): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'notificator/message/' + message.recipient;
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            this._httpClient.post(url, {subject: message.subject, message: message.message}, {headers})
                .subscribe(response => {
                    resolve(response);
                });
        });
    }


    /**
     * Update Profile
     *
     * @param user
     * @returns {Promise<any>}
     */
    updateProfile(user): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'user/update-profile';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            this._httpClient.post(url, {...user}, {headers})
                .subscribe(response => {
                    console.log(response);
                    resolve(response);
                });
        });
    }


    /**
     * Update Profile Avatar
     *
     * @param file
     * @returns {Promise<any>}
     */
    updateAvatar(fileToUpload): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'user/upload-avatar';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            const formData: FormData = new FormData();
            formData.append('file', fileToUpload, fileToUpload.name);
            this._httpClient.post(url, formData, {headers})
                .subscribe(response => {
                    resolve(response);
                });
        });
    }


    /**
     * Update Profile Avatar
     *
     * @param file
     * @returns {Promise<any>}
     */
    updateUserAvatar(fileToUpload, user: User): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const url: string = environment.api_server + 'user/upload-user-avatar';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            const formData: FormData = new FormData();
            formData.append('file', fileToUpload, fileToUpload.name);
            formData.append('id', user.id);
            formData.append('prefix', user.prefix);
            this._httpClient.post(url, formData, {headers})
                .subscribe(response => {
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getUsers();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void
    {
        this.selectedUsers = [];

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    deleteContact(contact, refresh = true): Promise<any>
    {
        return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'user/delete';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });

        this._httpClient.post(url, {...contact}, {headers})
            .subscribe(response => {
                if (refresh) {
                    this.getUsers();
                }
                resolve(response);
            });
        });
    }

    enableDisableContact(enabled: boolean, contact): Promise<any>
    {
        return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'user/enable-disable';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });
        contact.enabled = enabled;

        this._httpClient.post(url, {...contact}, {headers})
            .subscribe(response => {
                this.getUsers();
                resolve(response);
            });
        });
    }

    lockUnlockContact(locked: boolean, contact): Promise<any>
    {
        return new Promise((resolve, reject) => {
        const url: string = environment.api_server + 'user/lock-unlock';
        const headers = new HttpHeaders({
              'auth-token': this._auth.token,
              'system_id': environment.system_identifier
        });
        contact.locked = locked;

        this._httpClient.post(url, {...contact}, {headers})
            .subscribe(response => {
                this.getUsers();
                resolve(response);
            });
        });
    }

    actionGroup(data): Promise<any> {
        return new Promise((resolve, reject) => {
            let url: string = environment.api_server + 'permissions/add-rol-user';
            if (!data.checked) {
                url = environment.api_server + 'permissions/delete-rol-user';
            }
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });
            this._httpClient.post(url, {...data}, {headers})
                .subscribe((response: any) => {
                    if (response.ok) {
                        if (response.data.ok) {
                            this.users.find( _user => _user.id === data.user).groups = response.data.groups;
                        }
                    }
                    resolve(response);
                });
            });
    }

    /**
     * Delete selected contacts
     */
    async deleteSelectedUsers()
    {
        for await ( const contactId of this.selectedUsers )
        {
            const contact = this.users.find( _contact => {
                return _contact.id === contactId;
            });
            await this.deleteContact(contact, false).then ( (response) => {
                console.log(response);
            });
        }
        await this.getUsers();
        this.deselectContacts();
    }

    /**
     * Send Notifications to selected users
     */
    sendNotificationUsers(message: Notification): Promise<any>
    {
        return new Promise( async(resolve, reject) => {
            const responses: any = [];
            for await ( const contactId of this.selectedUsers )
            {
                const contact = this.users.find(_contact => {
                    return _contact.id === contactId;
                });
                message.recipient = contact.id;
                await this.sendNotification(message).then( (response) => {
                    console.log(response);
                    responses.push(response);
                });
            }
            await this.deselectContacts();
            await console.log(responses);
            await resolve(responses);
        });
    }



    sendNotificationUsersSelected(message: Notification): Promise<any>
    {
        return new Promise( async(resolve, reject) => {
            const responses: any = [];
            const selecteds: any = [];
            for ( const user of this.selectedUsers )
            {
                selecteds.push({id: user});
            }

            const users = {users: selecteds, subject: message.subject, message: message.message};

            const url: string = environment.api_server + 'notificator/message/send-by-group';
            const headers = new HttpHeaders({
                  'auth-token': this._auth.token,
                  'system_id': environment.system_identifier
            });

            this._httpClient.post(url, users, {headers})
                .subscribe(response => {
                    resolve(response);
                    this.deselectContacts();

                });

            // resolve(users);
        });
    }


}
