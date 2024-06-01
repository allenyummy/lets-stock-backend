// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { StocksService } from './stocks.class'


// Main data model schema
export const stocksSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    // user info
    userId: Type.String(),
    // meta
    dateTime: Type.String({ format: 'date-time' }),
    securityFirm: Type.Enum({ Cathay: '國泰證券', Capital: '群益證券', Ctbc: '中信證券' }),
    currency: Type.Enum({ Ntd: 'NTD', Usd: 'USD' }),
    // stock
    stockOperationCategory: Type.Enum({ Buy: 'buy', Sell: 'sell', Dividend: 'dividend' }),
    stockCode: Type.String(),
    stockShareNum: Type.Number(),
    stockPricePerShare: Type.Number(),
    stockDividendPerShare: Type.Number(),
    // price
    totalFee: Type.Number(),
    totalTax: Type.Number(),
    totalAmount: Type.Number()
  },
  { $id: 'Stocks', additionalProperties: false }
)
export type Stocks = Static<typeof stocksSchema>
export const stocksValidator = getValidator(stocksSchema, dataValidator)
export const stocksResolver = resolve<Stocks, HookContext<StocksService>>({})

export const stocksExternalResolver = resolve<Stocks, HookContext<StocksService>>({})

// Schema for creating new entries
export const stocksDataSchema = Type.Pick(
  stocksSchema,
  [
    'userId',
    'dateTime',
    'securityFirm',
    'stockOperationCategory',
    'currency',
    'stockCode',
    'stockShareNum',
    'stockPricePerShare',
    'stockDividendPerShare',
    'totalFee',
    'totalTax',
    'totalAmount'
  ],
  {
    $id: 'StocksData'
  }
)
export type StocksData = Static<typeof stocksDataSchema>
export const stocksDataValidator = getValidator(stocksDataSchema, dataValidator)
export const stocksDataResolver = resolve<Stocks, HookContext<StocksService>>({})

// Schema for updating existing entries
export const stocksPatchSchema = Type.Partial(stocksSchema, {
  $id: 'StocksPatch'
})
export type StocksPatch = Static<typeof stocksPatchSchema>
export const stocksPatchValidator = getValidator(stocksPatchSchema, dataValidator)
export const stocksPatchResolver = resolve<Stocks, HookContext<StocksService>>({})

// Schema for allowed query properties
export const stocksQueryProperties = Type.Pick(stocksSchema, [
  '_id',
  'userId',
  'dateTime',
  'securityFirm',
  'stockOperationCategory',
  'stockCode'
])
export const stocksQuerySchema = Type.Intersect(
  [
    querySyntax(stocksQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type StocksQuery = Static<typeof stocksQuerySchema>
export const stocksQueryValidator = getValidator(stocksQuerySchema, queryValidator)
export const stocksQueryResolver = resolve<StocksQuery, HookContext<StocksService>>({})
