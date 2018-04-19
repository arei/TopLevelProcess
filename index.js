// Copyright 2018, Glen R. Goodwin, MIT License.  See http://github.com/arei/TopLevelProcess/blob/master/LICENSE.txt.

"use strict";

const child_process = require("child_process");
/**
 * Adds new function to process for determinig if the current process
 * is the top level process or not.
 *
 * @return {[boolean]} Return true if top level node process.
 */
process.isTopLevelNodeProcess = function() {
	let tlnpp = process && process.env && process.env.NODE_TOP_LEVEL_PROCESS_PID;
	return !tlnpp || tlnpp===process.pid;
};

/**
 * Overloads child_process.spawn to add env var NODE_TOP_LEVEL_PROCESS_PID
 * to outgoing spawn calls.
 */
const spawn = child_process.spawn;
child_process.spawn = function(command,args,options) {
	[command,args,options] = checkArgs(command,args,options);
	options = modEnv(options);
	return spawn.call(this,command,args,options);
};

/**
 * Overloads child_process.fork to add env var NODE_TOP_LEVEL_PROCESS_PID
 * to outgoing fork calls.
 */
const fork = child_process.fork;
child_process.fork = function(command,args,options) {
	[command,args,options] = checkArgs(command,args,options);
	options = modEnv(options);
	return fork.call(this,command,args,options);
};

const modEnv = function(options) {
	options = options || {};
	options.env = options.env || {};
	options.env.NODE_TOP_LEVEL_PROCESS_PID = process && process.env && process.env.NODE_TOP_LEVEL_PROCESS_PID || process.pid;
	return options;
};

const checkArgs = function(command,args,options) {
	if (command && typeof command==="string" && !args && !options) [command,args,options] = [command,[],{}];
	if (command && typeof command==="string" && args && args instanceof Array && !options) [command,args,options] = [command,args,{}];
	if (command && typeof command==="string" && args && args instanceof Array && options && options instanceof Object) [command,args,options] = [command,args,options];
	if (command && typeof command==="string" && args && args instanceof Object && !options) [command,args,options] = [command,[],args];

	return [command,args,options];
};
