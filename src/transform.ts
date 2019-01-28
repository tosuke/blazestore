import { Document } from './types/document'
import { DocumentSnapshot, DocumentData as FirestoreDocData} from '@google-cloud/firestore'

export type IncomingTransformer<T extends Document> = (doc: DocumentSnapshot) => T | undefined
export type OutgoingTransformer<T extends Document> = (data: Partial<T>) => [string | undefined, FirestoreDocData]

export function createIncomingTransformer<T extends Document>(subcollectionNames: string[]): IncomingTransformer<T> {
  return doc => {
    if (!doc.exists) return undefined
    let data: any = {
      id: doc.id,
      ...doc.data()
    }
    for(const name of subcollectionNames) {
      data[name] = doc.ref.collection(name) 
    }
    return data
  }
}

export function createOutgoingTransformer<T extends Document>(subcollectionNames: string[]): OutgoingTransformer<T> {
  return doc => {
    let data: FirestoreDocData = {
      ...doc
    }
    data.id = undefined
    for(const name of subcollectionNames) {
      data[name] = undefined
    }
    return [doc.id, data]
  }
}