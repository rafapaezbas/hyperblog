const Hyperswarm = require('hyperswarm')
const Corestore = require('corestore')
const Hyperbee = require('hyperbee')
const { homedir } = require('os')
const { join } = require('path')
const http = require('http')
const { readFile } = require('fs').promises
const marked = require('marked')

marked.setOptions({ headerIds: false })

const init = async (store) => {
  const contentCore = store.get({ name: 'hyperblog-content' })
  const followingCore = store.get({ name: 'hyperblog-following' })
  const content = new Hyperbee(contentCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  const following = new Hyperbee(followingCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  await contentCore.ready()
  await followingCore.ready()

  const swarm = new Hyperswarm()
  swarm.join(contentCore.discoveryKey)
  console.log('joining:', contentCore.discoveryKey)
  swarm.on('connection', connection => {
    const str = store.replicate(connection)
    str.on('error', e => console.log('replication error:', e))
  })

  return { following, content, swarm }
}

const replicate = async (key, swarm, store) => {
  const core = store.get({ key })
  await core.ready()
  console.log('replicating...', core.discoveryKey)
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
  const getBee = async (user) => {
    const key = user.value
    const core = store.get({ key })
    await core.ready()
    return new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  }

  const entries = []
  for await (const user of following.createReadStream()) {
    const content = await getBee(user)
    await content.ready()
    for await (const entry of content.createReadStream()) {
      entries.push({ timestamp: entry.key, value: marked.parse(entry.value.toString()) })
    }
  }

  const sortByTimestamp = (a, b) => a.timestamp > b.timestamp ? 1 : -1
  return entries.sort(sortByTimestamp).map(e => marked.parse(e.value))
}

const server = async () => {

}

const main = async () => {
  const store = new Corestore(join(homedir(), '.hyperblog'))
  await store.ready()
}

module.exports = {
  init,
  add,
  follow,
  unfollow,
  view,
  refresh,
  server
}
