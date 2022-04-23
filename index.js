const Corestore = require('corestore')
const Hyperbee = require('hyperbee')
const { homedir } = require('os')
const { join } = require('path')
const http = require('http')
const { readFile } = require('fs').promises

const init = async () => {
    const store = new Corestore(join(homedir(), '.hyperblog'))
    await store.ready()
    const core = store.get({ name: 'hyperblog' })
    const bee = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'binary' })
    await core.ready()
    await bee.ready()
    return { store, bee }
}

const add = async (path, bee) => {
    const content = bee.sub('content')
    const data = await readFile(path)
    const timestamp = Date.now()
    await content.put(timestamp, data)
}

const follow = async (name, publicKey, bee) => {
    const following = bee.sub('following')
    await bee.put(name, publicKey)
}

const unfollow = async (name, publicKey, bee) => {
    const following = bee.sub('following')
    await bee.delete(name)

}

const view = async (number) => {

}

const server = async () => {

}

const main = async () => {

}
