import { Component, OnInit } from '@angular/core';
import { Authentification } from '../models/Authentification';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-authentification',
	templateUrl: './authentification.component.html'
})
export class AuthentificationComponent implements OnInit {

	auth: Authentification = new Authentification();

	messageErreur: string;

	constructor(private _service: AuthService, private router: Router) { }

	connexion () {
		this._service.connexion(this.auth).subscribe(
			ok => {
				console.log("Connecté");
				this.router.navigate(["/accueil"]);
			},
			error => {
				this.messageErreur = "L'email ou le mot de passe sont invalides";
				setInterval(
					() => {
						this.messageErreur = undefined;
					}, 7000
				);
			}
		);
	}

	ngOnInit() {
	}

}
