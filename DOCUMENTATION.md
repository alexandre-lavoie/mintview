# mintview Documentation

## ElectronJS

### Running Configuration

The electron running configuration can be found under `./electron/background.ts`. This is where the window size and window tools are defined. To allow for web distribution, only the barebone electron features should be used. 

### Build Configuration

The build configuration for all operating systems can be found under `./electron-builder.yml`.

## Express

The Express configuration can be found under `./express_api`. This is currently only configured to serve NextJS, but will soon be configured to use Apollo GraphQL.

## Localization

Localization is handled using [i18next](https://www.i18next.com/). The localization files can be found under `./localization`. Mintview currently implements the following languages:

```
English (en), French (fr), Russian (ru).
```

## NextJS

### Pages

Pages can be found under `./pages`. Files places in the pages folder will be served as routes with the same name as the file (for example, `app.tsx` will be served as `http://localhost/app`). The only exception is the `_app.tsx` which is rendered for all pages (serves as root).

### Components

Components can be found under `./components`. These are all files that contain features that can be broken away from the main pages. This includes objects like the canvas or the various panels.

## Utils

### Index

Contains general utility used by many components.

### Vectors

This is a utility for N dimensional vectors. This could eventually become its own library. 