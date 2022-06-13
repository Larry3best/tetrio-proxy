# TETR.IO - Self-Proxy

> This proxy is mainly used to bypass restrictions in some networks. Also, **this script is not associated with or created by [TETR.IO](https://tetr.io) or [osk](https://osk.sh)**

## Motivation

When I write this, I am a student in a french school. The thing is that when I'm bored in class,
I want to play TETR.IO but actually can't because of restrictions on the network.

So here my solution is to self-host a proxy on a VPS or a Raspberry PI at home, so you can
play TETR.IO without any restrictions !

## How it works ?

Basically, we download all the scripts and textures from TETR.IO and serve them ourselves so we can
bypass the Cloudflare browser check - that a lot of online proxies can't actually pass.

To accomplish this, I made a JS script in `./src/update.js` that updates and/or downloads the files from
TETR.IO.

## Usage

Before following these steps, check if you have installed Node.JS and PNPm.

1. Use `git` to clone this repository with `git clone https://github.com/Vexcited/tetrio-self-proxy`
2. Go into the created folder, `cd tetrio-self-proxy`
3. Install the dependencies, `pnpm install`
4. Run `pnpm refresh` to install/update the game files from TETR.IO
5. Run `pnpm start` and the web server will start on port `4080` by default.