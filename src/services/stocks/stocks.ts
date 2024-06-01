// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  stocksDataValidator,
  stocksPatchValidator,
  stocksQueryValidator,
  stocksResolver,
  stocksExternalResolver,
  stocksDataResolver,
  stocksPatchResolver,
  stocksQueryResolver
} from './stocks.schema'

import type { Application } from '../../declarations'
import { StocksService, getOptions } from './stocks.class'
import { stocksPath, stocksMethods } from './stocks.shared'

export * from './stocks.class'
export * from './stocks.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const stocks = (app: Application) => {
  // Register our service on the Feathers application
  app.use(stocksPath, new StocksService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: stocksMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(stocksPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(stocksExternalResolver),
        schemaHooks.resolveResult(stocksResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(stocksQueryValidator), schemaHooks.resolveQuery(stocksQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(stocksDataValidator), schemaHooks.resolveData(stocksDataResolver)],
      patch: [schemaHooks.validateData(stocksPatchValidator), schemaHooks.resolveData(stocksPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [stocksPath]: StocksService
  }
}
