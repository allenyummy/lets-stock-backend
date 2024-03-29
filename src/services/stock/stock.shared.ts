// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Stock, StockData, StockPatch, StockQuery, StockService } from './stock.class'

export type { Stock, StockData, StockPatch, StockQuery }

export type StockClientService = Pick<StockService<Params<StockQuery>>, (typeof stockMethods)[number]>

export const stockPath = 'stock'

export const stockMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const stockClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(stockPath, connection.service(stockPath), {
    methods: stockMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [stockPath]: StockClientService
  }
}
