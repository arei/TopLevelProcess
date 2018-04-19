// Copyright 2018, Glen R. Goodwin, MIT License.  See http://github.com/arei/TopLevelProcess/blob/master/LICENSE.txt.

"use strict";

// load TopLevelProcess
require("../index.js");

process.stdout.write(""+process.isTopLevelNodeProcess());
