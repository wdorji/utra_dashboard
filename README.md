# Dashboard

A dashboard to connect with IoT devices to conduct behavioral neuroscience experiments. This frontend is a combination of HTML, CSS, JQuery, and JavaScript with different pages. In terms of the HTML structure, a page includes a header with navigation links and a body which differs based on the page. The backend uses the SMQ (Simple Message Queue) protocol from the Mako server framework.

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

## STIM page

Contains a web-based Integrated Development Environment (IDE) for editing and running scripts using CodeMirror. The page is divided into 2 main sections: 1) a sidebar for files and buttons to run, save, and revert changes, and 2) a main section for the editor and console. You can also enter unix commands in the smaller editor above the console. Event listeners are added to various elements, like file buttons, run/save/revert buttons, and input fields. The sidebar organizes files based on a tree-like structure.

Editor views are initialized with initial empty states and attached to respective HTML elements. Initially rendering the page fetches all the file names displaying them in the sidebar and clicking on each filename fetches the content from the server. The file data is stored in a SQLite database and info is relayed from the backend. Also a file tab is created and clicking on each tab allows you to switch between tabs. CodeMirror also does syntax highlighting based on the file extension. Currently, the editor is set up for conditional formatting and works for lua (.lua), Tcl/Tk (.tcl) and javascript (.js). For other languages, editor.mjs and the STIM page code would have to be modified.

The editor changes for a file are tracked as long as the file tab is open. Saving the changes overwrites the file in the database, otherwise changes are lost. Currently only mock outputs of running the file are printed and some basic shell commands such as pwd, ls work.

Note to add files in the database, you can use the insert.html page to insert instances of file by its name, content, and path.

## Control page

The page holds buttons and input elements for the parameters of the experiments. These parameters are all read from control_data.json and put into categories. The layout is a grid where each category is placed into a row, additional categories become a new row.

## Start page

Contains a button to start an experiment that simply signals the backend to start printing mock results in a table every second for 20 seconds to simulate results being received from a device. The table was created using the tabulator module.

## Tree page

Contains a sidebar of device names nested in a tree-like structure. Next to each device name is a checkbox to select if its interactions should be displayed in the table.The buttons to interact with it can be found in data.html file.
