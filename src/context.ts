import { Context, ReadContext, WriteContext, SubscribeCb, Unsubscribe } from './types/context'
import {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  WriteBatch,
  WriteResult,
  Transaction,
} from '@google-cloud/firestore'

export class DefaultContext implements Context {
  private _f: Firestore

  constructor(firestore: Firestore) {
    this._f = firestore
  }

  get(ref: DocumentReference): Promise<DocumentSnapshot> {
    return ref.get()
  }

  getAll(refs: DocumentReference[]): Promise<DocumentSnapshot[]> {
    return this._f.getAll(...(refs as [DocumentReference, ...DocumentReference[]]))
  }

  query(query: Query): Promise<DocumentSnapshot[]> {
    return query.get().then(snapshot => snapshot.docs)
  }

  subscribeDoc(
    ref: DocumentReference,
    onSnapshot: SubscribeCb<DocumentSnapshot>,
    onError: SubscribeCb<Error>,
  ): Unsubscribe {
    return ref.onSnapshot(onSnapshot, onError)
  }

  subscribeQuery(query: Query, onSnapshot: SubscribeCb<QuerySnapshot>, onError: SubscribeCb<Error>): Unsubscribe {
    return query.onSnapshot(onSnapshot, onError)
  }

  create(ref: DocumentReference, data: any): Promise<unknown> {
    return ref.create(data)
  }

  delete(ref: DocumentReference): Promise<unknown> {
    return ref.delete()
  }

  set(ref: DocumentReference, data: any): Promise<unknown> {
    return ref.set(data)
  }

  update(ref: DocumentReference, data: any): Promise<unknown> {
    return ref.update(data)
  }
}

export class WriteBatchContext implements WriteContext {
  private _wb: WriteBatch

  constructor(writeBatch: WriteBatch) {
    this._wb = writeBatch
  }

  commit(): Promise<WriteResult[]> {
    return this._wb.commit()
  }

  create(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._wb.create(ref, data))
  }

  delete(ref: DocumentReference): Promise<unknown> {
    return Promise.resolve(this._wb.delete(ref))
  }

  set(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._wb.set(ref, data))
  }

  update(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._wb.update(ref, data))
  }
}

export class TransactionContext implements ReadContext, WriteContext {
  private _tx: Transaction

  constructor(tx: Transaction) {
    this._tx = tx
  }

  get(ref: DocumentReference): Promise<DocumentSnapshot> {
    return this._tx.get(ref)
  }

  getAll(refs: DocumentReference[]): Promise<DocumentSnapshot[]> {
    return this._tx.getAll(...(refs as [DocumentReference, ...DocumentReference[]]))
  }

  query(query: Query): Promise<DocumentSnapshot[]> {
    return this._tx.get(query).then(snapshot => snapshot.docs)
  }

  create(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._tx.create(ref, data))
  }

  delete(ref: DocumentReference): Promise<unknown> {
    return Promise.resolve(this._tx.delete(ref))
  }

  set(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._tx.set(ref, data))
  }

  update(ref: DocumentReference, data: any): Promise<unknown> {
    return Promise.resolve(this._tx.update(ref, data))
  }
}
