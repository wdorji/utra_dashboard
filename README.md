# Dashboard

A dashboard to connect with IoT devices to conduct behavioral neuroscience experiments. This frontend is a combination of HTML, CSS, JQuery, and JavaScript with different pages. In terms of the HTML structure, a page includes a header with navigation links and a body which differs based on the page. The backend uses the SMQ (Simple Message Queue) protocol from the Mako server framework. The .preload contains all the code for the backend.

## Setup

Be sure to have [mako server](https://makoserver.net/), [luarocks](https://github.com/luarocks/luarocks/wiki/Download) and [codemirror](https://codemirror.net/) installed.

After cloning the repo and in the main directory, run the following commands to install lua-cjson and add the path at system boot:

```bash
luarocks install lua-cjson
eval "$(luarocks path)"
```

If you have any changes for editor.mj, bundle the files for [codemirror](https://codemirror.net/) using:

```bash
node_modules/.bin/rollup www/editor.mjs -f iife -o www/editor.bundle.js -p @rollup/plugin-node-resolve --output.name cm6
```

Start the server using:

```bash
mako -l::www
```

Then you can interact with the dashboard at [http://localhost](http://localhost). Running the server for the first time creates the sqlite databases.
