const fs = require('fs')

const FALLBACK = process.env.FALLBACK || process.env.fallback || false
fs.existsSync('src/dyson.json') && fs.unlinkSync('src/dyson.json')
if (!FALLBACK) return

console.log('fallback set for %s', FALLBACK)
const [proxyHost, proxyPort] = FALLBACK.split(/\:(\d+)/)
fs.writeFileSync('src/dyson.json', JSON.stringify({
    proxy: true,
    proxyHost,
    proxyPort,
}));
