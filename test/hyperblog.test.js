const test = require('brittle')
const ram = require('random-access-memory')
const Corestore = require('corestore')
const { join } = require('path')
const { init, add } = require('../')

test('adds file content to hyperbee', async ({ is, pass }) => {
  const store = new Corestore(ram)
  await store.ready()
  const { content } = await init(store)
  await add(join(__dirname, 'helper', 'file.md'), content)

  for await (const entry of content.createHistoryStream()) {
    const text = entry.value.toString()
    is('# Hello World!', text.trim(), 'Content added must be the same as the file')
  }
})
