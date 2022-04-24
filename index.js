const Hyperswarm = require('hyperswarm')
const Hyperbee = require('hyperbee')
const http = require('http')
const { readFile } = require('fs').promises
const marked = require('marked')

const init = async (store) => {
  const contentCore = store.get({ name: 'hyperblog-content' })
  const followingCore = store.get({ name: 'hyperblog-following' })
  const content = new Hyperbee(contentCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  const following = new Hyperbee(followingCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  await contentCore.ready()
  await followingCore.ready()

  const swarm = new Hyperswarm()
  swarm.join(contentCore.discoveryKey)
  swarm.on('connection', connection => {
    const str = store.replicate(connection)
    str.on('error', e => console.log('replication error:', e))
  })

  return { following, content, swarm }
}

const replicate = async (key, swarm, store) => {
  const core = store.get({ key })
  await core.ready()
  swarm.join(core.discoveryKey)
}

const refresh = async (store, following, swarm) => {
  for await (const user of following.createReadStream()) {
    await replicate(user.value, swarm, store)
  }
  await swarm.flush()
}

const add = async (path, content) => {
  const data = await readFile(path)
  const timestamp = Date.now()
  await content.put(timestamp, data)
}

const follow = async (name, publicKey, following) => {
  await following.put(name, publicKey)
}

const unfollow = async (name, following) => {
  await following.delete(name)
}

const view = async (following, store, opts = {}) => {
  const entries = []
  marked.setOptions({ headerIds: false })

  for await (const user of following.createReadStream()) {
    const key = user.value
    const core = store.get({ key })
    await core.ready()
    const content = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
    await content.ready()

    for await (const entry of content.createReadStream()) {
      entries.push({ timestamp: entry.key, value: marked.parse(entry.value.toString()) })
    }
  }

  const sortByTimestamp = (a, b) => a.timestamp > b.timestamp ? 1 : -1
  return entries.sort(sortByTimestamp).map(e => marked.parse(e.value)).join('')
}

const server = async () => {

}

module.exports = {
  init,
  add,
  follow,
  unfollow,
  view,
  refresh,
  server,
  replicate
}
