import { Firestore } from '@google-cloud/firestore'
import { DefaultContext } from './context'
import { Context } from './types/context'
import { Document } from './types/document'
import { Collection } from './collection'

export class Blazestore {
  private _firestore: Firestore
  private _ctx: DefaultContext

  constructor(firestore: Firestore) {
    this._firestore = firestore
    this._ctx = new DefaultContext(firestore)
  }

  public get context(): Context {
    return this._ctx
  }

  collection<Doc extends Document>(path: string, subcollectionNames: string[] = []): Collection<Doc> {
    return new Collection(this._firestore.collection(path), this._ctx, subcollectionNames)
  }
}
