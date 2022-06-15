# TETR.IO - Self-Proxy

> This proxy is mainly used to bypass restrictions in so.me networks. Also, **this script is not associated with or created by [TETR.IO](https://tetr.io) or [osk](https://osk.sh)**.

## Motivation

When I write this, I am a student in a french school. The thing is that when I'm bored in class,
I want to play TETR.IO but actually can't because of restrictions on the network.

So here my solution is to self-host a proxy on a VPS or a Raspberry PI at home, so you can
play TETR.IO without any restrictions !

## How it works ?

Basically, we download all the resources from TETR.IO and serve them ourselves so we can bypass the Cloudflare browser check - that a lot of online proxies can't actually pass.

## Usage

Before following these steps, check if you have installed Node.JS and PNPm.

1. Use `git` to clone this repository with `git clone https://github.com/Vexcited/tetrio-proxy`
2. Go into the created folder, `cd tetrio-proxy`
3. Install the dependencies, `pnpm install`. You can also optionally [update the `index.html` file, manually](#update-the-publicindexhtml-file). You should do that **if the app can't load anymore**, otherwise don't touch the `public/index.html`.
4. Run `pnpm refresh` to install/update the game files from TETR.IO
5. Run `pnpm start` and the web server will start on port `4080`, by default.

### Update the `/public/index.html` file

Open a web browser and go to `https://tetr.io`. Wait for the CF browser check to complete and wait until TETR.IO is loaded.

Now, open the DevTools with **F12** and head on to the **Sources** tab.

In `top>tetr.io>`, you'll find `index.html`. Right click on it and **Save as** `index.html` somewhere.

Now move this file to the root `public` folder
of this repository.

### `public` folder structure

* `./css/`, should only contain `tetrio.css`.
* `./js/`, should only contain `tetrio.js`.
* `./res/*`, contains all the resources.
* `./sfx`, should only contain `tetrio.ogg`.
* `index.html`