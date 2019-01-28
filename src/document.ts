import { Document, WithoutID } from './types/document'
import { Context, ReadContext, WriteContext } from './types/context'
import { IncomingTransformer, OutgoingTransformer } from './transform'
import { DocumentReference as FirestoreDocumentReference } from '@google-cloud/firestore'

export class DocumentReference<T extends Document> {
  private _docRef: FirestoreDocumentReference
  private _ctx: Context
  private _incoming: IncomingTransformer<T>
  private _outgoing: OutgoingTransformer<T>

  constructor(docRef: FirestoreDocumentReference, ctx: Context, incoming: IncomingTransformer<T>, outgoing: OutgoingTransformer<T>) {
    this._docRef = docRef
    this._ctx = ctx
    this._incoming = incoming
    this._outgoing = outgoing
  }

  get firestoreDocRef(): FirestoreDocumentReference {
    return this._docRef
  }

  async get(context?: ReadContext): Promise<T | undefined> {
    context = context || this._ctx
    return this._incoming(await context.get(this._docRef))
  }

  async set(data: WithoutID<T>, context?: WriteContext): Promise<void> {
    context = context || this._ctx
    await context.set(this._docRef, this._outgoing(data as any))
  }

  async delete(context?: WriteContext): Promise<void> {
    context = context || this._ctx
    await context.delete(this._docRef)
  }
}
