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
    // user info
    userId: Type.String(),
    // meta
    dateTime: Type.String({ format: 'date-time' }),
    securityFirm: Type.Enum({ Cathay: '國泰證券', Capital: '群益證券', Ctbc: '中信證券' }),
    // stock
    stockOperationCategory: Type.Enum({ Buy: 'buy', Sell: 'sell', Dividend: 'dividend' }),
    stockCode: Type.String(),
    stockNum: Type.Number(),
    stockPrice: Type.Number(),
    stockDividend: Type.Number(),
    // price
    totalFee: Type.Number(),
    totalTax: Type.Number(),
    totalAmount: Type.Number()
  },
  { $id: 'Stock', additionalProperties: false }
)
export type Stock = Static<typeof stockSchema>
export const stockValidator = getValidator(stockSchema, dataValidator)
export const stockResolver = resolve<Stock, HookContext<StockService>>({})

export const stockExternalResolver = resolve<Stock, HookContext<StockService>>({})

// Schema for creating new entries
export const stockDataSchema = Type.Pick(
  stockSchema,
  [
    'userId',
    'dateTime',
    'securityFirm',
    'stockOperationCategory',
    'stockCode',
    'stockNum',
    'stockPrice',
    'stockDividend',
    'totalFee',
    'totalTax',
    'totalAmount'
  ],
  {
    $id: 'StockData'
  }
)
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
export const stockQueryProperties = Type.Pick(stockSchema, [
  '_id',
  'securityFirm',
  'stockOperationCategory',
  'stockCode'
])

export const stockQuerySchema = Type.Intersect(
  [
    querySyntax(stockQueryProperties),
    Type.Object(
      {
        userId: Type.String(),
        beginDate: Type.Optional(Type.String({ format: 'date-time' })),
        endDate: Type.Optional(Type.String({ format: 'date-time' })),
      },
      { additionalProperties: false }
    )
  ],
  { additionalProperties: false }
)
export type StockQuery = Static<typeof stockQuerySchema>
export const stockQueryValidator = getValidator(stockQuerySchema, queryValidator)
export const stockQueryResolver = resolve<StockQuery, HookContext<StockService>>({})
