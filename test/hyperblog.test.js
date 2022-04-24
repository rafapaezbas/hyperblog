const { test, solo } = require('brittle')
const ram = require('random-access-memory')
const Corestore = require('corestore')
const { join } = require('path')
const { init, add, follow, view, refresh } = require('../')

test('adds file content to hyperbee', async ({ is, teardown }) => {
  const store = new Corestore(ram)
  await store.ready()

  const { content, swarm } = await init(store)

  teardown(async () => {
    store.close()
    swarm.destroy()
  })

  await add(join(__dirname, 'helper', 'file.md'), content)

  for await (const entry of content.createHistoryStream()) {
    const text = entry.value.toString()
    is('# Hello World!', text.trim(), 'Content added must be the same as in file')
  }
})

test('user follows itself and creates view', async ({ is, pass, teardown }) => {
  const store = new Corestore(ram)
  await store.ready()

  const { content, following, swarm } = await init(store)

  teardown(async () => {
    store.close()
    swarm.destroy()
  })

  await add(join(__dirname, 'helper', 'file.md'), content)
  await add(join(__dirname, 'helper', 'file2.md'), content)
  await follow('username', content.feed.key, following)
  const text = await view(following, store)

  is('<h1>Hello World!</h1>\n<h2>Second entry</h2>', text.trim())
})

solo('user follows other and creates view', async ({ is, pass, teardown }) => {
  const storeA = new Corestore(ram)
  await storeA.ready()
  const storeB = new Corestore(ram)
  await storeB.ready()

  const userA = await init(storeA)
  const userB = await init(storeB)

  teardown(async () => {
    storeA.close()
    storeB.close()
    userA.swarm.destroy()
    userB.swarm.destroy()
  })

  await add(join(__dirname, 'helper', 'file.md'), userB.content)
  await follow('userB', userB.content.feed.key, userA.following)
  await refresh(storeA, userA.following, userA.swarm)

  await sleep()

  const text = await view(userA.following, storeA)

  is('<h1>Hello World!</h1>', text.trim())
})

async function sleep (time = 3000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
