// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  iamDataValidator,
  iamPatchValidator,
  iamQueryValidator,
  iamResolver,
  iamExternalResolver,
  iamDataResolver,
  iamPatchResolver,
  iamQueryResolver
} from './iam.schema'

import type { Application } from '../../declarations'
import { IamService, getOptions } from './iam.class'
import { iamPath, iamMethods } from './iam.shared'

export * from './iam.class'
export * from './iam.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const iam = (app: Application) => {
  // Register our service on the Feathers application
  app.use(iamPath, new IamService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: iamMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(iamPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(iamExternalResolver), schemaHooks.resolveResult(iamResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(iamQueryValidator), schemaHooks.resolveQuery(iamQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(iamDataValidator), schemaHooks.resolveData(iamDataResolver)],
      patch: [schemaHooks.validateData(iamPatchValidator), schemaHooks.resolveData(iamPatchResolver)],
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
    [iamPath]: IamService
  }
}
