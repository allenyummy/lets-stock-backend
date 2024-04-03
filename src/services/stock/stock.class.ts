// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import { isNil } from 'lodash'
import type { Params, Paginated } from '@feathersjs/feathers'
import type { PaginationOptions } from '@feathersjs/adapter-commons'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions, AdapterId } from '@feathersjs/mongodb'

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
> {
  async find(params?: StockParams & { paginate?: PaginationOptions }): Promise<Paginated<Stock>>
  async find(params?: StockParams & { paginate: false }): Promise<Stock[]>
  async find(params?: StockParams): Promise<Paginated<Stock> | Stock[]> {
    if (!isNil(params?.query?.beginDate) && !isNil(params?.query?.endDate)) {
      const { filters } = this.filterQuery(null, params || {})
      const { $limit: limit, $skip: skip } = filters
      const query = {
        userId: params?.query?.userId,
        dateTime: { $gte: params.query.beginDate, $lte: params.query.endDate }
      }
      const total = await (await this.getModel()).countDocuments(query)
      const result = await (await this.getModel()).find(query).skip(skip).limit(limit).toArray()
      return {
        total,
        limit,
        skip,
        data: result as any as Stock[]
      }
    }
    return super.find(params)
  }

  async get(id: AdapterId, params?: StockParams): Promise<Stock> {
    return super.get(id, params)
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('stock'))
  }
}
