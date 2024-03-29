// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  stockDataValidator,
  stockPatchValidator,
  stockQueryValidator,
  stockResolver,
  stockExternalResolver,
  stockDataResolver,
  stockPatchResolver,
  stockQueryResolver
} from './stock.schema'

import type { Application } from '../../declarations'
import { StockService, getOptions } from './stock.class'
import { stockPath, stockMethods } from './stock.shared'

export * from './stock.class'
export * from './stock.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const stock = (app: Application) => {
  // Register our service on the Feathers application
  app.use(stockPath, new StockService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: stockMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(stockPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(stockExternalResolver), schemaHooks.resolveResult(stockResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(stockQueryValidator), schemaHooks.resolveQuery(stockQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(stockDataValidator), schemaHooks.resolveData(stockDataResolver)],
      patch: [schemaHooks.validateData(stockPatchValidator), schemaHooks.resolveData(stockPatchResolver)],
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
    [stockPath]: StockService
  }
}
