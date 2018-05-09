import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Transaction } from './transaction';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TransactionService {

  private transactionsUrl = 'api/transactions';  // URL to web api
  

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET transactions from the server */
  getTransactions (): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsUrl)
      .pipe(
        tap(transactions => this.log(`fetched transactions`)),
        catchError(this.handleError('getTransactions', []))
      );
  }

  /** GET transaction by id. Return `undefined` when id not found */
  getTransactionNo404<Data>(id: number): Observable<Transaction> {
    const url = `${this.transactionsUrl}/?id=${id}`;
    return this.http.get<Transaction[]>(url)
      .pipe(
        map(transactions => transactions[0]), // returns a {0|1} element array
        tap(t => {
          const outcome = t ? `fetched` : `did not find`;
          this.log(`${outcome} transaction id=${id}`);
        }),
        catchError(this.handleError<Transaction>(`getTransaction id=${id}`))
      );
  }

  /** GET transaction by id. Will 404 if id not found */
  getTransaction(id: number): Observable<Transaction> {
    const url = `${this.transactionsUrl}/${id}`;
    return this.http.get<Transaction>(url).pipe(
      tap(_ => this.log(`fetched transaction id=${id}`)),
      catchError(this.handleError<Transaction>(`getTransaction id=${id}`))
    );
  }

  /* GET transactions whose name contains search term */
  searchTransactions(term: string): Observable<Transaction[]> {
    if (!term.trim()) {
      // if not search term, return empty transaction array.
      return of([]);
    }
    return this.http.get<Transaction[]>(`api/transactions/?name=${term}`).pipe(
      tap(_ => this.log(`found transactions matching "${term}"`)),
      catchError(this.handleError<Transaction[]>('searchTransactions', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new transaction to the server */
  addTransaction (transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionsUrl, transaction, httpOptions).pipe(
      tap((transaction: Transaction) => this.log(`added transaction w/ id=${transaction.id}`)),
      catchError(this.handleError<Transaction>('addTransaction'))
    );
  }

  /** DELETE: delete the transaction from the server */
  deleteTransaction (transaction: Transaction | number): Observable<Transaction> {
    const id = typeof transaction === 'number' ? transaction : transaction.id;
    const url = `${this.transactionsUrl}/${id}`;

    return this.http.delete<Transaction>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted transaction id=${id}`)),
      catchError(this.handleError<Transaction>('deleteTransaction'))
    );
  }

  /** PUT: update the transaction on the server */
  updateTransaction (transaction: Transaction): Observable<any> {
    return this.http.put(this.transactionsUrl, transaction, httpOptions).pipe(
      tap(_ => this.log(`updated transaction id=${transaction.id}`)),
      catchError(this.handleError<any>('updateTransaction'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TransactionService message with the MessageService */
  private log(message: string) {
    this.messageService.add('TransactionService: ' + message);
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/