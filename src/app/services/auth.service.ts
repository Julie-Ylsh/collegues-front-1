import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Authentification } from '../models/Authentification';
import { Observable, Subject } from 'rxjs';
import { UserConnecte } from '../models/UserConnecte';
import { tap, map, catchError } from 'rxjs/operators';
import { Password } from '../models/Password';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	URL_BACKEND: string = environment.backendUrl;

	user = new Subject<UserConnecte>();

	connecte: boolean;

	constructor(private _http: HttpClient) { }

	connexion (auth: Authentification): Observable<UserConnecte> {
		return this._http.post<UserConnecte>(`${this.URL_BACKEND}/auth`, auth, { withCredentials: true })
		.pipe(
			tap(() => this.connecte = true)
		);
	}

	deconnexion () {
		return this._http.post(`${this.URL_BACKEND}/logout`, null, { withCredentials: true })
			.pipe(
				tap(
					ko => this.connecte = false
				)
			);
	}

	getUser (): Observable<UserConnecte> {
		return this._http.get<UserConnecte>(`${this.URL_BACKEND}/me`, { withCredentials: true });
	}

	modifierMotDePasse (password: Password): Observable<string> {
		return this._http.post<string>(`${this.URL_BACKEND}/profil`, password, { withCredentials: true });
	}

	isLoggedIn (): Observable<boolean> {

		return this.getUser().pipe(
			tap(
				user => {
					this.user.next(user);
					this.connecte = true;
				} 
			), 
			map(user => true)
		)
	}

}
