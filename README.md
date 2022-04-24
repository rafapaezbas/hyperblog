# Hyperblog

Hyperblog es una plataforma descentralizada y P2P para blogueo. Hyperblog es una forma de compartir contenido estático 100% controlada por el usuario. Libre de publicidad y manipulación. 
Hyperblog está basada en Hypercore, una estructura distribuida de "solo-anexión". Esta estructura se replica entre usuarios sin necesidad de servidores centralizados. Los usuarios funcionan como servidores-espejo que ayudan a la difusión del contenido.

## Users

- Los usuarios de Hyperblog están identificados con la clave pública de un Hypercore, esto es diferente a la identificación de usuarios por alias (nickname). La identificación con clave pública pretendegenerar una identidad virtual disasociada de la identidad real. 
- Los usuario pueden seguir a otros usuarios.
- Cada vez que un usuario recibe el contenido de otro usuario, pasa a funcionar como servidor espejo de ese contenido.

## Content and format

- Cada publicación es un archivo en formato markdown. 
- El contenido no puede ser modificado o eliminado.

## Interface

## Cli

``` bash

npm install -g hyperblog

hyperblog add --file $file-path

hyperblog follow --name $name --key $public-key

hyperblog start --port $local-port

```
