import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Transaction }         from '../transaction';
import { TransactionService }  from '../transaction.service';

@Component({
 selector: 'app-transaction-detail',
 templateUrl: './transaction-detail.component.html',
 styleUrls: [ './transaction-detail.component.scss' ]
})
export class TransactionDetailComponent implements OnInit {
 @Input() transaction: Transaction;

 constructor(
   private route: ActivatedRoute,
   private transactionService: TransactionService,
   private location: Location
 ) {}

 ngOnInit(): void {
   this.getTransaction();
 }

 getTransaction(): void {
   const id = +this.route.snapshot.paramMap.get('id');
   this.transactionService.getTransaction(id)
     .subscribe(transaction => this.transaction = transaction);
 }

 goBack(): void {
   this.location.back();
 }

save(): void {
   this.transactionService.updateTransaction(this.transaction)
     .subscribe(() => this.goBack());
 }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
