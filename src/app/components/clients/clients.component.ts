import { AddClientAction, DeleteClientAction, EditClientAction } from '../../core/store/clients';
import { getClients, State } from '../../core/store/index.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Client, GetClientsAction } from '../../core/store/clients/index';
import { GoAction } from '../../core/store/router/index';
import { MatDialog } from '@angular/material';
import { SignupComponent } from '../auth/signup/signup.component';
import { AddClientDialogComponent } from './add-client-dialog/add-client-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Observable<Client[]>;

  constructor(private store: Store<State>, private dialog: MatDialog) { }

  ngOnInit() {
    this.clients = this.store.select(getClients);

    setTimeout(() => {
      this.store.dispatch(new GetClientsAction());
    });
  }

  addClient() {
    const dialogRef = this.dialog.open(AddClientDialogComponent);

    dialogRef.componentInstance.submit.subscribe((client: Client) => {
      this.store.dispatch(new AddClientAction(client));
    });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      data: client
    });

    dialogRef.componentInstance.submit.subscribe((editedClient: Client) => {
      this.store.dispatch(new EditClientAction(editedClient));
    });
  }

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        question: 'Are you sure you want to delete the client?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(new DeleteClientAction(client));
      }
    });
  }
}