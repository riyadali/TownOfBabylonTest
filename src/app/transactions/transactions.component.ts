import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Transaction }  from '../transaction';
import { TransactionService }  from '../transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: [ './transactions.component.scss' ]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[];

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions()
    .subscribe(transactions => this.transactions = transactions);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.transactionService.addTransaction({ name } as Transaction)
      .subscribe(hero => {
        this.transactions.push(hero);
      });
  }

  delete(transaction: Transaction): void {
    this.transactions = this.transactions.filter(t => t !== transaction);
    this.transactionService.deleteTransaction(transaction).subscribe();
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
