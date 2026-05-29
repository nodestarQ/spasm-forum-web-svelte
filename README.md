## Deploy Spasm

- Launch Spasm under three minutes with [docker/podman](https://github.com/spasm-network/spasm-docker).
- Or set up a new server from scratch with [one script](https://github.com/spasm-network/spasm-ansible) ([video](https://media.spasm.network/spasmvi01e2729a96813336a92a2f511c4770c7935c95ab44e8cbb94b1d38912c0f1db14f.mp4)).

---

# Spasm Forum web client

Mirrors: [Forgejo](https://git.spasm.network/spasm-network/spasm-forum-web) [Codeberg](https://codeberg.org/spasm-network/spasm-forum-web) [Github](https://github.com/spasm-network/spasm-forum-web)

spasm-forum-web is a frontend for a [Spasm](https://github.com/spasm-network/spasm.js) forum. It is built with SvelteKit (Svelte 5) and runs as a standalone Node server via adapter-node.

spasm-forum-server repository can be found [here](https://github.com/spasm-network/spasm-forum-server).

This repo is for development. If you want to deploy Spasm, then check [docker/podman](https://github.com/spasm-network/spasm-docker) or [ansible](https://github.com/spasm-network/spasm-ansible).

## Install npm

*Note: nvm and npm should already be installed if you've used scripts for an automated [initial server setup](https://github.com/spasm-network/spasm-forum-scripts).*

```
# install nvm to manage node versions
# https://github.com/nvm-sh/nvm

# install node v20
nvm install 20

# set node v20 as default
nvm alias default 20

# switch to node v20
nvm use 20

# update npm
npm install -g npm

# install packages
npm ci
```

---

## Download the app

Download the app from the Github into the `frontend/` folder.

*Note: the app should already be downloaded if you've used scripts for an automated [initial server setup](https://github.com/spasm-network/spasm-forum-scripts).*

```
git clone https://github.com/spasm-network/spasm-forum-web.git frontend/
cd frontend/
```

---

## Environment

Create default `.env` file, see example `.env.example`.

*Note: the `.env` file should already be created if you've used scripts for an automated [initial server setup](https://github.com/spasm-network/spasm-forum-scripts).*

```
cp .env.example .env
```

---

## Test locally

*Note: this is an optional step intended for developers.
You can skip this step if you want to run a Spasm forum.*

Install npm packages in the frontend folder.

```
npm ci
```

Start the app.

```
npm run dev
```

Open a browser and test the app at `localhost:3000`.

*Note: press `ctrl+c` in the terminal to stop the process.*

---

## Customization

#### Necessary settings

- Change app name, title, description, about, manifest params in `.env`.
- Add logos (recommended sizes are 100x100, 192x192, 512x512) as `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png` into the `static/` folder.

#### Optional settings

There are many other settings that can be changed via `.env`,
most variables have self-explanatory names and comments.

The full list of settings can be found in `./.env.example`.

#### Admin panel

Instances can be customized via GUI through the admin panel.

The admin page can be accessed by clicking an 'admin' button at the
bottom menu bar after connecting an admin public key (address),
or directly via url, e.g. `https://forum.spasm.network/admin`.

Make sure that an admin panel and app config changes are enabled
and admin addresses are listed in `.env` files in **both** frontend
(spasm-forum-web) and backend (spasm-forum-server).

```
PUBLIC_ENABLE_APP_CONFIG_CHANGES=true
PUBLIC_ENABLE_APP_CONFIG_CHANGES_BY_ADMIN=true
# Separate admin addresses with comma
PUBLIC_ENABLE_ADMIN=true
PUBLIC_ADMINS=""
```

#### Advanced customization

You can use completely custom intro and contacts if customization
via predefined options in `.env` is not enough.

If you've used scripts for the automated server setup, then custom
intro and contacts files should have already been created.

If you follow the manual installation, then create custom files
`CustomIntro.svelte` and `CustomContacts.svelte` in `src/lib/components/custom/`.

If your version has example files, then you can simply copy-paste them:

```
cp src/lib/components/custom/CustomContacts.example.svelte src/lib/components/custom/CustomContacts.svelte
cp src/lib/components/custom/CustomIntro.example.svelte src/lib/components/custom/CustomIntro.svelte
```

#### Updates

Note: customized files like `src/lib/components/custom/CustomIntro.svelte`, `src/lib/components/custom/CustomContacts.svelte`, and `.env` are ignored by git, so you can customize them and they won't be changed after updating the code to a newer version with `git pull`. However, it's a good idea to back these files up.

---

## Build

```
npm ci
```

Build the frontend for running in production. The SvelteKit
adapter-node output is written to the `build/` folder.

```
npm run build
```

You can run the built app directly with Node:

```
node build
# or: npm start
```

## Run production

```
npm ci
```

Run with pm2 (after build):

```
# Install pm2
npm i pm2 -g

# To make sure app starts after reboot
pm2 startup

# Run the app (production)
pm2 start ecosystem-prod.config.js

# Freeze a process list on reboot
pm2 save

# Check processes
pm2 list
```

## For developers

#### Use mock data

If you want to contribute to the UI (frontend) without the
hassle of setting up the backend and the database, then you
can use the mock data to pre-populate the client with feed
posts and latest comments by enabling this environment
variable in the `./.env` file:

```
PUBLIC_USE_MOCKED_DATA_IF_BACKEND_IS_DOWN=true
```

Don't forget to restart the app with `npm run dev`.

## Contact

Send a message to `degenrocket` on [Session](https://getsession.org) if you need any help.
