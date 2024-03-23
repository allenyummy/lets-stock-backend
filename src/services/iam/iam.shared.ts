// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Iam, IamData, IamPatch, IamQuery, IamService } from './iam.class'

export type { Iam, IamData, IamPatch, IamQuery }

export type IamClientService = Pick<IamService<Params<IamQuery>>, (typeof iamMethods)[number]>

export const iamPath = 'iam'

export const iamMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const iamClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(iamPath, connection.service(iamPath), {
    methods: iamMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [iamPath]: IamClientService
  }
}
