# TETR.IO - Self-Proxy

> This proxy is mainly used to bypass restrictions in some networks. Also, **this script is not associated with or created by [TETR.IO](https://tetr.io) or [osk](https://osk.sh)**.

## Motivation

When I write this, I am a student in a french school. The thing is that when I'm bored in class,
I want to play TETR.IO but actually can't because of restrictions on the network.

So here my solution is to self-host a proxy on a VPS or a Raspberry PI at home, so you can
play TETR.IO without any restrictions !

## How it works ?

Basically, we download all the resources from TETR.IO and serve them ourselves so we can bypass the Cloudflare browser check - that a lot of online proxies can't actually pass.

For API endpoints, we proxy them by updating the endpointsin the `public/js/tetrio.js` and `public/index.html` files.

## Usage

Before following these steps, check if you have installed Node.JS (`node -v`) and PNPm (`pnpm -v`).

1. Use `git` to clone this repository with `git clone https://github.com/Vexcited/tetrio-proxy`
2. Go into the created folder, `cd tetrio-proxy`
3. Install the dependencies, `pnpm install`
4. Run `pnpm refresh` to install/update the game files from TETR.IO
5. Run `pnpm start` and the web server will start on port `4080`, by default.

## Credits

* [Me](https://github.com/Vexcited)
* My school - that restricts every single games.

