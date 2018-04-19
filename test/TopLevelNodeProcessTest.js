/* Copyright 2018, Glen R. Goodwin, MIT License.  See http://github.com/arei/TopLevelProcess/blob/master/LICENSE.txt. */

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
const child_process = require("child_process");
const path = require("path");

require("../index.js");

describe("process.isTopLevelNodeProcess()",function(){
	this.slow(1000);

	const cwd = process.cwd();
	const node = path.resolve(cwd,process.argv[0]);
	const send = path.resolve(cwd,"./test/send.js");
	const stdout = path.resolve(cwd,"./test/stdout.js");

	it("Test top level process",()=>{
		assert(process.isTopLevelNodeProcess());
	});

	it("Test spawn()",()=>{
		return new Promise(async (resolve,reject)=>{
			try {
				let cp = child_process.spawn(node,[send],{
					stdio: [0,1,2,"ipc"]
				});
				cp.on("error",(err)=>{
					assert.fail(err);
				});
				cp.on("close",()=>{
					resolve();
				});
				cp.on("message",(itlnp)=>{
					assert(!itlnp);
					cp.kill();
				});

				await sleep(100);
				await sendToProcess(cp,process.isTopLevelNodeProcess());
			}
			catch (ex) {
				return reject(ex);
			}
		});
	});

	it("Test fork()",()=>{
		return new Promise(async (resolve,reject)=>{
			try {
				let cp = child_process.fork(send,{
					stdio: [0,1,2,"ipc"]
				});
				cp.on("error",(err)=>{
					assert.fail(err);
				});
				cp.on("close",()=>{
					resolve();
				});
				cp.on("message",(itlnp)=>{
					assert(!itlnp);
					cp.kill();
				});

				await sleep(100);
				await sendToProcess(cp,process.isTopLevelNodeProcess());
			}
			catch (ex) {
				return reject(ex);
			}
		});
	});

	it("Test exec()",()=>{
		return new Promise((resolve,reject)=>{
			try {
				child_process.exec("\""+node+"\" "+stdout+"\"",{
					encoding: "utf8"
				},(err,stdout,stderr)=>{
					if (err) return reject(err);
					if (stderr) return reject(stderr);

					assert(stdout==="true");
					resolve();
				});
			}
			catch (ex) {
				return reject(ex);
			}
		});
	});

	it("Test spawnSync()",()=>{
		return new Promise((resolve,reject)=>{
			try {
				let cp = child_process.spawnSync(node,[stdout],{
					encoding: "utf8"
				});
				if (cp.error) return reject(cp.error);
				if (cp.stderr) return reject(cp.stderr);

				assert(cp.stdout==="true");
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	});

	it("Test execSync()",()=>{
		return new Promise((resolve,reject)=>{
			try {
				let out = child_process.execSync("\""+node+"\" "+stdout+"\"",{
					encoding: "utf8"
				});

				assert(out==="true");
				resolve();
			}
			catch (ex) {
				return reject(ex);
			}
		});
	});

});

const sleep = function(ms) {
	return new Promise((resolve,reject)=>{
		try {
			if (!ms || typeof ms!=="number" || isNaN(ms) || ms<1) throw new Error("Invalid number of milliseconds to sleep.");

			setTimeout(()=>{
				resolve();
			},ms);
		}
		catch (ex) {
			return reject(ex);
		}
	});
};

const sendToProcess = function(cp,message){
	return new Promise((resolve,reject)=>{
		try {
			if (!cp.send) return reject("No ip channel setup to echo test program.");
			cp.send(message,()=>{
				resolve();
			});
		}
		catch (ex) {
			return reject(ex);
		}
	});
};
