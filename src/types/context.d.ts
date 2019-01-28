import {
  DocumentReference as FirestoreDocumentRef,
  DocumentSnapshot,
  Query as FirestoreQuery,
  QuerySnapshot,
} from '@google-cloud/firestore'

export type SubscribeCb<T> = (snapshot: T) => any
export type Unsubscribe = () => void

export interface ReadContext {
  get(ref: FirestoreDocumentRef): Promise<DocumentSnapshot>
  getAll(refs: FirestoreDocumentRef[]): Promise<DocumentSnapshot[]>
  query(query: FirestoreQuery): Promise<DocumentSnapshot[]>
}

export interface SubscribeContext {
  subscribeDoc(ref: FirestoreDocumentRef, onSnapshot: SubscribeCb<DocumentSnapshot>, onError: SubscribeCb<Error>): Unsubscribe
  subscribeQuery(query: FirestoreQuery, onSnapshot: SubscribeCb<QuerySnapshot>, onError: SubscribeCb<Error>): Unsubscribe
}

export interface WriteContext {
  create(ref: FirestoreDocumentRef, data: any): Promise<unknown>
  delete(ref: FirestoreDocumentRef): Promise<unknown>
  set(ref: FirestoreDocumentRef, data: any): Promise<unknown>
  update(ref: FirestoreDocumentRef, data: any): Promise<unknown>
}

export type Context = ReadContext & SubscribeContext & WriteContext
