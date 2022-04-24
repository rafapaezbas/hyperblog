const Corestore = require('corestore')
const Hyperbee = require('hyperbee')
const { homedir } = require('os')
const { join } = require('path')
const http = require('http')
const { readFile } = require('fs').promises

const init = async (store) => {
  const contentCore = store.get({ name: 'hyperblog-content' })
  const followingCore = store.get({ name: 'hyperblog-following' })
  const content = new Hyperbee(contentCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  const following = new Hyperbee(followingCore, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
  await contentCore.ready()
  await followingCore.ready()
  return { following, content }
}

const add = async (path, content) => {
  const data = await readFile(path)
  const timestamp = Date.now()
  await content.put(timestamp, data)
}

const follow = async (name, publicKey, following) => {
  await following.put(name, publicKey)
}

const unfollow = async (name, publicKey, following) => {
  await following.delete(name)
}

const view = async (opts = {}) => {
  // get n recent posts from following

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
  server
}
