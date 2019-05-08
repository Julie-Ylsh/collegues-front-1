import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import { Collegue } from '../models/Collegue';
import { ActivatedRoute } from '@angular/router';
import { Commentaire } from '../models/Commentaire';
import { NewCommentaire } from '../models/NewCommentaire';

@Component({
	selector: 'app-photo-detail',
	templateUrl: './photo-detail.component.html'
})
export class PhotoDetailComponent implements OnInit {

	matricule: string;
	collegue: Collegue;
	message: string;
	messageOk: string;
	erreur: string;
	newComment: NewCommentaire = new NewCommentaire();
	commentaires: Commentaire[];

	constructor(private _service: DataService, private route: ActivatedRoute) { }

	updateList(message: string): void {
		if (message) {
			this.erreur = message;
		}
		this._service.recupererCommentaires(this.matricule).subscribe(
			commentaireList => {
				this.commentaires = commentaireList;
				this.messageOk = `Le commentaire a été supprimé avec succès`;
				setInterval(
					() => {
						this.messageOk = undefined;
					}, 7000
				);
			},
			error => {
				this.message = `Un problème est survenu durant la suppression du commentaire: ${error.error}`;
				setInterval(
					() => {
						this.message = undefined;
					}, 7000
				);
			}
		);
	}

	saveNewComment(): void {
		if (this.newComment.contenu.length >= 5) {
			this._service.ajouterCommentaire(this.newComment, this.matricule).subscribe(
				ok => {
					this._service.recupererCommentaires(this.matricule).subscribe(
						commentaireList => this.commentaires = commentaireList,
						error => {}
					);
					this.messageOk = "Le commentaire a été ajouté avec succès";
					setInterval(
						() => {
							this.messageOk = undefined;
						}, 7000
					);
				},
				error => {
					this.message = `${error.error}`;
					setInterval(
						() => {
							this.message = undefined;
						}, 7000
					);
				}
			);
		}
	}

	ngOnInit() {
		
		this.matricule = this.route.snapshot.paramMap.get("matricule");
		
		this._service.recupererCollegueCourant(this.matricule).subscribe(
			collegue => this.collegue = collegue,
			error => this.message = `${error.error}`
		);

		this._service.recupererCommentaires(this.matricule).subscribe(
			commentaireList => this.commentaires = commentaireList,
			error => this.message = `${error.error}`
		);

	}

}
