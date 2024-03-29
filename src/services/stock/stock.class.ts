// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Stock, StockData, StockPatch, StockQuery } from './stock.schema'

export type { Stock, StockData, StockPatch, StockQuery }

export interface StockParams extends MongoDBAdapterParams<StockQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class StockService<ServiceParams extends Params = StockParams> extends MongoDBService<
  Stock,
  StockData,
  StockParams,
  StockPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('stock'))
  }
}
