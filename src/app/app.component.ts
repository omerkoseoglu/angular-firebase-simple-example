import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

export interface Item {
  title: string;
  language: string;
  description: string;
  date: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'programmingtips';

  loading: boolean = true;
  itemCollection: Observable<any[]>;
  items: Item[] = [];

  private unsubscribe$ = new Subject<void>();
  
  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.itemCollection = this.db.collection('items').valueChanges();

    this.itemCollection
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(data => {
        this.items = data;
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
