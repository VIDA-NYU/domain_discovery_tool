// Filename:		sigslot_core.js
// Purpose:		provides an abstracted event handling system
// Classes:		NW_sigslot_registry, NW_SignalObj
// Global Objects:	__sig__ (aka, __signals_registry__)
// Dependencies:	none
// Author: Alex Russell (slightlyoff@crhomium.org)

// class definition for signal objects
function NW_SignalObj(obj, fp){
	this.fp = fp;
	this.obj = obj;
	this.slots = new Array();
	this.addSlot = function(pobj, pfp){
		var slot = null;
		if(__sig__.isSigFP(pfp)){
			slot = __sig__.getSig(pfp);
		}else{
			// whee! recursive data structures!
			slot = new NW_SignalObj(pobj, pfp);
			__sig__.addSig(slot);
		}
		this.slots[this.slots.length]=slot;
	}

	this.rmSlot = function(pobj, pfp){
		if(__sig__.isSigFP(pfp)){
			var tslot = __sig__.getSig(pfp);
			for(var x in this.slots){
				if(this.slots[x]==tslot){
					delete this.slots[this.slots.length];
					// make sure we only remove the first instance
					return true;
				}
			}
		}else{return false;}
	}
}

function NW_sigslot_registry(){
	this.uID = 0;
	// conArr contains an arry of signal objects
	this.connArr = new Array();

	// this method provides the mapping between signals and slots
	this.connect = function(sigObj, sigFP, slotObj, slotFP){
		console.log('SigSlots_core');
		var isFound = this.isSigFP(sigFP);
		if(!isFound){
			this.addSig(new NW_SignalObj(sigObj, sigFP));
		}
		var csig = this.getSig(sigFP);
		csig.addSlot(slotObj, slotFP);
	}

	// this method provides the mapping between signals and slots
	this.disconnect = function(sigObj, sigFP, slotObj, slotFP){
		var csig = this.getSig(sigFP);
		csig.rmSlot(slotObj, slotFP);
	}

	this.addSig = function(sigObj){
		var cUID = this.uID++;// should be atomic anyway, but make sure
		this.connArr[cUID]=sigObj;
	}

	this.isSigFP = function(fp){
		var isFound = false;
		for(var x in this.connArr){ if(this.connArr[x].fp == fp){isFound = true;} }
		return isFound;
	}

	this.getSig = function(fp){
		for(var x in this.connArr){ if(this.connArr[x].fp == fp){return this.connArr[x];} }
		return null;
	}

	this.emit = function(fp){
		for(var x in this.connArr){
			// find the signal object
			if(this.connArr[x].fp==fp){
				var csig = this.connArr[x];
				var args = arguments;
				var alen = args.length;
				// unroll the args array
				if(alen == 1){
					(csig.fp).call(csig.obj);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp);
					}
				}else if(alen == 2){
					(csig.fp).call(csig.obj, args[1]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1]);
					}
				}else if(alen == 3){
					(csig.fp).call(csig.obj, args[1], args[2]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2]);
					}
				}else if(alen == 4){
					(csig.fp).call(csig.obj, args[1], args[2], args[3]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3]);
					}

				}else if(alen == 5){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4]);
					}
				}else if(alen == 6){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5]);
					}
				}else if(alen == 7){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6]);
					}
				}else if(alen == 8){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
					}
				}else if(alen == 9){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
					}
				}else if(alen == 10){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
					}
				}else if(alen == 11){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
					}
				}else if(alen == 12){
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
					}
				}else if(alen == 13){
					// if your function needs more than 12 args, you need to learn how to write better code =)
					(csig.fp).call(csig.obj, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12]);
					for(var y in csig.slots){
						this.emit(csig.slots[y].fp, args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], args[12]);
					}
				}
			}
		}
	}
}

var __signals_registry__ = new NW_sigslot_registry();
var __sig__ = __signals_registry__; // alias


export {__sig__};
