const xlsx = require('xlsx')
const path = require('path')
const superagent = require('superagent')
const schemas = require('./schemas') // documento donde capture todos los schemas por collecion suponiendo que tenemos un mapa planeado y correcto de las mismas

const mainHeaders = getHeaders(schemas.mainSchema)
const productHeaders = getHeaders(schemas.productSchema)
const subPorductHeaders = getHeaders(schemas.ProductosPendientesSchema)

/**
 * * Function to pass data (served by the api) to xlsx file
 */
const generatedXLSXFile = async () => {
  try {
    const { body } = await superagent.get(
      'https://apphive-test-examples.s3.amazonaws.com/database1.json'
    )

    const collection = body
    const saveData = storage()

    sortById({
      mainId: null,
      collection,
      headers: mainHeaders,
      logger: saveData,
      loggerName: 'main'
    })

    const dataForFile = saveData()
    const workBook = xlsx.utils.book_new()

    const wsMain = xlsx.utils.json_to_sheet(dataForFile.main)
    const wsProductos = xlsx.utils.json_to_sheet(dataForFile.Productos)
    const wsProductosPendientes = xlsx.utils.json_to_sheet(
      dataForFile.ProductosPendientes
    )
    const wsProductosRecolectados = xlsx.utils.json_to_sheet(
      dataForFile.ProductosRecolectados
    )

    xlsx.utils.book_append_sheet(workBook, wsMain, 'main')
    xlsx.utils.book_append_sheet(workBook, wsProductos, 'Productos')
    xlsx.utils.book_append_sheet(
      workBook,
      wsProductosPendientes,
      'ProductosPendientes'
    )
    xlsx.utils.book_append_sheet(
      workBook,
      wsProductosRecolectados,
      'ProductosRecolectados'
    )

    xlsx.writeFile(workBook, path.join(process.cwd(), 'dist', 'test.xlsx'))
  } catch (err) {
    console.error(err)
  }
}

generatedXLSXFile()
  .then(() => process.exit(0))
  .catch((err) => process.exit(1))

/**
 * * Function to get all ids in a Collection
 * @param {Object} data representing all collection
 * @returns {string[]} representing all ids in collection
 */
function getCollectionIds (data = {}) {
  return Object.keys(data)
}

/**
 * * Function to get all headers in a Collection Schema
 * @param {Object} data representing a collection schema
 * @returns {string[]} representing headers in a collection schema
 */
function getHeaders (data = {}) {
  return Object.keys(data)
}

/**
 * * Function to save data per WorBookSheet
 * @returns {Closure}
 */
function storage () {
  const file = {
    main: [],
    Productos: [],
    ProductosPendientes: [],
    ProductosRecolectados: []
  }
  return (type, row) => {
    if (!row) return file
    switch (type) {
      case 'Productos':
        file.Productos.push(row)
        break
      case 'ProductosPendientes':
        file.ProductosPendientes.push(row)
        break
      case 'ProductosRecolectados':
        file.ProductosRecolectados.push(row)
        break
      default:
        file.main.push(row)
    }
  }
}

/**
 * * Function to process data, format and save in logger
 * @param {string} config.mainId representing a main id to reference the current data
 * @param {Object} config.collection representing the data to process
 * @param {string[]} config.headers representing the workSheet headers
 * @param {function} config.logger representing the logger were all data was saved
 * @param {string} config.loggerName representing the collectionName
 */
function sortById ({ mainId = '', collection, headers, logger, loggerName }) {
  const collectionMainIds = getCollectionIds(collection)
  for (const id of collectionMainIds) {
    const row = collection[id]
    const rowWithIds = {
      ...(mainId ? { mainId } : {}),
      id,
      ...row
    }

    const mainRowFormated = formatRow(rowWithIds, headers)

    logger(loggerName, mainRowFormated)

    if (row.ProductosPendientes) {
      sortById({
        mainId: id,
        collection: row.ProductosPendientes,
        headers: subPorductHeaders,
        logger,
        loggerName: 'ProductosPendientes'
      })
    }
    if (row.ProductosRecolectados) {
      sortById({
        mainId: id,
        collection: row.ProductosRecolectados,
        headers: subPorductHeaders,
        logger,
        loggerName: 'ProductosRecolectados'
      })
    }
    if (row.Productos) {
      sortById({
        mainId: id,
        collection: row.Productos,
        headers: productHeaders,
        logger,
        loggerName: 'Productos'
      })
    }
  }
}

/**
 * * Function to format row by headers
 * @param {Object} row representing a workSheet row
 * @param {string[]} headers representing a workSheet headers
 */
function formatRow (row, headers) {
  return headers.reduce((acc, key) => {
    acc[key] = row[key] || ''
    return acc
  }, {})
}
