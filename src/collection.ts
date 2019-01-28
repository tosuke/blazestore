import { Document } from './types/document'
import { Context, ReadContext, WriteContext } from './types/context'
import { CollectionReference } from '@google-cloud/firestore'
import { DocumentReference } from './document'
import {
  IncomingTransformer,
  OutgoingTransformer,
  createIncomingTransformer,
  createOutgoingTransformer,
} from './transform'

export class Collection<T extends Document> {
  private _col: CollectionReference
  private _ctx: Context
  private _incoming: IncomingTransformer<T>
  private _outgoing: OutgoingTransformer<T>

  constructor(collection: CollectionReference, context: Context, subcollectionNames: string[]) {
    this._col = collection
    this._ctx = context
    this._incoming = createIncomingTransformer(subcollectionNames)
    this._outgoing = createOutgoingTransformer(subcollectionNames)
  }

  get firestoreCollectionRef(): CollectionReference {
    return this._col
  }

  doc(id: string, context?: Context): DocumentReference<T> {
    context = context || this._ctx
    return new DocumentReference(this._col.doc(id), context, this._incoming, this._outgoing)
  }
}
