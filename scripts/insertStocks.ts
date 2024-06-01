import * as ExcelJS from 'exceljs'
import dayjs from 'dayjs'
import axios from 'axios'

const filePath = 'scripts/江的投資.xlsx'
const sheetName = '操作記錄'

interface RecordSchema {
  userId: string
  dateTime: string
  securityFirm: string
  stockOperationCategory: string
  currency: string
  stockCode: string
  stockShareNum: number
  stockPricePerShare: number
  stockDividendPerShare: number
  totalFee: number
  totalTax: number
  totalAmount: number
}

const readExcel = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet = workbook.getWorksheet('操作記錄')

  const columns = [
    /** 日期 */
    'dateTime',
    /** 證券商 */
    'securityFirm',
    /** 操作類別 */
    'stockOperationCategory',
    /** 股票代碼 */
    'stockCode',
    /** 股數 */
    'stockShareNum',
    /** 每股股價 */
    'stockPricePerShare',
    /** 每股股息 */
    'stockDividendPerShare',
    /** 總手續費 */
    'totalFee',
    /** 總交易稅 */
    'totalTax',
    /** 總金額 */
    'totalAmount',
    /** 幣別 */
    'currency'
  ]

  const records: RecordSchema[] = []
  worksheet?.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }

    // init record
    const record: RecordSchema = {
      userId: 'allenyummy',
      dateTime: '',
      securityFirm: '',
      stockOperationCategory: '',
      currency: 'NTD',
      stockCode: '',
      stockShareNum: 0,
      stockPricePerShare: 0,
      stockDividendPerShare: 0,
      totalFee: 0,
      totalTax: 0,
      totalAmount: 0
    }

    // raw data
    row.eachCell((cell, colNumber) => {
      if (cell.value === undefined || cell.value === null) {
        return
      }

      if (colNumber === 1) {
        record.dateTime = dayjs(cell.value.toString()).toISOString() ?? ''
      } else if (colNumber === 2) {
        record.securityFirm = cell.value.toString() ?? ''
      } else if (colNumber === 3) {
        const value = cell.value.toString() ?? ''
        if (value === '買') {
          record.stockOperationCategory = 'buy'
        } else if (value === '賣') {
          record.stockOperationCategory = 'sell'
        } else if (value === '息') {
          record.stockOperationCategory = 'dividend'
        } else {
          record.stockOperationCategory = ''
        }
      } else if (colNumber === 4) {
        record.stockCode = cell.value.toString() ?? ''
      } else if (colNumber === 5) {
        record.stockShareNum = +cell.value.toString() ?? 0
      } else if (colNumber === 6) {
        if (record.stockOperationCategory === 'dividend') {
          record.stockDividendPerShare = +cell.value.toString() ?? 0
        } else if (record.stockOperationCategory === 'buy' || record.stockOperationCategory === 'sell') {
          record.stockPricePerShare = +cell.value.toString() ?? 0
        }
      } else if (colNumber === 8) {
        record.totalFee = +cell.value.toString() ?? 0
      } else if (colNumber === 9) {
        record.totalTax = +cell.value.toString() ?? 0
      } else if (colNumber === 11) {
        record.totalAmount = +cell.value.toString() ?? 0
      }
    })

    // // calculate total amount
    // let calTotalAmount = 0
    // if (record.stockOperationCategory === 'dividend') {
    //   calTotalAmount =
    //     Math.round(record.stockShareNum * record.stockDividendPerShare) - record.totalFee - record.totalTax
    // } else if (record.stockOperationCategory === 'buy') {
    //   calTotalAmount =
    //     -Math.round(record.stockShareNum * record.stockPricePerShare) - record.totalFee - record.totalTax
    // } else if (record.stockOperationCategory === 'sell') {
    //   calTotalAmount =
    //     Math.round(record.stockShareNum * record.stockPricePerShare) - record.totalFee - record.totalTax
    // }

    // if (record.totalAmount !== calTotalAmount) {
    //   console.log(
    //     record,
    //     `${calTotalAmount}, ${Math.round(record.stockShareNum * record.stockPricePerShare)})`
    //   )
    // }

    records.push(record)
  })
  return records
}

const authentication = async () => {
  const response = await axios.post('http://localhost:3030/authentication', {
    email: 'allenyummy@gmail.com',
    password: 'supersecret',
    strategy: 'local'
  })
  const accessToken = response.data.accessToken
  return accessToken
}

const insertStocks = async (records: RecordSchema[], accessToken: string) => {
  await axios.post('http://localhost:3030/stocks', records, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

const removeStocks = async (accessToken: string) => {
  await axios.delete('http://localhost:3030/stocks?userId=allenyummy', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

const main = async () => {
  const records = await readExcel(filePath)

  // const accessToken = await authentication()

  // insertStocks(records, accessToken)
}

main()
