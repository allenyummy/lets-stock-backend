// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { IamService } from './iam.class'

// Main data model schema
export const iamSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    email: Type.String(),
    password: Type.Optional(Type.String()),
    googleId: Type.Optional(Type.String())
  },
  { $id: 'Iam', additionalProperties: false }
)
export type Iam = Static<typeof iamSchema>
export const iamValidator = getValidator(iamSchema, dataValidator)
export const iamResolver = resolve<Iam, HookContext<IamService>>({})

export const iamExternalResolver = resolve<Iam, HookContext<IamService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const iamDataSchema = Type.Pick(iamSchema, ['email', 'password', 'googleId'], {
  $id: 'IamData'
})
export type IamData = Static<typeof iamDataSchema>
export const iamDataValidator = getValidator(iamDataSchema, dataValidator)
export const iamDataResolver = resolve<Iam, HookContext<IamService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const iamPatchSchema = Type.Partial(iamSchema, {
  $id: 'IamPatch'
})
export type IamPatch = Static<typeof iamPatchSchema>
export const iamPatchValidator = getValidator(iamPatchSchema, dataValidator)
export const iamPatchResolver = resolve<Iam, HookContext<IamService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const iamQueryProperties = Type.Pick(iamSchema, ['_id', 'email', 'googleId'])
export const iamQuerySchema = Type.Intersect(
  [
    querySyntax(iamQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type IamQuery = Static<typeof iamQuerySchema>
export const iamQueryValidator = getValidator(iamQuerySchema, queryValidator)
export const iamQueryResolver = resolve<IamQuery, HookContext<IamService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user._id
    }

    return value
  }
})
