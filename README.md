# TopLevelProcess

This utility library address a deficiency in node core as it relates to identifying whether or not a process was launched by a parent node process via `child_process.spawn()` or `child_process.fork()`.

If you are interested you can read the original feature request to the node team [here](https://github.com/nodejs/node/issues/16258) or see the pull request [here](https://github.com/nodejs/node/pull/20140) in order to learn about the very good reasons why this was not included in node core.

## Installation

Installation is pretty standard...

```
npm install TopLevelProcess
```

## Usage

This utility augments the existing node `process` and `child_process` objects. To use, simply require in any node process.

```
require("TopLevelProcess");
```

Once required, any usage of `child_process.spawn()` or `child_process.fork()` will correctly identify itself as having a parent node process to the spawned/forked process.

Also once required, `process.isTopLevelNodeProcess()` will be available and will return true if the node process was started as a top level process or if it was a spawn/fork from a upstream node process.

## Caveats

With regards to `child_process.exec()` and `child_process.execSync()`... exec is different from spawn/fork and does not really seem to fit the same paradigm for this utility.  
