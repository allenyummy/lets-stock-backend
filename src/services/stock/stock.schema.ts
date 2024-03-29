// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { StockService } from './stock.class'

// Main data model schema
export const stockSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    dateTime: Type.String({ format: 'date-time' }),
    stockNum: Type.Number(),
    stockCode: Type.String()
  },
  { $id: 'Stock', additionalProperties: false }
)
export type Stock = Static<typeof stockSchema>
export const stockValidator = getValidator(stockSchema, dataValidator)
export const stockResolver = resolve<Stock, HookContext<StockService>>({})

export const stockExternalResolver = resolve<Stock, HookContext<StockService>>({})

// Schema for creating new entries
export const stockDataSchema = Type.Pick(stockSchema, ['dateTime', 'stockNum', 'stockCode'], {
  $id: 'StockData'
})
export type StockData = Static<typeof stockDataSchema>
export const stockDataValidator = getValidator(stockDataSchema, dataValidator)
export const stockDataResolver = resolve<Stock, HookContext<StockService>>({})

// Schema for updating existing entries
export const stockPatchSchema = Type.Partial(stockSchema, {
  $id: 'StockPatch'
})
export type StockPatch = Static<typeof stockPatchSchema>
export const stockPatchValidator = getValidator(stockPatchSchema, dataValidator)
export const stockPatchResolver = resolve<Stock, HookContext<StockService>>({})

// Schema for allowed query properties
export const stockQueryProperties = Type.Pick(stockSchema, ['_id', 'dateTime', 'stockCode'])
export const stockQuerySchema = Type.Intersect(
  [
    querySyntax(stockQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type StockQuery = Static<typeof stockQuerySchema>
export const stockQueryValidator = getValidator(stockQuerySchema, queryValidator)
export const stockQueryResolver = resolve<StockQuery, HookContext<StockService>>({})
