// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Iam, IamData, IamPatch, IamQuery } from './iam.schema'

export type { Iam, IamData, IamPatch, IamQuery }

export interface IamParams extends MongoDBAdapterParams<IamQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class IamService<ServiceParams extends Params = IamParams> extends MongoDBService<
  Iam,
  IamData,
  IamParams,
  IamPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('iam'))
  }
}
