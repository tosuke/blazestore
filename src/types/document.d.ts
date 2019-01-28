import { Timestamp, GeoPoint, DocumentSnapshot } from '@google-cloud/firestore'
import { Omit } from 'utility-types'

type FirestorePrimitiveType  = boolean | number | string | null | Buffer | Timestamp | GeoPoint
export type FirestoreType =
  | FirestorePrimitiveType
  | { [key: string]: FirestoreType }
  | Array<FirestorePrimitiveType | { [key: string]: FirestoreType }>

export type Document = { id: string } & { [key: string]: FirestoreType }

export type WithoutID<T extends Document> = Omit<T, 'id'> & { id?: string }
