import mongoose from 'mongoose'

export const connectMongo = async ({ uri, minPoolSize, maxPoolSize }) => {
  mongoose.set('strictQuery', true)

  const conn = mongoose.connection
  conn.on('error', (e) => {
    process.stderr.write(`mongo: connection error: ${e?.message || e}\n`)
  })
  conn.on('disconnected', () => {
    process.stderr.write('mongo: disconnected\n')
  })

  try {
    await mongoose.connect(uri, { minPoolSize, maxPoolSize })
    return mongoose.connection
  } catch (e) {
    const code = e?.code ? String(e.code) : ''
    const msg = e?.message ? String(e.message) : String(e)

    process.stderr.write(`mongo: connect failed\n`)
    const safeUri = String(uri).replace(/\/\/[^@]+@/, '//***:***@')
    process.stderr.write(`mongo: uri: ${safeUri}\n`)
    if (code) process.stderr.write(`mongo: error code: ${code}\n`)
    process.stderr.write(`mongo: error: ${msg}\n`)

    if (msg.includes('querySrv') || msg.includes('_mongodb._tcp')) {
      process.stderr.write(
        [
          'mongo: detected SRV DNS failure (mongodb+srv).',
          'mongo: this commonly happens when Node.js DNS (UDP 53) is blocked by firewall/VPN/router DNS.',
          'mongo: fixes:',
          '- allow node.exe through Windows Defender Firewall (Private network) for DNS, or disable VPN/security filter temporarily',
          '- change DNS to 1.1.1.1 / 8.8.8.8 on your adapter/router',
          '- OR (fastest workaround) use Atlas "Standard connection string" (mongodb://host1,host2,host3/...) instead of mongodb+srv',
          '',
        ].join('\n') + '\n'
      )
    }

    throw e
  }
}

export const getMongoInfo = (conn) => {
  const { name, host, port } = conn
  return { name, host, port }
}

