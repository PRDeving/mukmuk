const jsf = require('json-schema-faker')
const { readdirSync } = require('fs')

const MOCKS_ROOT_DIR = process.env.MOCKS_ROOT_DIR || '../mocks'
const BASE = `${__dirname}/${MOCKS_ROOT_DIR}`

jsf.option({
  fixedProbabilities: true,
  alwaysFakeOptionals: true,
})

const getEndpoints = (prefix = '', source = '') => {
  const path = `${prefix}/${source}`.replace(/^\/+/, '')
  const subDirectories = readdirSync(`${BASE}/${path}`, { withFileTypes: true })

  const routes = {}
  const sub = subDirectories.map(dir => {
    if (dir.isDirectory()) return getEndpoints(path, dir.name)

    const [input, endpoint, type] = dir.name.match(/(\S+)\.(data|request|response)\.json/)
    if (!routes[endpoint]) routes[endpoint] = {
      path: `/${path}/${endpoint}`
    }
    routes[endpoint][type] = true
  })

  return [
    ...Object.keys(routes).map(k => routes[k]),
    ...sub
  ].flat().filter(i => !!i && Object.keys(i).length && (i.data || i.response))
}

const mocks =  getEndpoints().map(endpoint => {
  return ({
    path: endpoint.path.replace(/\/\//g, '/'),
    template: (() => {
      if (endpoint.data) return require(`${BASE}/${endpoint.path}.data.json`, 'utf8')
      if (!endpoint.response) return ({ status: 'ko' })

      const schema = require(`${BASE}/${endpoint.path}.response.json`, 'utf8')
      return jsf.generate(schema)
    })()
  })
})

module.exports = mocks
