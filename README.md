# Hyperblog

Hyperblog is a decentralized and P2P platform for blogging. Hyperblog is a 100% user controlled way of sharing static content. Free of advertising and manipulation.
Hyperblog is based on Hypercore, a distributed "append-only" framework. This structure is replicated between users without the need for centralized servers. Users function as mirror servers that help spread content.

## Users

- Hyperblog users are identified with the public key of a Hypercore, this is different from the identification of users by alias (nickname). Public key identification aims to generate a virtual identity disassociated from the real identity.
- Users can follow other users.
- Every time a user receives content from another user, it starts to function as a mirror server for that content.

## Content and format

- Each publication is a file in markdown format.
- The content cannot be modified or deleted.

## Interface

## Cli

``` bash

npm install -g hyperblog

hyperblog add --file $file-path

hyperblog follow --name $name --key $public-key

hyperblog start --port $local-port

```
