// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Stocks, StocksData, StocksPatch, StocksQuery, StocksService } from './stocks.class'

export type { Stocks, StocksData, StocksPatch, StocksQuery }

export type StocksClientService = Pick<StocksService<Params<StocksQuery>>, (typeof stocksMethods)[number]>

export const stocksPath = 'stocks'

export const stocksMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const stocksClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(stocksPath, connection.service(stocksPath), {
    methods: stocksMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [stocksPath]: StocksClientService
  }
}
