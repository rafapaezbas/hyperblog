#!/usr/bin/env node
process.title = 'hyperblog'

const subcommand = require('subcommand')
const Corestore = require('corestore')
const { init, add, follow, replicate, view } = require('..')
const { homedir } = require('os')
const { join } = require('path')

const store = new Corestore(join(homedir(), '.hyperblog'))

const commands = [
  {
    name: 'add',
    command: async (args) => {
      const { content } = await init(store)
      await add(args.file, content)
      console.log('Added ' + args.file)
      process.exit(0)
    },
    options: [
      {
        name: 'file',
        abbr: 'f'
      }
    ]
  },
  {
    name: 'follow',
    command: async (args) => {
      const { following, swarm } = await init(store)
      await follow(args.name, Buffer.from(args.key, 'hex'), following)
      await replicate(Buffer.from(args.key, 'hex'), swarm, store)
      console.log('Following ' + args.key)
      process.exit(0)
    },
    options: [
      {
        name: 'name',
        abbr: 'n'
      },
      {
        name: 'key',
        abbr: 'k'
      }
    ]
  },
  {
    name: 'info',
    command: async (args) => {
      const { content } = await init(store)
      console.log(content.feed.key.toString('hex'))
      process.exit(0)
    }
  },
  {
    name: 'view',
    command: async (args) => {
      const { following } = await init(store)
      console.log(await view(following, store))
      process.exit(0)
    }
  }
]

const args = process.argv.slice(2)
const match = subcommand(commands)
const matched = match(args)
if (!matched) {
  process.exit(0)
}
