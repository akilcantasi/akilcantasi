// OTOMATİK ÜRETİLDİ (npm run hf:derle) — elle düzenlemeyin. Kaynak: tools/hf/_src/hf-yukle.ts
import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@huggingface/hub/dist/chunk-FFYIGW52.mjs
var init_chunk_FFYIGW52 = __esm({
  "node_modules/@huggingface/hub/dist/chunk-FFYIGW52.mjs"() {
  }
});

// node_modules/@huggingface/hub/dist/sha256-wrapper-ITDNMKRK.mjs
var sha256_wrapper_ITDNMKRK_exports = {};
__export(sha256_wrapper_ITDNMKRK_exports, {
  createSHA256: () => createSHA256,
  createSHA256WorkerCode: () => createSHA256WorkerCode
});
async function createSHA256(isInsideWorker = false) {
  const BUFFER_MAX_SIZE = 8 * 1024 * 1024;
  const wasm = isInsideWorker ? (
    // @ts-expect-error WasmModule will be populated inside self object
    await self["SHA256WasmModule"]()
  ) : await sha256_default();
  const heap = wasm.HEAPU8.subarray(wasm._GetBufferPtr());
  return {
    init() {
      wasm._Hash_Init(256);
    },
    update(data) {
      let byteUsed = 0;
      while (byteUsed < data.byteLength) {
        const bytesLeft = data.byteLength - byteUsed;
        const length = Math.min(bytesLeft, BUFFER_MAX_SIZE);
        heap.set(data.subarray(byteUsed, byteUsed + length));
        wasm._Hash_Update(length);
        byteUsed += length;
      }
    },
    digest(method) {
      if (method !== "hex") {
        throw new Error("Only digest hex is supported");
      }
      wasm._Hash_Final();
      const result = Array.from(heap.slice(0, 32));
      return result.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  };
}
function createSHA256WorkerCode() {
  return `
		self.addEventListener('message', async (event) => {
      const { file } = event.data;
      const sha256 = await self.createSHA256(true);
      sha256.init();
      const reader = file.stream().getReader();
      const total = file.size;
      let bytesDone = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        sha256.update(value);
        bytesDone += value.length;
        postMessage({ progress: bytesDone / total });
      }
      postMessage({ sha256: sha256.digest('hex') });
    });
    self.SHA256WasmModule = ${sha256_default.toString()};
    self.createSHA256 = ${createSHA256.toString()};
  `;
}
var Module, sha256_default;
var init_sha256_wrapper_ITDNMKRK = __esm({
  "node_modules/@huggingface/hub/dist/sha256-wrapper-ITDNMKRK.mjs"() {
    init_chunk_FFYIGW52();
    Module = (() => {
      var _unused = import.meta.url;
      return function(moduleArg = {}) {
        var Module2 = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        Module2["ready"] = new Promise((resolve2, reject) => {
          readyPromiseResolve = resolve2;
          readyPromiseReject = reject;
        });
        var moduleOverrides = Object.assign({}, Module2);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        var scriptDirectory = "";
        function locateFile(path3) {
          if (Module2["locateFile"]) {
            return Module2["locateFile"](path3, scriptDirectory);
          }
          return scriptDirectory + path3;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (false) {
            scriptDirectory = false;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(
                  /** @type{!ArrayBuffer} */
                  xhr.response
                );
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else {
        }
        var out = Module2["print"] || console.log.bind(console);
        var err = Module2["printErr"] || console.error.bind(console);
        Object.assign(Module2, moduleOverrides);
        moduleOverrides = null;
        if (Module2["arguments"])
          arguments_ = Module2["arguments"];
        if (Module2["thisProgram"])
          thisProgram = Module2["thisProgram"];
        if (Module2["quit"])
          quit_ = Module2["quit"];
        var wasmBinary;
        if (Module2["wasmBinary"])
          wasmBinary = Module2["wasmBinary"];
        if (typeof WebAssembly != "object") {
          abort("no native wasm support detected");
        }
        function intArrayFromBase64(s) {
          var decoded = atob(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i);
          }
          return bytes;
        }
        function tryParseAsDataURI(filename) {
          if (!isDataURI(filename)) {
            return;
          }
          return intArrayFromBase64(filename.slice(dataURIPrefix.length));
        }
        var wasmMemory3;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort(text);
          }
        }
        var HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory3.buffer;
          Module2["HEAP8"] = HEAP8 = new Int8Array(b);
          Module2["HEAP16"] = HEAP16 = new Int16Array(b);
          Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module2["HEAP32"] = HEAP32 = new Int32Array(b);
          Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATEXIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module2["preRun"]) {
            if (typeof Module2["preRun"] == "function")
              Module2["preRun"] = [Module2["preRun"]];
            while (Module2["preRun"].length) {
              addOnPreRun(Module2["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
          if (Module2["postRun"]) {
            if (typeof Module2["postRun"] == "function")
              Module2["postRun"] = [Module2["postRun"]];
            while (Module2["postRun"].length) {
              addOnPostRun(Module2["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnExit(cb) {
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
          return id;
        }
        function addRunDependency(id) {
          runDependencies++;
          Module2["monitorRunDependencies"]?.(runDependencies);
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module2["monitorRunDependencies"]?.(runDependencies);
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module2["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -sASSERTIONS for more info.";
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        var wasmBinaryFile;
        wasmBinaryFile = "data:application/octet-stream;base64,AGFzbQEAAAABHQZgAX8AYAABf2AAAGABfwF/YAJ/fwBgA39/fwF/Aw0MAgAEAgMBBQABAQADBAUBcAEBAQUGAQGAAoACBg4CfwFB8IuEBAt/AUEACweYAQoGbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMAAAtIYXNoX1VwZGF0ZQABCkhhc2hfRmluYWwAAwlIYXNoX0luaXQABAxHZXRCdWZmZXJQdHIABRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAJc3RhY2tTYXZlAAkMc3RhY2tSZXN0b3JlAAoKc3RhY2tBbGxvYwALCossDAIAC+4CAgV/AX5BACgCwAoiASABKQNAIgYgAK18NwNAAkACQAJAIAanQT9xIgINAEGACyEBIAAhAgwBC0HAACACayEDAkAgAEUNACADIAAgAyAASRshBCABIAJqIQVBACEBA0AgBSABIgFqQYALIAFqLQAAOgAAIAFBAWoiAiEBIAIgBEcNAAsLAkACQCAAIANJIgRFDQBBgAshASAAIQIMAQtBACgCwAoiAUHIAGogARACQYALIANqIQEgACADayECCyABIQEgAiECIAQNAQsgASEBAkACQCACIgJBwABPDQAgASEFIAIhAAwBCyACIQIgASEEA0BBACgCwApByABqIAQiBBACIAJBQGoiASECIARBwABqIgUhBCAFIQUgASEAIAFBP0sNAAsLIAUhBSAAIgBFDQBBACEBQQAhAgNAQQAoAsAKIAEiAWogBSABai0AADoAACACQQFqIgJB/wFxIgQhASACIQIgACAESw0ACwsLqCEBK38gACgCCCICIAAoAgQiAyAAKAIAIgRzcSADIARxcyAEQR53IARBE3dzIARBCndzaiAAKAIQIgVBGncgBUEVd3MgBUEHd3MgACgCHCIGaiAAKAIYIgcgACgCFCIIcyAFcSAHc2ogASgCACIJQRh0IAlBgP4DcUEIdHIgCUEIdkGA/gNxIAlBGHZyciIKakGY36iUBGoiC2oiCSAEcyADcSAJIARxcyAJQR53IAlBE3dzIAlBCndzaiAHIAEoAgQiDEEYdCAMQYD+A3FBCHRyIAxBCHZBgP4DcSAMQRh2cnIiDWogCyAAKAIMIg5qIg8gCCAFc3EgCHNqIA9BGncgD0EVd3MgD0EHd3NqQZGJ3YkHaiIQaiIMIAlzIARxIAwgCXFzIAxBHncgDEETd3MgDEEKd3NqIAggASgCCCILQRh0IAtBgP4DcUEIdHIgC0EIdkGA/gNxIAtBGHZyciIRaiAQIAJqIhIgDyAFc3EgBXNqIBJBGncgEkEVd3MgEkEHd3NqQc/3g657aiITaiILIAxzIAlxIAsgDHFzIAtBHncgC0ETd3MgC0EKd3NqIAUgASgCDCIQQRh0IBBBgP4DcUEIdHIgEEEIdkGA/gNxIBBBGHZyciIUaiATIANqIhMgEiAPc3EgD3NqIBNBGncgE0EVd3MgE0EHd3NqQaW3181+aiIVaiIQIAtzIAxxIBAgC3FzIBBBHncgEEETd3MgEEEKd3NqIA8gASgCECIWQRh0IBZBgP4DcUEIdHIgFkEIdkGA/gNxIBZBGHZyciIXaiAVIARqIhYgEyASc3EgEnNqIBZBGncgFkEVd3MgFkEHd3NqQduE28oDaiIYaiIPIBBzIAtxIA8gEHFzIA9BHncgD0ETd3MgD0EKd3NqIAEoAhQiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiGSASaiAYIAlqIhIgFiATc3EgE3NqIBJBGncgEkEVd3MgEkEHd3NqQfGjxM8FaiIYaiIJIA9zIBBxIAkgD3FzIAlBHncgCUETd3MgCUEKd3NqIAEoAhgiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiGiATaiAYIAxqIhMgEiAWc3EgFnNqIBNBGncgE0EVd3MgE0EHd3NqQaSF/pF5aiIYaiIMIAlzIA9xIAwgCXFzIAxBHncgDEETd3MgDEEKd3NqIAEoAhwiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiGyAWaiAYIAtqIhYgEyASc3EgEnNqIBZBGncgFkEVd3MgFkEHd3NqQdW98dh6aiIYaiILIAxzIAlxIAsgDHFzIAtBHncgC0ETd3MgC0EKd3NqIAEoAiAiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiHCASaiAYIBBqIhIgFiATc3EgE3NqIBJBGncgEkEVd3MgEkEHd3NqQZjVnsB9aiIYaiIQIAtzIAxxIBAgC3FzIBBBHncgEEETd3MgEEEKd3NqIAEoAiQiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiHSATaiAYIA9qIhMgEiAWc3EgFnNqIBNBGncgE0EVd3MgE0EHd3NqQYG2jZQBaiIYaiIPIBBzIAtxIA8gEHFzIA9BHncgD0ETd3MgD0EKd3NqIAEoAigiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiHiAWaiAYIAlqIhYgEyASc3EgEnNqIBZBGncgFkEVd3MgFkEHd3NqQb6LxqECaiIYaiIJIA9zIBBxIAkgD3FzIAlBHncgCUETd3MgCUEKd3NqIAEoAiwiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiHyASaiAYIAxqIhIgFiATc3EgE3NqIBJBGncgEkEVd3MgEkEHd3NqQcP7sagFaiIYaiIMIAlzIA9xIAwgCXFzIAxBHncgDEETd3MgDEEKd3NqIAEoAjAiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiICATaiAYIAtqIhMgEiAWc3EgFnNqIBNBGncgE0EVd3MgE0EHd3NqQfS6+ZUHaiIYaiILIAxzIAlxIAsgDHFzIAtBHncgC0ETd3MgC0EKd3NqIAEoAjQiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiISAWaiAYIBBqIhAgEyASc3EgEnNqIBBBGncgEEEVd3MgEEEHd3NqQf7j+oZ4aiIYaiIWIAtzIAxxIBYgC3FzIBZBHncgFkETd3MgFkEKd3NqIAEoAjgiFUEYdCAVQYD+A3FBCHRyIBVBCHZBgP4DcSAVQRh2cnIiIiASaiAYIA9qIg8gECATc3EgE3NqIA9BGncgD0EVd3MgD0EHd3NqQaeN8N55aiIVaiISIBZzIAtxIBIgFnFzIBJBHncgEkETd3MgEkEKd3NqIAEoAjwiAUEYdCABQYD+A3FBCHRyIAFBCHZBgP4DcSABQRh2cnIiIyATaiAVIAlqIgEgDyAQc3EgEHNqIAFBGncgAUEVd3MgAUEHd3NqQfTi74x8aiIJaiEVIBIhGCAWISQgCyElIAkgDGohJiABIScgDyEoIBAhKSAjISMgIiEiICEhISAgISAgHyEfIB4hHiAdIR0gHCEcIBshGyAaIRogGSEZIBchFyAUIRQgESERIA0hECAKIQxBgAkhAUEQISoDQCAVIgkgGCIKcyAkIitxIAkgCnFzIAlBHncgCUETd3MgCUEKd3NqIBAiEEEZdyAQQQ53cyAQQQN2cyAMaiAdIh1qICIiFkEPdyAWQQ13cyAWQQp2c2oiDCApaiAmIhIgJyIPICgiE3NxIBNzaiASQRp3IBJBFXdzIBJBB3dzaiABIgEoAgBqIiRqIgsgCXMgCnEgCyAJcXMgC0EedyALQRN3cyALQQp3c2ogESIYQRl3IBhBDndzIBhBA3ZzIBBqIB4iHmogIyIVQQ93IBVBDXdzIBVBCnZzaiINIBNqIAEoAgRqICQgJWoiEyASIA9zcSAPc2ogE0EadyATQRV3cyATQQd3c2oiJWoiECALcyAJcSAQIAtxcyAQQR53IBBBE3dzIBBBCndzaiAUIiRBGXcgJEEOd3MgJEEDdnMgGGogHyIfaiAMQQ93IAxBDXdzIAxBCnZzaiIRIA9qIAEoAghqICUgK2oiGCATIBJzcSASc2ogGEEadyAYQRV3cyAYQQd3c2oiJWoiDyAQcyALcSAPIBBxcyAPQR53IA9BE3dzIA9BCndzaiAXIhdBGXcgF0EOd3MgF0EDdnMgJGogICIgaiANQQ93IA1BDXdzIA1BCnZzaiIUIBJqIAEoAgxqICUgCmoiCiAYIBNzcSATc2ogCkEadyAKQRV3cyAKQQd3c2oiJWoiEiAPcyAQcSASIA9xcyASQR53IBJBE3dzIBJBCndzaiATIBkiJEEZdyAkQQ53cyAkQQN2cyAXaiAhIiFqIBFBD3cgEUENd3MgEUEKdnNqIhdqIAEoAhBqICUgCWoiEyAKIBhzcSAYc2ogE0EadyATQRV3cyATQQd3c2oiJWoiCSAScyAPcSAJIBJxcyAJQR53IAlBE3dzIAlBCndzaiABKAIUIBoiGkEZdyAaQQ53cyAaQQN2cyAkaiAWaiAUQQ93IBRBDXdzIBRBCnZzaiIZaiAYaiAlIAtqIhggEyAKc3EgCnNqIBhBGncgGEEVd3MgGEEHd3NqIiVqIgsgCXMgEnEgCyAJcXMgC0EedyALQRN3cyALQQp3c2ogASgCGCAbIiRBGXcgJEEOd3MgJEEDdnMgGmogFWogF0EPdyAXQQ13cyAXQQp2c2oiGmogCmogJSAQaiIKIBggE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzaiIlaiIQIAtzIAlxIBAgC3FzIBBBHncgEEETd3MgEEEKd3NqIAEoAhwgHCIcQRl3IBxBDndzIBxBA3ZzICRqIAxqIBlBD3cgGUENd3MgGUEKdnNqIhtqIBNqICUgD2oiJCAKIBhzcSAYc2ogJEEadyAkQRV3cyAkQQd3c2oiE2oiDyAQcyALcSAPIBBxcyAPQR53IA9BE3dzIA9BCndzaiABKAIgIB1BGXcgHUEOd3MgHUEDdnMgHGogDWogGkEPdyAaQQ13cyAaQQp2c2oiHGogGGogEyASaiIYICQgCnNxIApzaiAYQRp3IBhBFXdzIBhBB3dzaiITaiISIA9zIBBxIBIgD3FzIBJBHncgEkETd3MgEkEKd3NqIAEoAiQgHkEZdyAeQQ53cyAeQQN2cyAdaiARaiAbQQ93IBtBDXdzIBtBCnZzaiIdaiAKaiATIAlqIgkgGCAkc3EgJHNqIAlBGncgCUEVd3MgCUEHd3NqIgpqIhMgEnMgD3EgEyAScXMgE0EedyATQRN3cyATQQp3c2ogASgCKCAfQRl3IB9BDndzIB9BA3ZzIB5qIBRqIBxBD3cgHEENd3MgHEEKdnNqIh5qICRqIAogC2oiCiAJIBhzcSAYc2ogCkEadyAKQRV3cyAKQQd3c2oiJGoiCyATcyAScSALIBNxcyALQR53IAtBE3dzIAtBCndzaiABKAIsICBBGXcgIEEOd3MgIEEDdnMgH2ogF2ogHUEPdyAdQQ13cyAdQQp2c2oiH2ogGGogJCAQaiIYIAogCXNxIAlzaiAYQRp3IBhBFXdzIBhBB3dzaiIkaiIQIAtzIBNxIBAgC3FzIBBBHncgEEETd3MgEEEKd3NqIAEoAjAgIUEZdyAhQQ53cyAhQQN2cyAgaiAZaiAeQQ93IB5BDXdzIB5BCnZzaiIgaiAJaiAkIA9qIiQgGCAKc3EgCnNqICRBGncgJEEVd3MgJEEHd3NqIg9qIgkgEHMgC3EgCSAQcXMgCUEedyAJQRN3cyAJQQp3c2ogASgCNCAWQRl3IBZBDndzIBZBA3ZzICFqIBpqIB9BD3cgH0ENd3MgH0EKdnNqIiFqIApqIA8gEmoiDyAkIBhzcSAYc2ogD0EadyAPQRV3cyAPQQd3c2oiCmoiEiAJcyAQcSASIAlxcyASQR53IBJBE3dzIBJBCndzaiABKAI4IBVBGXcgFUEOd3MgFUEDdnMgFmogG2ogIEEPdyAgQQ13cyAgQQp2c2oiImogGGogCiATaiITIA8gJHNxICRzaiATQRp3IBNBFXdzIBNBB3dzaiIYaiIWIBJzIAlxIBYgEnFzIBZBHncgFkETd3MgFkEKd3NqIAEoAjwgDEEZdyAMQQ53cyAMQQN2cyAVaiAcaiAhQQ93ICFBDXdzICFBCnZzaiIKaiAkaiAYIAtqIgsgEyAPc3EgD3NqIAtBGncgC0EVd3MgC0EHd3NqIiZqIishFSAWIRggEiEkIAkhJSAmIBBqIiwhJiALIScgEyEoIA8hKSAKISMgIiEiICEhISAgISAgHyEfIB4hHiAdIR0gHCEcIBshGyAaIRogGSEZIBchFyAUIRQgESERIA0hECAMIQwgAUHAAGohASAqIgpBEGohKiAKQTBJDQALIAAgDyAGajYCHCAAIBMgB2o2AhggACALIAhqNgIUIAAgLCAFajYCECAAIAkgDmo2AgwgACASIAJqNgIIIAAgFiADajYCBCAAICsgBGo2AgAL1AMDBX8BfgF7QQAoAsAKIgAgACgCQCIBQQJ2QQ9xIgJBAnRqIgMgAygCAEF/IAFBA3QiAXRBf3NxQYABIAF0czYCAAJAAkAgAkEOTw0AIAJBAWohAAwBCwJAIAJBDkcNACAAQQA2AjwLIABByABqIAAQAkEAIQALAkAgACIAQQ1LDQBBACgCwAogAEECdCIAakEAQTggAGsQBhoLQQAoAsAKIgAgACkDQCIFpyICQRt0IAJBC3RBgID8B3FyIAJBBXZBgP4DcSACQQN0QRh2cnI2AjwgACAFQh2IpyICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZycjYCOCAAQcgAaiAAEAJBACgCwApBPGohAUEAIQADQCABQQcgACIAa0ECdGoiAiAC/QACACAG/Q0MDQ4PCAkKCwQFBgcAAQIDIAb9DQMCAQAHBgUECwoJCA8ODQwgBv0NDA0ODwgJCgsEBQYHAAECA/0LAgAgAEEEaiICIQAgAkEIRw0ACwJAQQAoAsAKIgMoAmhFDQAgA0HIAGohBEEAIQBBACECA0BBgAsgACIAaiAEIABqLQAAOgAAIAJBAWoiAkH/AXEiASEAIAIhAiADKAJoIAFLDQALCwtxAQJ/QQAoAsAKIgFCADcDQCABQcgAaiECAkAgAEHgAUcNACABQRw2AmggAkEQakEA/QAEsAj9CwIAIAJBAP0ABKAI/QsCAEEADwsgAUEgNgJoIAJBEGpBAP0ABJAI/QsCACACQQD9AASACP0LAgBBAAsFAEGACwvyAgIDfwF+AkAgAkUNACAAIAE6AAAgACACaiIDQX9qIAE6AAAgAkEDSQ0AIAAgAToAAiAAIAE6AAEgA0F9aiABOgAAIANBfmogAToAACACQQdJDQAgACABOgADIANBfGogAToAACACQQlJDQAgAEEAIABrQQNxIgRqIgMgAUH/AXFBgYKECGwiATYCACADIAIgBGtBfHEiBGoiAkF8aiABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBeGogATYCACACQXRqIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQXBqIAE2AgAgAkFsaiABNgIAIAJBaGogATYCACACQWRqIAE2AgAgBCADQQRxQRhyIgVrIgJBIEkNACABrUKBgICAEH4hBiADIAVqIQEDQCABIAY3AxggASAGNwMQIAEgBjcDCCABIAY3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsgAAsGACAAJAELBAAjAQsEACMACwYAIAAkAAsSAQJ/IwAgAGtBcHEiASQAIAELC9ICAgBBgAgLwAJn5glqha5nu3Lzbjw69U+lf1IOUYxoBZur2YMfGc3gW9ieBcEH1Xw2F91wMDlZDvcxC8D/ERVYaKeP+WSkT/q+mC+KQpFEN3HP+8C1pdu16VvCVjnxEfFZpII/ktVeHKuYqgfYAVuDEr6FMSTDfQxVdF2+cv6x3oCnBtybdPGbwcFpm+SGR77vxp3BD8yhDCRvLOktqoR0StypsFzaiPl2UlE+mG3GMajIJwOwx39Zv/ML4MZHkafVUWPKBmcpKRSFCrcnOCEbLvxtLE0TDThTVHMKZbsKanYuycKBhSxykqHov6JLZhqocItLwqNRbMcZ6JLRJAaZ1oU1DvRwoGoQFsGkGQhsNx5Md0gntbywNLMMHDlKqthOT8qcW/NvLmjugo90b2OleBR4yIQIAseM+v++kOtsUKT3o/m+8nhxxgBBwAoLBIAFgAA=";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          var binary = tryParseAsDataURI(file);
          if (binary) {
            return binary;
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => {
            return WebAssembly.instantiate(binary, imports);
          }).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function createWasm() {
          var info = {
            "env": wasmImports,
            "wasi_snapshot_preview1": wasmImports
          };
          function receiveInstance(instance, module) {
            wasmExports = instance.exports;
            wasmMemory3 = wasmExports["memory"];
            updateMemoryViews();
            addOnInit(wasmExports["__wasm_call_ctors"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          function receiveInstantiationResult(result) {
            receiveInstance(result["instance"]);
          }
          if (Module2["instantiateWasm"]) {
            try {
              return Module2["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        var tempDouble;
        var tempI64;
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module2);
          }
        };
        function getValue(ptr, type = "i8") {
          if (type.endsWith("*"))
            type = "*";
          switch (type) {
            case "i1":
              return HEAP8[ptr];
            case "i8":
              return HEAP8[ptr];
            case "i16":
              return HEAP16[ptr >> 1];
            case "i32":
              return HEAP32[ptr >> 2];
            case "i64":
              abort("to do getValue(i64) use WASM_BIGINT");
            case "float":
              return HEAPF32[ptr >> 2];
            case "double":
              return HEAPF64[ptr >> 3];
            case "*":
              return HEAPU32[ptr >> 2];
            default:
              abort(`invalid type for getValue: ${type}`);
          }
        }
        var noExitRuntime = Module2["noExitRuntime"] || true;
        function setValue(ptr, value, type = "i8") {
          if (type.endsWith("*"))
            type = "*";
          switch (type) {
            case "i1":
              HEAP8[ptr] = value;
              break;
            case "i8":
              HEAP8[ptr] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              abort("to do setValue(i64) use WASM_BIGINT");
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            case "*":
              HEAPU32[ptr >> 2] = value;
              break;
            default:
              abort(`invalid type for setValue: ${type}`);
          }
        }
        var wasmImports = {};
        var wasmExports = createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();
        var _Hash_Update = Module2["_Hash_Update"] = (a0) => (_Hash_Update = Module2["_Hash_Update"] = wasmExports["Hash_Update"])(a0);
        var _Hash_Final = Module2["_Hash_Final"] = () => (_Hash_Final = Module2["_Hash_Final"] = wasmExports["Hash_Final"])();
        var _Hash_Init = Module2["_Hash_Init"] = (a0) => (_Hash_Init = Module2["_Hash_Init"] = wasmExports["Hash_Init"])(a0);
        var _GetBufferPtr = Module2["_GetBufferPtr"] = () => (_GetBufferPtr = Module2["_GetBufferPtr"] = wasmExports["GetBufferPtr"])();
        var stackSave = () => (stackSave = wasmExports["stackSave"])();
        var stackRestore = (a0) => (stackRestore = wasmExports["stackRestore"])(a0);
        var stackAlloc = (a0) => (stackAlloc = wasmExports["stackAlloc"])(a0);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function run() {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            Module2["calledRun"] = true;
            if (ABORT)
              return;
            initRuntime();
            readyPromiseResolve(Module2);
            if (Module2["onRuntimeInitialized"])
              Module2["onRuntimeInitialized"]();
            postRun();
          }
          if (Module2["setStatus"]) {
            Module2["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module2["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        if (Module2["preInit"]) {
          if (typeof Module2["preInit"] == "function")
            Module2["preInit"] = [Module2["preInit"]];
          while (Module2["preInit"].length > 0) {
            Module2["preInit"].pop()();
          }
        }
        run();
        return moduleArg.ready;
      };
    })();
    sha256_default = Module;
  }
});

// node_modules/@huggingface/hub/dist/sha256-node-ZPWO3OWR.mjs
var sha256_node_ZPWO3OWR_exports = {};
__export(sha256_node_ZPWO3OWR_exports, {
  sha256Node: () => sha256Node
});
import { Readable } from "stream";
import { createHash } from "crypto";
async function* sha256Node(buffer, opts) {
  const sha256Stream = createHash("sha256");
  const size = buffer instanceof Blob ? buffer.size : buffer.byteLength;
  let done = 0;
  const readable = buffer instanceof Blob ? Readable.fromWeb(buffer.stream()) : Readable.from(Buffer.from(buffer));
  for await (const buffer2 of readable) {
    sha256Stream.update(buffer2);
    done += buffer2.length;
    yield done / size;
    opts?.abortSignal?.throwIfAborted();
  }
  return sha256Stream.digest("hex");
}
var init_sha256_node_ZPWO3OWR = __esm({
  "node_modules/@huggingface/hub/dist/sha256-node-ZPWO3OWR.mjs"() {
    init_chunk_FFYIGW52();
  }
});

// node_modules/@huggingface/hub/dist/FileBlob-UNXOJWFM.mjs
var FileBlob_UNXOJWFM_exports = {};
__export(FileBlob_UNXOJWFM_exports, {
  FileBlob: () => FileBlob
});
import { createReadStream } from "fs";
import { open, stat } from "fs/promises";
import { Readable as Readable2 } from "stream";
import { fileURLToPath } from "url";
var FileBlob;
var init_FileBlob_UNXOJWFM = __esm({
  "node_modules/@huggingface/hub/dist/FileBlob-UNXOJWFM.mjs"() {
    init_chunk_FFYIGW52();
    FileBlob = class extends Blob {
      /**
       * Creates a new FileBlob on the provided file.
       *
       * @param path Path to the file to be lazy readed
       */
      static async create(path3) {
        path3 = path3 instanceof URL ? fileURLToPath(path3) : path3;
        const { size } = await stat(path3);
        const fileBlob = new FileBlob(path3, 0, size);
        return fileBlob;
      }
      path;
      start;
      end;
      constructor(path3, start, end) {
        super();
        this.path = path3;
        this.start = start;
        this.end = end;
      }
      /**
       * Returns the size of the blob.
       */
      get size() {
        return this.end - this.start;
      }
      /**
       * Returns a new instance of FileBlob that is a slice of the current one.
       *
       * The slice is inclusive of the start and exclusive of the end.
       *
       * The slice method does not supports negative start/end.
       *
       * @param start beginning of the slice
       * @param end end of the slice
       */
      slice(start = 0, end = this.size) {
        if (start < 0 || end < 0) {
          throw new TypeError("Unsupported negative start/end on FileBlob.slice");
        }
        const slice = new FileBlob(this.path, this.start + start, Math.min(this.start + end, this.end));
        return slice;
      }
      /**
       * Read the part of the file delimited by the FileBlob and returns it as an ArrayBuffer.
       */
      async arrayBuffer() {
        const slice = await this.execute((file) => file.read(Buffer.alloc(this.size), 0, this.size, this.start));
        return slice.buffer;
      }
      /**
       * Read the part of the file delimited by the FileBlob and returns it as a string.
       */
      async text() {
        const buffer = await this.arrayBuffer();
        return buffer.toString("utf8");
      }
      /**
       * Returns a stream around the part of the file delimited by the FileBlob.
       */
      stream() {
        if (this.start === this.end) {
          return new Blob([]).stream();
        }
        return Readable2.toWeb(createReadStream(this.path, { start: this.start, end: this.end - 1 }));
      }
      /**
       * We are opening and closing the file for each action to prevent file descriptor leaks.
       *
       * It is an intended choice of developer experience over performances.
       */
      async execute(action) {
        const file = await open(this.path, "r");
        try {
          return await action(file);
        } finally {
          await file.close();
        }
      }
    };
  }
});

// node_modules/@huggingface/hub/dist/sub-paths-HFKHI55E.mjs
var sub_paths_HFKHI55E_exports = {};
__export(sub_paths_HFKHI55E_exports, {
  subPaths: () => subPaths
});
import { readdir, stat as stat2 } from "fs/promises";
import { fileURLToPath as fileURLToPath2, pathToFileURL } from "url";
async function subPaths(path3, maxDepth = 10) {
  const state = await stat2(path3);
  if (!state.isDirectory()) {
    return [{ path: path3, relativePath: "." }];
  }
  const files = await readdir(path3, { withFileTypes: true });
  const ret = [];
  for (const file of files) {
    const filePath = pathToFileURL(fileURLToPath2(path3) + "/" + file.name);
    if (file.isDirectory()) {
      ret.push(
        ...(await subPaths(filePath, maxDepth - 1)).map((subPath) => ({
          ...subPath,
          relativePath: `${file.name}/${subPath.relativePath}`
        }))
      );
    } else {
      ret.push({ path: filePath, relativePath: file.name });
    }
  }
  return ret;
}
var init_sub_paths_HFKHI55E = __esm({
  "node_modules/@huggingface/hub/dist/sub-paths-HFKHI55E.mjs"() {
    init_chunk_FFYIGW52();
  }
});

// tools/hf/_src/hf-yukle.ts
import fs2 from "node:fs";
import fsp2 from "node:fs/promises";
import path2 from "node:path";
import crypto2 from "node:crypto";
import { pathToFileURL as pathToFileURL2 } from "node:url";

// node_modules/gearhash-jit/dist/esm/table.js
var GEAR_TABLE = [
  0xb088d3a9e840f559n,
  0x5652c7f739ed20d6n,
  0x45b28969898972abn,
  0x6b0a89d5b68ec777n,
  0x368f573e8b7a31b7n,
  0x1dc636dce936d94bn,
  0x207a4c4e5554d5b6n,
  0xa474b34628239acbn,
  0x3b06a83e1ca3b912n,
  0x90e78d6c2f02baf7n,
  0xe1c92df7150d9a8an,
  0x8e95053a1086d3adn,
  0x5a2ef4f1b83a0722n,
  0xa50fac949f807faen,
  0x0e7303eb80d8d681n,
  0x99b07edc1570ad0fn,
  0x689d2fb555fd3076n,
  0x00005082119ea468n,
  0xc4b08306a88fcc28n,
  0x3eb0678af6374afdn,
  0xf19f87ab86ad7436n,
  0xf2129fbfbe6bc736n,
  0x481149575c98a4edn,
  0x0000010695477bc5n,
  0x1fba37801a9ceaccn,
  0x3bf06fd663a49b6dn,
  0x99687e9782e3874bn,
  0x79a10673aa50d8e3n,
  0xe4accf9e6211f420n,
  0x2520e71f87579071n,
  0x2bd5d3fd781a8a9bn,
  0x00de4dcddd11c873n,
  0xeaa9311c5a87392fn,
  0xdb748eb617bc40ffn,
  0xaf579a8df620bf6fn,
  0x86a6e5da1b09c2b1n,
  0xcc2fc30ac322a12en,
  0x355e2afec1f74267n,
  0x2d99c8f4c021a47bn,
  0xbade4b4a9404cfc3n,
  0xf7b518721d707d69n,
  0x3286b6587bf32c20n,
  0x0000b68886af270cn,
  0xa115d6e4db8a9079n,
  0x484f7e9c97b2e199n,
  0xccca7bb75713e301n,
  0xbf2584a62bb0f160n,
  0xade7e813625dbcc8n,
  0x000070940d87955an,
  0x8ae69108139e626fn,
  0xbd776ad72fde38a2n,
  0xfb6b001fc2fcc0cfn,
  0xc7a474b8e67bc427n,
  0xbaf6f11610eb5d58n,
  0x09cb1f5b6de770d1n,
  0xb0b219e6977d4c47n,
  0x00ccbc386ea7ad4an,
  0xcc849d0adf973f01n,
  0x73a3ef7d016af770n,
  0xc807d2d386bdbdfen,
  0x7f2ac9966c791730n,
  0xd037a86bc6c504dan,
  0xf3f17c661eaa609dn,
  0xaca626b04daae687n,
  0x755a99374f4a5b07n,
  0x90837ee65b2caeden,
  0x6ee8ad93fd560785n,
  0x0000d9e11053edd8n,
  0x9e063bb2d21cdbd7n,
  0x07ab77f12a01d2b2n,
  0xec550255e6641b44n,
  0x78fb94a8449c14c6n,
  0xc7510e1bc6c0f5f5n,
  0x0000320b36e4cae3n,
  0x827c33262c8b1a2dn,
  0x14675f0b48ea4144n,
  0x267bd3a6498decebn,
  0xf1916ff982f5035en,
  0x86221b7ff434fb88n,
  0x9dbecee7386f49d8n,
  0xea58f8cac80f8f4an,
  0x008d198692fc64d8n,
  0x6d38704fbabf9a36n,
  0xe032cb07d1e7be4cn,
  0x228d21f6ad450890n,
  0x635cb1bfc02589a5n,
  0x4620a1739ca2ce71n,
  0xa7e7dfe3aae5fb58n,
  0x0c10ca932b3c0debn,
  0x2727fee884afed7bn,
  0xa2df1c6df9e2ab1fn,
  0x4dcdd1ac0774f523n,
  0x000070ffad33e24en,
  0xa2ace87bc5977816n,
  0x9892275ab4286049n,
  0xc2861181ddf18959n,
  0xbb9972a042483e19n,
  0xef70cd3766513078n,
  0x00000513abfc9864n,
  0xc058b61858c94083n,
  0x09e850859725e0den,
  0x9197fb3bf83e7d94n,
  0x7e1e626d12b64bcen,
  0x520c54507f7b57d1n,
  0xbee1797174e22416n,
  0x6fd9ac3222e95587n,
  0x0023957c9adfbf3en,
  0xa01c7d7e234bbe15n,
  0xaba2c758b8a38cbbn,
  0x0d1fa0ceec3e2b30n,
  0x0bb6a58b7e60b991n,
  0x4333dd5b9fa26635n,
  0xc2fd3b7d4001c1a3n,
  0xfb41802454731127n,
  0x65a56185a50d18cbn,
  0xf67a02bd8784b54fn,
  0x696f11dd67e65063n,
  0x00002022fca814abn,
  0x8cd6be912db9d852n,
  0x695189b6e9ae8a57n,
  0xee9453b50ada0c28n,
  0xd8fc5ea91a78845en,
  0xab86bf191a4aa767n,
  0x0000c6b5c86415e5n,
  0x267310178e08a22en,
  0xed2d101b078bca25n,
  0x3b41ed84b226a8fbn,
  0x13e622120f28dc06n,
  0xa315f5ebfb706d26n,
  0x8816c34e3301bacen,
  0xe9395b9cbb71fdaen,
  0x002ce9202e721648n,
  0x4283db1d2bb3c91cn,
  0xd77d461ad2b1a6a5n,
  0xe2ec17e46eeb866bn,
  0xb8e0be4039fbc47cn,
  0xdea160c4d5299d04n,
  0x7eec86c8d28c3634n,
  0x2119ad129f98a399n,
  0xa6ccf46b61a283efn,
  0x2c52cedef658c617n,
  0x2db4871169acdd83n,
  0x0000f0d6f39ecbe9n,
  0x3dd5d8c98d2f9489n,
  0x8a1872a22b01f584n,
  0xf282a4c40e7b3cf2n,
  0x8020ec2ccb1ba196n,
  0x6693b6e09e59e313n,
  0x0000ce19cc7c83ebn,
  0x20cb5735f6479c3bn,
  0x762ebf3759d75a5bn,
  0x207bfe823d693975n,
  0xd77dc112339cd9d5n,
  0x9ba7834284627d03n,
  0x217dc513e95f51e9n,
  0xb27b1a29fc5e7816n,
  0x00d5cd9831bb662dn,
  0x71e39b806d75734cn,
  0x7e572af006fb1a23n,
  0xa2734f2f6ae91f85n,
  0xbf82c6b5022cddf2n,
  0x5c3beac60761a0den,
  0xcdc893bb47416998n,
  0x6d1085615c187e01n,
  0x77f8ae30ac277c5dn,
  0x917c6b81122a2c91n,
  0x5b75b699add16967n,
  0x0000cf6ae79a069bn,
  0xf3c40afa60de1104n,
  0x2063127aa59167c3n,
  0x621de62269d1894dn,
  0xd188ac1de62b4726n,
  0x107036e2154b673cn,
  0x0000b85f28553a1dn,
  0xf2ef4e4c18236f3dn,
  0xd9d6de6611b9f602n,
  0xa1fc7955fb47911cn,
  0xeb85fd032f298dbdn,
  0xbe27502fb3befae1n,
  0xe3034251c4cd661en,
  0x441364d354071836n,
  0x0082b36c75f2983en,
  0xb145910316fa66f0n,
  0x021c069c9847caf7n,
  0x2910dfc75a4b5221n,
  0x735b353e1c57a8b5n,
  0xce44312ce98ed96cn,
  0xbc942e4506bdfa65n,
  0xf05086a71257941bn,
  0xfec3b215d351ceadn,
  0x00ae1055e0144202n,
  0xf54b40846f42e454n,
  0x00007fd9c8bcbcc8n,
  0xbfbd9ef317de9bfen,
  0xa804302ff2854e12n,
  0x39ce4957a5e5d8d4n,
  0xffb9e2a45637ba84n,
  0x55b9ad1d9ea0818bn,
  0x00008acbf319178an,
  0x48e2bfc8d0fbfb38n,
  0x8be39841e848b5e8n,
  0x0e2712160696a08bn,
  0xd51096e84b44242an,
  0x1101ba176792e13an,
  0xc22e770f4531689dn,
  0x1689eff272bbc56cn,
  0x00a92a197f5650ecn,
  0xbc765990bda1784en,
  0xc61441e392fcb8aen,
  0x07e13a2ced31e4a0n,
  0x92cbe984234e9d4dn,
  0x8f4ff572bb7d8ac5n,
  0x0b9670c00b963bd0n,
  0x62955a581a03eb01n,
  0x645f83e5ea000254n,
  0x41fce516cd88f299n,
  0xbbda9748da7a98cfn,
  0x0000aab2fe4845fan,
  0x19761b069bf56555n,
  0x8b8f5e8343b6ad56n,
  0x3e5d1cfd144821d9n,
  0xec5c1e2ca2b0cd8fn,
  0xfaf7e0fea7fbb57fn,
  0x000000d3ba12961bn,
  0xda3f90178401b18en,
  0x70ff906de33a5febn,
  0x0527d5a7c06970e7n,
  0x22d8e773607c13e9n,
  0xc9ab70df643c3bacn,
  0xeda4c6dc8abe12e3n,
  0xecef1f410033e78an,
  0x0024c2b274ac72cbn,
  0x06740d954fa900b4n,
  0x1d7a299b323d6304n,
  0xb3c37cb298cbead5n,
  0xc986e3c76178739bn,
  0x9fabea364b46f58an,
  0x6da214c5af85cc56n,
  0x17a43ed8b7a38f84n,
  0x6eccec511d9adbebn,
  0xf9cab30913335afbn,
  0x4a5e60c5f415eed2n,
  0x00006967503672b4n,
  0x9da51d121454bb87n,
  0x84321e13b9bbc816n,
  0xfb3d6fb6ab2fdd8dn,
  0x60305eed8e160a8dn,
  0xcbbf4b14e9946ce8n,
  0x00004f63381b10c3n,
  0x07d5b7816fcc4e10n,
  0xe5a536726a6a8155n,
  0x57afb23447a07fddn,
  0x18f346f7abc9d394n,
  0x636dc655d61ad33dn,
  0xcc8bab4939f7f3f6n,
  0x63c7a906c1dd187bn
];

// node_modules/gearhash-jit/dist/esm/wasm.js
var TABLE_OFFSET = 0;
var HASH_OFFSET = 2048;
var MASK_OFFSET = 2056;
var INPUT_OFFSET = 4096;
var PAGES = 8;
var MAX_INPUT_SIZE = PAGES * 65536 - INPUT_OFFSET;
var wasmMemory = null;
var wasmView = null;
var wasmFn = null;
function toSignedLeb128(n) {
  const bytes = [];
  let value = n | 0;
  for (; ; ) {
    const byte = value & 127;
    value >>= 7;
    if (value === 0 && (byte & 64) === 0 || value === -1 && (byte & 64) !== 0) {
      bytes.push(byte);
      return bytes;
    }
    bytes.push(byte | 128);
  }
}
function toLebU32Padded5(n) {
  return [
    n & 127 | 128,
    n >>> 7 & 127 | 128,
    n >>> 14 & 127 | 128,
    n >>> 21 & 127 | 128,
    n >>> 28 & 15
  ];
}
function generateWasmBytes() {
  const code = [];
  function emit(...bytes) {
    code.push(...bytes);
  }
  emit(0, 97, 115, 109);
  emit(1, 0, 0, 0);
  emit(1, 7, 1, 96, 2, 127, 127, 1, 127);
  emit(2, 11, 1, 2, 106, 115, 3, 109, 101, 109, 2, 0, PAGES);
  emit(3, 2, 1, 0);
  emit(7, 13, 1, 9, 110, 101, 120, 116, 77, 97, 116, 99, 104, 0, 0);
  emit(10);
  const sectionSizeOff = code.length;
  emit(0, 0, 0, 0, 0);
  emit(1);
  const funcSizeOff = code.length;
  emit(0, 0, 0, 0, 0);
  const bodyStart = code.length;
  emit(2, 2, 126, 2, 127);
  emit(65, ...toSignedLeb128(HASH_OFFSET));
  emit(41, 3, 0);
  emit(33, 2);
  emit(65, ...toSignedLeb128(MASK_OFFSET));
  emit(41, 3, 0);
  emit(33, 3);
  emit(32, 0);
  emit(33, 4);
  emit(32, 0);
  emit(32, 1);
  emit(106);
  emit(33, 5);
  emit(2, 64);
  emit(3, 64);
  emit(32, 4);
  emit(32, 5);
  emit(78);
  emit(13, 1);
  emit(32, 2);
  emit(66, 1);
  emit(134);
  emit(32, 4);
  emit(45, 0, 0);
  emit(65, 3);
  emit(116);
  emit(41, 3, 0);
  emit(124);
  emit(34, 2);
  emit(32, 3);
  emit(131);
  emit(80);
  emit(4, 64);
  emit(65, ...toSignedLeb128(HASH_OFFSET));
  emit(32, 2);
  emit(55, 3, 0);
  emit(32, 4);
  emit(32, 0);
  emit(107);
  emit(65, 1);
  emit(106);
  emit(15);
  emit(11);
  emit(32, 4);
  emit(65, 1);
  emit(106);
  emit(33, 4);
  emit(12, 0);
  emit(11);
  emit(11);
  emit(65, ...toSignedLeb128(HASH_OFFSET));
  emit(32, 2);
  emit(55, 3, 0);
  emit(65, 127);
  emit(11);
  const bodySize = code.length - bodyStart;
  const bsPatch = toLebU32Padded5(bodySize);
  for (let i = 0; i < 5; i++)
    code[funcSizeOff + i] = bsPatch[i];
  const secSize = code.length - sectionSizeOff - 5;
  const ssPatch = toLebU32Padded5(secSize);
  for (let i = 0; i < 5; i++)
    code[sectionSizeOff + i] = ssPatch[i];
  return new Uint8Array(code);
}
function initWasm() {
  if (wasmFn)
    return;
  const bytes = generateWasmBytes();
  wasmMemory = new WebAssembly.Memory({ initial: PAGES });
  const module = new WebAssembly.Module(bytes);
  const instance = new WebAssembly.Instance(module, { js: { mem: wasmMemory } });
  wasmFn = instance.exports.nextMatch;
  wasmView = new Uint8Array(wasmMemory.buffer);
  const dv = new DataView(wasmMemory.buffer);
  for (let i = 0; i < 256; i++) {
    dv.setBigUint64(TABLE_OFFSET + i * 8, GEAR_TABLE[i], true);
  }
}
function wasmNextMatch(inputStart, inputLen) {
  return wasmFn(inputStart, inputLen);
}
function getView() {
  return wasmView;
}

// node_modules/gearhash-jit/dist/esm/index.js
var Hasher = class {
  maskBytes;
  /**
   * The current 64-bit rolling hash state as 8 little-endian bytes.
   * Updated after every `nextMatch` call. Zeroed by `resetHash()`.
   */
  hash;
  constructor(mask) {
    initWasm();
    this.maskBytes = new Uint8Array(8);
    this.hash = new Uint8Array(8);
    new DataView(this.maskBytes.buffer).setBigUint64(0, mask, true);
  }
  /**
   * Scan `buf` for the next gear-hash match. The internal hash state
   * carries over between calls (for split-buffer scanning).
   *
   * @returns 1-based byte position of the match, or -1 if none found.
   */
  nextMatch(buf) {
    const len = buf.length;
    if (len === 0)
      return -1;
    if (len > MAX_INPUT_SIZE) {
      throw new RangeError(`Input too large: ${len} > ${MAX_INPUT_SIZE}`);
    }
    const view = getView();
    view.set(this.hash, HASH_OFFSET);
    view.set(this.maskBytes, MASK_OFFSET);
    view.set(buf, INPUT_OFFSET);
    const pos = wasmNextMatch(INPUT_OFFSET, len);
    this.hash.set(view.subarray(HASH_OFFSET, HASH_OFFSET + 8));
    return pos;
  }
  /** Reset rolling hash to zero (call when starting a new chunk). */
  resetHash() {
    this.hash.fill(0);
  }
};

// node_modules/@huggingface/blake3-jit/dist/esm/compress.js
function compress(cv, cvOff, block, blockOff, out, outOff, full, counter, blockLen, flags) {
  let m0 = block[blockOff] | 0;
  let m1 = block[blockOff + 1] | 0;
  let m2 = block[blockOff + 2] | 0;
  let m3 = block[blockOff + 3] | 0;
  let m4 = block[blockOff + 4] | 0;
  let m5 = block[blockOff + 5] | 0;
  let m6 = block[blockOff + 6] | 0;
  let m7 = block[blockOff + 7] | 0;
  let m8 = block[blockOff + 8] | 0;
  let m9 = block[blockOff + 9] | 0;
  let m10 = block[blockOff + 10] | 0;
  let m11 = block[blockOff + 11] | 0;
  let m12 = block[blockOff + 12] | 0;
  let m13 = block[blockOff + 13] | 0;
  let m14 = block[blockOff + 14] | 0;
  let m15 = block[blockOff + 15] | 0;
  let s0 = cv[cvOff] | 0;
  let s1 = cv[cvOff + 1] | 0;
  let s2 = cv[cvOff + 2] | 0;
  let s3 = cv[cvOff + 3] | 0;
  let s4 = cv[cvOff + 4] | 0;
  let s5 = cv[cvOff + 5] | 0;
  let s6 = cv[cvOff + 6] | 0;
  let s7 = cv[cvOff + 7] | 0;
  let s8 = 1779033703;
  let s9 = 3144134277;
  let s10 = 1013904242;
  let s11 = 2773480762;
  let s12 = counter | 0;
  let s13 = counter / 4294967296 | 0;
  let s14 = blockLen | 0;
  let s15 = flags | 0;
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  {
    const t0 = m0, t1 = m1;
    m0 = m2;
    m2 = m3;
    m3 = m10;
    m10 = m12;
    m12 = m9;
    m9 = m11;
    m11 = m5;
    m5 = t0;
    m1 = m6;
    m6 = m4;
    m4 = m7;
    m7 = m13;
    m13 = m14;
    m14 = m15;
    m15 = m8;
    m8 = t1;
  }
  s0 = (s0 + s4 | 0) + m0 | 0;
  s12 ^= s0;
  s12 = s12 >>> 16 | s12 << 16;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 12 | s4 << 20;
  s0 = (s0 + s4 | 0) + m1 | 0;
  s12 ^= s0;
  s12 = s12 >>> 8 | s12 << 24;
  s8 = s8 + s12 | 0;
  s4 ^= s8;
  s4 = s4 >>> 7 | s4 << 25;
  s1 = (s1 + s5 | 0) + m2 | 0;
  s13 ^= s1;
  s13 = s13 >>> 16 | s13 << 16;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 12 | s5 << 20;
  s1 = (s1 + s5 | 0) + m3 | 0;
  s13 ^= s1;
  s13 = s13 >>> 8 | s13 << 24;
  s9 = s9 + s13 | 0;
  s5 ^= s9;
  s5 = s5 >>> 7 | s5 << 25;
  s2 = (s2 + s6 | 0) + m4 | 0;
  s14 ^= s2;
  s14 = s14 >>> 16 | s14 << 16;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 12 | s6 << 20;
  s2 = (s2 + s6 | 0) + m5 | 0;
  s14 ^= s2;
  s14 = s14 >>> 8 | s14 << 24;
  s10 = s10 + s14 | 0;
  s6 ^= s10;
  s6 = s6 >>> 7 | s6 << 25;
  s3 = (s3 + s7 | 0) + m6 | 0;
  s15 ^= s3;
  s15 = s15 >>> 16 | s15 << 16;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 12 | s7 << 20;
  s3 = (s3 + s7 | 0) + m7 | 0;
  s15 ^= s3;
  s15 = s15 >>> 8 | s15 << 24;
  s11 = s11 + s15 | 0;
  s7 ^= s11;
  s7 = s7 >>> 7 | s7 << 25;
  s0 = (s0 + s5 | 0) + m8 | 0;
  s15 ^= s0;
  s15 = s15 >>> 16 | s15 << 16;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 12 | s5 << 20;
  s0 = (s0 + s5 | 0) + m9 | 0;
  s15 ^= s0;
  s15 = s15 >>> 8 | s15 << 24;
  s10 = s10 + s15 | 0;
  s5 ^= s10;
  s5 = s5 >>> 7 | s5 << 25;
  s1 = (s1 + s6 | 0) + m10 | 0;
  s12 ^= s1;
  s12 = s12 >>> 16 | s12 << 16;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 12 | s6 << 20;
  s1 = (s1 + s6 | 0) + m11 | 0;
  s12 ^= s1;
  s12 = s12 >>> 8 | s12 << 24;
  s11 = s11 + s12 | 0;
  s6 ^= s11;
  s6 = s6 >>> 7 | s6 << 25;
  s2 = (s2 + s7 | 0) + m12 | 0;
  s13 ^= s2;
  s13 = s13 >>> 16 | s13 << 16;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 12 | s7 << 20;
  s2 = (s2 + s7 | 0) + m13 | 0;
  s13 ^= s2;
  s13 = s13 >>> 8 | s13 << 24;
  s8 = s8 + s13 | 0;
  s7 ^= s8;
  s7 = s7 >>> 7 | s7 << 25;
  s3 = (s3 + s4 | 0) + m14 | 0;
  s14 ^= s3;
  s14 = s14 >>> 16 | s14 << 16;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 12 | s4 << 20;
  s3 = (s3 + s4 | 0) + m15 | 0;
  s14 ^= s3;
  s14 = s14 >>> 8 | s14 << 24;
  s9 = s9 + s14 | 0;
  s4 ^= s9;
  s4 = s4 >>> 7 | s4 << 25;
  if (full) {
    out[outOff + 8] = s8 ^ cv[cvOff];
    out[outOff + 9] = s9 ^ cv[cvOff + 1];
    out[outOff + 10] = s10 ^ cv[cvOff + 2];
    out[outOff + 11] = s11 ^ cv[cvOff + 3];
    out[outOff + 12] = s12 ^ cv[cvOff + 4];
    out[outOff + 13] = s13 ^ cv[cvOff + 5];
    out[outOff + 14] = s14 ^ cv[cvOff + 6];
    out[outOff + 15] = s15 ^ cv[cvOff + 7];
  }
  out[outOff] = s0 ^ s8;
  out[outOff + 1] = s1 ^ s9;
  out[outOff + 2] = s2 ^ s10;
  out[outOff + 3] = s3 ^ s11;
  out[outOff + 4] = s4 ^ s12;
  out[outOff + 5] = s5 ^ s13;
  out[outOff + 6] = s6 ^ s14;
  out[outOff + 7] = s7 ^ s15;
}

// node_modules/@huggingface/blake3-jit/dist/esm/constants.js
var IV = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var CHUNK_START = 1;
var CHUNK_END = 1 << 1;
var PARENT = 1 << 2;
var ROOT = 1 << 3;
var KEYED_HASH = 1 << 4;
var DERIVE_KEY_CONTEXT = 1 << 5;
var DERIVE_KEY_MATERIAL = 1 << 6;
var OUT_LEN = 32;
var KEY_LEN = 32;
var BLOCK_LEN = 64;
var CHUNK_LEN = 1024;
var MAX_DEPTH = 54;
var PERMUTATIONS = new Uint8Array([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  2,
  6,
  3,
  10,
  7,
  0,
  4,
  13,
  1,
  11,
  12,
  5,
  9,
  14,
  15,
  8,
  3,
  4,
  10,
  12,
  13,
  2,
  7,
  14,
  6,
  5,
  9,
  0,
  11,
  15,
  8,
  1,
  10,
  7,
  12,
  9,
  14,
  3,
  13,
  15,
  4,
  0,
  11,
  2,
  5,
  8,
  1,
  6,
  12,
  13,
  9,
  11,
  15,
  10,
  14,
  8,
  7,
  2,
  5,
  3,
  0,
  1,
  6,
  4,
  9,
  14,
  11,
  5,
  8,
  12,
  15,
  1,
  13,
  3,
  0,
  10,
  2,
  6,
  4,
  7,
  11,
  15,
  5,
  0,
  1,
  9,
  8,
  6,
  14,
  10,
  2,
  12,
  3,
  4,
  7,
  13
]);

// node_modules/@huggingface/blake3-jit/dist/esm/utils.js
var IS_LITTLE_ENDIAN = new Uint8Array(new Uint32Array([16909060]).buffer)[0] === 4;
function readLittleEndianWordsFull(input, offset, words) {
  for (let i = 0; i < 16; ++i, offset += 4) {
    words[i] = input[offset] | input[offset + 1] << 8 | input[offset + 2] << 16 | input[offset + 3] << 24;
  }
}
function writeLittleEndianBytesPartial(words, wordOffset, output, byteOffset, byteCount) {
  const fullWords = byteCount >>> 2;
  let i = 0;
  for (; i < fullWords; ++i, byteOffset += 4) {
    const w = words[wordOffset + i];
    output[byteOffset] = w & 255;
    output[byteOffset + 1] = w >>> 8 & 255;
    output[byteOffset + 2] = w >>> 16 & 255;
    output[byteOffset + 3] = w >>> 24 & 255;
  }
  const remaining2 = byteCount & 3;
  if (remaining2 > 0) {
    const w = words[wordOffset + i];
    output[byteOffset] = w & 255;
    if (remaining2 > 1)
      output[byteOffset + 1] = w >>> 8 & 255;
    if (remaining2 > 2)
      output[byteOffset + 2] = w >>> 16 & 255;
  }
}
function encodeUTF8(str) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(192 | c >> 6, 128 | c & 63);
    } else if (c < 55296 || c >= 57344) {
      bytes.push(224 | c >> 12, 128 | c >> 6 & 63, 128 | c & 63);
    } else {
      i++;
      c = 65536 + ((c & 1023) << 10 | str.charCodeAt(i) & 1023);
      bytes.push(240 | c >> 18, 128 | c >> 12 & 63, 128 | c >> 6 & 63, 128 | c & 63);
    }
  }
  return new Uint8Array(bytes);
}
var CTZ32_TABLE = new Uint8Array([
  0,
  1,
  28,
  2,
  29,
  14,
  24,
  3,
  30,
  22,
  20,
  15,
  25,
  17,
  4,
  8,
  31,
  27,
  13,
  23,
  21,
  19,
  16,
  7,
  26,
  12,
  18,
  6,
  11,
  5,
  10,
  9
]);

// node_modules/@huggingface/blake3-jit/dist/esm/hasher.js
var XofReader = class {
  inputCv;
  blockWords;
  counter;
  blockLen;
  flags;
  outputBlock;
  outputBlockOffset;
  constructor(inputCv, blockWords, counter, blockLen, flags) {
    this.inputCv = inputCv;
    this.blockWords = blockWords;
    this.counter = counter;
    this.blockLen = blockLen;
    this.flags = flags | ROOT;
    this.outputBlock = new Uint32Array(16);
    this.outputBlockOffset = 64;
  }
  /**
   * Read the next `length` bytes of output.
   */
  read(length) {
    const output = new Uint8Array(length);
    let outputOffset = 0;
    while (outputOffset < length) {
      if (this.outputBlockOffset >= 64) {
        compress(
          this.inputCv,
          0,
          this.blockWords,
          0,
          this.outputBlock,
          0,
          true,
          // full 64-byte output
          this.counter++,
          this.blockLen,
          this.flags
        );
        this.outputBlockOffset = 0;
      }
      const available = 64 - this.outputBlockOffset;
      const toCopy = Math.min(available, length - outputOffset);
      const wordOffset = this.outputBlockOffset >>> 2;
      const byteWithinWord = this.outputBlockOffset & 3;
      if (byteWithinWord === 0 && toCopy >= 4) {
        const fullWords = toCopy >>> 2;
        writeLittleEndianBytesPartial(this.outputBlock, wordOffset, output, outputOffset, fullWords << 2);
        const bytesCopied = fullWords << 2;
        outputOffset += bytesCopied;
        this.outputBlockOffset += bytesCopied;
      } else {
        for (let i = 0; i < toCopy; i++) {
          const wordIdx = this.outputBlockOffset + i >>> 2;
          const byteIdx = this.outputBlockOffset + i & 3;
          output[outputOffset + i] = this.outputBlock[wordIdx] >>> (byteIdx << 3) & 255;
        }
        outputOffset += toCopy;
        this.outputBlockOffset += toCopy;
      }
    }
    return output;
  }
};
var ChunkState = class {
  chainingValue;
  chunkCounter;
  blockWords;
  blockLen;
  blocksCompressed;
  flags;
  constructor(keyWords, chunkCounter, flags) {
    this.chainingValue = new Uint32Array(keyWords);
    this.chunkCounter = chunkCounter;
    this.blockWords = new Uint32Array(16);
    this.blockLen = 0;
    this.blocksCompressed = 0;
    this.flags = flags;
  }
  resetTo(keyWords, chunkCounter, flags) {
    this.chainingValue.set(keyWords);
    this.chunkCounter = chunkCounter;
    this.blockLen = 0;
    this.blocksCompressed = 0;
    this.flags = flags;
  }
  /**
   * Get the flags for the current block.
   */
  startFlag() {
    return this.blocksCompressed === 0 ? CHUNK_START : 0;
  }
  /**
   * Update the chunk state with input data.
   * Returns the number of bytes consumed.
   */
  update(input, inputOffset, inputLen) {
    let consumed = 0;
    while (inputLen > 0) {
      if (this.blockLen === BLOCK_LEN) {
        compress(this.chainingValue, 0, this.blockWords, 0, this.chainingValue, 0, false, this.chunkCounter, BLOCK_LEN, this.flags | this.startFlag());
        this.blocksCompressed++;
        this.blockLen = 0;
      }
      const want = BLOCK_LEN - this.blockLen;
      const take = Math.min(want, inputLen);
      if (this.blockLen === 0 && take === BLOCK_LEN) {
        readLittleEndianWordsFull(input, inputOffset, this.blockWords);
      } else {
        for (let i = 0; i < take; i++) {
          const pos = this.blockLen + i;
          const wordIdx = pos >>> 2;
          const byteIdx = pos & 3;
          if (byteIdx === 0) {
            this.blockWords[wordIdx] = input[inputOffset + i];
          } else {
            this.blockWords[wordIdx] |= input[inputOffset + i] << (byteIdx << 3);
          }
        }
      }
      this.blockLen += take;
      inputOffset += take;
      inputLen -= take;
      consumed += take;
    }
    return consumed;
  }
  /**
   * Finalize this chunk and return its output.
   * Returns 8 words (chaining value) or 16 words (if root).
   */
  output() {
    const usedWords = this.blockLen + 3 >>> 2;
    for (let i = usedWords; i < 16; i++) {
      this.blockWords[i] = 0;
    }
    return {
      inputCv: this.chainingValue,
      blockWords: this.blockWords,
      blockLen: this.blockLen,
      counter: this.chunkCounter,
      flags: this.flags | this.startFlag() | CHUNK_END
    };
  }
  /**
   * Get the number of bytes in this chunk.
   */
  len() {
    return this.blocksCompressed * BLOCK_LEN + this.blockLen;
  }
};
var Hasher2 = class _Hasher {
  chunkState;
  keyWords;
  cvStack;
  cvStackLen;
  flags;
  parentBlock;
  parentCv;
  chunkCv;
  outWords;
  finalizeCv;
  /**
   * Create a new Hasher.
   *
   * @param keyWords - Initial key words (IV for regular hashing)
   * @param flags - Domain separation flags
   */
  constructor(keyWords, flags) {
    this.keyWords = keyWords ? new Uint32Array(keyWords) : new Uint32Array(IV);
    this.flags = flags ?? 0;
    this.chunkState = new ChunkState(this.keyWords, 0, this.flags);
    this.cvStack = new Uint32Array(MAX_DEPTH * 8);
    this.cvStackLen = 0;
    this.parentBlock = new Uint32Array(16);
    this.parentCv = new Uint32Array(8);
    this.chunkCv = new Uint32Array(8);
    this.outWords = new Uint32Array(16);
    this.finalizeCv = new Uint32Array(8);
  }
  /**
   * Reset the hasher to process a new message with the same key/flags.
   * Reuses all internal buffers — zero allocations.
   */
  reset() {
    this.chunkState.resetTo(this.keyWords, 0, this.flags);
    this.cvStackLen = 0;
    return this;
  }
  /**
   * Create a new keyed hasher (MAC).
   *
   * @param key - 32-byte key
   */
  static newKeyed(key) {
    if (key.length !== KEY_LEN) {
      throw new Error(`Key must be ${KEY_LEN} bytes, got ${key.length}`);
    }
    const keyWords = new Uint32Array(8);
    if (IS_LITTLE_ENDIAN) {
      const view = new Uint32Array(key.buffer, key.byteOffset, 8);
      keyWords.set(view);
    } else {
      for (let i = 0; i < 8; i++) {
        const off = i * 4;
        keyWords[i] = key[off] | key[off + 1] << 8 | key[off + 2] << 16 | key[off + 3] << 24;
      }
    }
    return new _Hasher(keyWords, KEYED_HASH);
  }
  /**
   * Create a new key derivation hasher.
   *
   * @param context - Context string for domain separation
   */
  static newDeriveKey(context) {
    const contextBytes = encodeUTF8(context);
    const contextHasher = new _Hasher(new Uint32Array(IV), DERIVE_KEY_CONTEXT);
    contextHasher.update(contextBytes);
    const contextKey = new Uint32Array(8);
    const output = contextHasher.finalizeOutput();
    compress(output.inputCv, 0, output.blockWords, 0, contextKey, 0, false, output.counter, output.blockLen, output.flags | ROOT);
    return new _Hasher(contextKey, DERIVE_KEY_MATERIAL);
  }
  /**
   * Push a chaining value onto the stack.
   */
  pushCv(cv, cvOffset) {
    this.cvStack.set(cv.subarray(cvOffset, cvOffset + 8), this.cvStackLen * 8);
    this.cvStackLen++;
  }
  /**
   * Pop a chaining value from the stack.
   */
  popCv(out, outOffset) {
    this.cvStackLen--;
    out.set(this.cvStack.subarray(this.cvStackLen * 8, (this.cvStackLen + 1) * 8), outOffset);
  }
  /**
   * Add a chunk's chaining value and merge completed subtrees.
   */
  addChunkCv(newCv, newCvOffset, totalChunks) {
    const parentBlock = this.parentBlock;
    const parentCv = this.parentCv;
    while ((totalChunks & 1) === 0) {
      this.popCv(parentBlock, 0);
      parentBlock.set(newCv.subarray(newCvOffset, newCvOffset + 8), 8);
      compress(this.keyWords, 0, parentBlock, 0, parentCv, 0, false, 0, BLOCK_LEN, this.flags | PARENT);
      newCv = parentCv;
      newCvOffset = 0;
      totalChunks >>>= 1;
    }
    this.pushCv(newCv, newCvOffset);
  }
  /**
   * Update the hasher with input data.
   *
   * @param input - Data to hash
   * @returns this (for chaining)
   */
  update(input) {
    let inputOffset = 0;
    let inputLen = input.length;
    while (inputLen > 0) {
      if (this.chunkState.len() === CHUNK_LEN) {
        const output = this.chunkState.output();
        const chunkCv = this.chunkCv;
        compress(output.inputCv, 0, output.blockWords, 0, chunkCv, 0, false, output.counter, output.blockLen, output.flags);
        const totalChunks = this.chunkState.chunkCounter + 1;
        this.addChunkCv(chunkCv, 0, totalChunks);
        this.chunkState.resetTo(this.keyWords, totalChunks, this.flags);
      }
      const want = CHUNK_LEN - this.chunkState.len();
      const take = Math.min(want, inputLen);
      this.chunkState.update(input, inputOffset, take);
      inputOffset += take;
      inputLen -= take;
    }
    return this;
  }
  /**
   * Get the output parameters (for XOF mode or finalization).
   */
  finalizeOutput() {
    let output = this.chunkState.output();
    let parentBlock = this.parentBlock;
    let cv = this.finalizeCv;
    if (this.cvStackLen > 0) {
      compress(output.inputCv, 0, output.blockWords, 0, cv, 0, false, output.counter, output.blockLen, output.flags);
      while (this.cvStackLen > 0) {
        this.cvStackLen--;
        parentBlock.set(this.cvStack.subarray(this.cvStackLen * 8, (this.cvStackLen + 1) * 8), 0);
        parentBlock.set(cv, 8);
        if (this.cvStackLen > 0) {
          compress(this.keyWords, 0, parentBlock, 0, cv, 0, false, 0, BLOCK_LEN, this.flags | PARENT);
        } else {
          return {
            inputCv: this.keyWords,
            blockWords: parentBlock,
            blockLen: BLOCK_LEN,
            counter: 0,
            flags: this.flags | PARENT
          };
        }
      }
    }
    return output;
  }
  /**
   * Finalize the hash and return the result.
   *
   * @param outputLength - Number of bytes to output (default: 32)
   * @returns The hash output
   */
  finalize(outputLength = OUT_LEN) {
    const output = this.finalizeOutput();
    const result = new Uint8Array(outputLength);
    if (outputLength <= 64) {
      const outWords = this.outWords;
      compress(
        output.inputCv,
        0,
        output.blockWords,
        0,
        outWords,
        0,
        outputLength > 32,
        // full output if > 32 bytes
        output.counter,
        output.blockLen,
        output.flags | ROOT
      );
      if (IS_LITTLE_ENDIAN) {
        const outBytes = new Uint8Array(outWords.buffer);
        result.set(outBytes.subarray(0, outputLength));
      } else {
        writeLittleEndianBytesPartial(outWords, 0, result, 0, outputLength);
      }
    } else {
      const xof = this.finalizeXof();
      const full = xof.read(outputLength);
      result.set(full);
    }
    return result;
  }
  /**
   * Finalize and return an XOF reader for arbitrary-length output.
   */
  finalizeXof() {
    const output = this.finalizeOutput();
    return new XofReader(new Uint32Array(output.inputCv), new Uint32Array(output.blockWords), output.counter, output.blockLen, output.flags);
  }
};

// node_modules/@huggingface/blake3-jit/dist/esm/wasm-simd.js
function toLebU32Min2(n) {
  return [n & 127 | 128, n >>> 7 & 127];
}
function toLebU32Padded52(n) {
  return [
    n & 127 | 128,
    n >>> 7 & 127 | 128,
    n >>> 14 & 127 | 128,
    n >>> 21 & 127 | 128,
    n >>> 28 & 15
    // Last byte has no continuation bit
  ];
}
function toSignedLeb128_i32(n) {
  const bytes = [];
  let value = n | 0;
  let more = true;
  while (more) {
    let byte = value & 127;
    value >>= 7;
    if (value === 0 && (byte & 64) === 0 || value === -1 && (byte & 64) !== 0) {
      more = false;
    } else {
      byte |= 128;
    }
    bytes.push(byte);
  }
  return bytes;
}
var MSG_ACCESS_ORDER = [
  // Round 1: 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  // Round 2: 2,6,3,10,7,0,4,13,1,11,12,5,9,14,15,8
  2,
  6,
  3,
  10,
  7,
  0,
  4,
  13,
  1,
  11,
  12,
  5,
  9,
  14,
  15,
  8,
  // Round 3: 3,4,10,12,13,2,7,14,6,5,9,0,11,15,8,1
  3,
  4,
  10,
  12,
  13,
  2,
  7,
  14,
  6,
  5,
  9,
  0,
  11,
  15,
  8,
  1,
  // Round 4: 10,7,12,9,14,3,13,15,4,0,11,2,5,8,1,6
  10,
  7,
  12,
  9,
  14,
  3,
  13,
  15,
  4,
  0,
  11,
  2,
  5,
  8,
  1,
  6,
  // Round 5: 12,13,9,11,15,10,14,8,7,2,5,3,0,1,6,4
  12,
  13,
  9,
  11,
  15,
  10,
  14,
  8,
  7,
  2,
  5,
  3,
  0,
  1,
  6,
  4,
  // Round 6: 9,14,11,5,8,12,15,1,13,3,0,10,2,6,4,7
  9,
  14,
  11,
  5,
  8,
  12,
  15,
  1,
  13,
  3,
  0,
  10,
  2,
  6,
  4,
  7,
  // Round 7: 11,15,5,0,1,9,8,6,14,10,2,12,3,4,7,13
  11,
  15,
  5,
  0,
  1,
  9,
  8,
  6,
  14,
  10,
  2,
  12,
  3,
  4,
  7,
  13
];
function generateWasmBytes2() {
  const code = [];
  function put(bytes) {
    code.push(...bytes);
  }
  put([0, 97, 115, 109]);
  put([1, 0, 0, 0]);
  put([1]);
  put([4]);
  put([1]);
  put([96, 0, 0]);
  put([2]);
  put([11]);
  put([1]);
  put([2, 106, 115]);
  put([3, 109, 101, 109]);
  put([2, 0, 1]);
  put([3]);
  put([4]);
  put([3]);
  put([0]);
  put([0]);
  put([0]);
  put([7]);
  put([50]);
  put([3]);
  put([10]);
  put([99, 111, 109, 112, 114, 101, 115, 115, 52, 120]);
  put([0, 0]);
  put([16]);
  put([
    99,
    111,
    109,
    112,
    114,
    101,
    115,
    115,
    67,
    104,
    117,
    110,
    107,
    115,
    52,
    120
  ]);
  put([0, 1]);
  put([14]);
  put([99, 111, 109, 112, 114, 101, 115, 115, 80, 97, 114, 101, 110, 116]);
  put([0, 2]);
  put([10]);
  const sectionSizeOffset = code.length;
  put([0, 0, 0, 0, 0]);
  put([3]);
  const funcSizeOffset = code.length;
  put([0, 0, 0, 0, 0]);
  const funcBodyStart = code.length;
  put([1]);
  put([32, 123]);
  for (let i = 0; i < 16; i++) {
    put([65, ...toLebU32Min2(i * 16)]);
    put([253, 0, 2, 0]);
    put([33, i]);
  }
  for (let i = 0; i < 8; i++) {
    put([65, ...toLebU32Min2(512 + i * 16)]);
    put([253, 0, 2, 0]);
    put([33, 16 + i]);
  }
  const IV2 = [1779033703, 3144134277, 1013904242, 2773480762];
  for (let i = 0; i < 4; i++) {
    const ivBytes = [];
    for (let j = 0; j < 4; j++) {
      ivBytes.push(IV2[i] & 255);
      ivBytes.push(IV2[i] >>> 8 & 255);
      ivBytes.push(IV2[i] >>> 16 & 255);
      ivBytes.push(IV2[i] >>> 24 & 255);
    }
    put([253, 12, ...ivBytes]);
    put([33, 24 + i]);
  }
  put([65, ...toLebU32Min2(768)]);
  put([253, 0, 2, 0]);
  put([33, 28]);
  put([65, ...toLebU32Min2(784)]);
  put([253, 0, 2, 0]);
  put([33, 29]);
  put([65, ...toLebU32Min2(800)]);
  put([253, 0, 2, 0]);
  put([33, 30]);
  put([65, ...toLebU32Min2(816)]);
  put([253, 0, 2, 0]);
  put([33, 31]);
  let msgIdx = 0;
  function g(a, b, c, d) {
    const mx = MSG_ACCESS_ORDER[msgIdx++];
    const my = MSG_ACCESS_ORDER[msgIdx++];
    put([32, 16 + a]);
    put([32, 16 + b]);
    put([253, 174, 1]);
    put([32, mx]);
    put([253, 174, 1]);
    put([33, 16 + a]);
    put([32, 16 + d]);
    put([32, 16 + a]);
    put([253, 81]);
    put([34, 16 + d]);
    put([32, 16 + d]);
    put([253, 13, 2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13]);
    put([33, 16 + d]);
    put([32, 16 + c]);
    put([32, 16 + d]);
    put([253, 174, 1]);
    put([33, 16 + c]);
    put([32, 16 + b]);
    put([32, 16 + c]);
    put([253, 81]);
    put([34, 16 + b]);
    put([65, 12]);
    put([253, 173, 1]);
    put([32, 16 + b]);
    put([65, 20]);
    put([253, 171, 1]);
    put([253, 80]);
    put([33, 16 + b]);
    put([32, 16 + a]);
    put([32, 16 + b]);
    put([253, 174, 1]);
    put([32, my]);
    put([253, 174, 1]);
    put([33, 16 + a]);
    put([32, 16 + d]);
    put([32, 16 + a]);
    put([253, 81]);
    put([34, 16 + d]);
    put([32, 16 + d]);
    put([253, 13, 1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8, 13, 14, 15, 12]);
    put([33, 16 + d]);
    put([32, 16 + c]);
    put([32, 16 + d]);
    put([253, 174, 1]);
    put([33, 16 + c]);
    put([32, 16 + b]);
    put([32, 16 + c]);
    put([253, 81]);
    put([34, 16 + b]);
    put([65, 7]);
    put([253, 173, 1]);
    put([32, 16 + b]);
    put([65, 25]);
    put([253, 171, 1]);
    put([253, 80]);
    put([33, 16 + b]);
  }
  for (let round = 0; round < 7; round++) {
    g(0, 4, 8, 12);
    g(1, 5, 9, 13);
    g(2, 6, 10, 14);
    g(3, 7, 11, 15);
    g(0, 5, 10, 15);
    g(1, 6, 11, 12);
    g(2, 7, 8, 13);
    g(3, 4, 9, 14);
  }
  for (let i = 0; i < 8; i++) {
    put([65, ...toLebU32Min2(640 + i * 16)]);
    put([32, 16 + i]);
    put([32, 24 + i]);
    put([253, 81]);
    put([253, 11, 2, 0]);
  }
  put([11]);
  const funcBodySize = code.length - funcBodyStart;
  const funcSizeBytes = toLebU32Padded52(funcBodySize);
  for (let i = 0; i < 5; i++) {
    code[funcSizeOffset + i] = funcSizeBytes[i];
  }
  const func1SizeOffset = code.length;
  put([0, 0, 0, 0, 0]);
  const func1BodyStart = code.length;
  const compressChunksBody = generateCompressChunks4xBody();
  put(compressChunksBody);
  const func1BodySize = code.length - func1BodyStart;
  const func1SizeBytes = toLebU32Padded52(func1BodySize);
  for (let i = 0; i < 5; i++) {
    code[func1SizeOffset + i] = func1SizeBytes[i];
  }
  const func2SizeOffset = code.length;
  put([0, 0, 0, 0, 0]);
  const func2BodyStart = code.length;
  const compressParentBody = generateCompressParentBody();
  put(compressParentBody);
  const func2BodySize = code.length - func2BodyStart;
  const func2SizeBytes = toLebU32Padded52(func2BodySize);
  for (let i = 0; i < 5; i++) {
    code[func2SizeOffset + i] = func2SizeBytes[i];
  }
  const sectionSize = code.length - sectionSizeOffset - 5;
  const sectionSizeBytes = toLebU32Padded52(sectionSize);
  for (let i = 0; i < 5; i++) {
    code[sectionSizeOffset + i] = sectionSizeBytes[i];
  }
  return new Uint8Array(code);
}
function generateCompressChunks4xBody() {
  const code = [];
  function put(bytes) {
    code.push(...bytes);
  }
  put([2]);
  put([32, 123]);
  put([1, 127]);
  const BATCH_BLOCK_WORDS = SIMD_MEMORY.BATCH_BLOCK_WORDS;
  const BATCH_CV = SIMD_MEMORY.BATCH_CV;
  const BATCH_COUNTER_LOW = SIMD_MEMORY.BATCH_COUNTER_LOW;
  const BATCH_FLAGS_BASE = SIMD_MEMORY.BATCH_FLAGS_BASE;
  const BATCH_OUTPUT = SIMD_MEMORY.BATCH_OUTPUT;
  const IV2 = [1779033703, 3144134277, 1013904242, 2773480762];
  for (let i = 0; i < 8; i++) {
    put([65, ...toLebU32Min2(BATCH_CV + i * 16)]);
    put([253, 0, 2, 0]);
    put([33, 16 + i]);
  }
  put([65, 0]);
  put([33, 32]);
  put([2, 64]);
  put([3, 64]);
  for (let w = 0; w < 16; w++) {
    put([32, 32]);
    put([65, ...toLebU32Min2(256)]);
    put([108]);
    put([65, ...toLebU32Min2(BATCH_BLOCK_WORDS + w * 16)]);
    put([106]);
    put([253, 0, 2, 0]);
    put([33, w]);
  }
  for (let i = 0; i < 4; i++) {
    const ivBytes = [];
    for (let j = 0; j < 4; j++) {
      ivBytes.push(IV2[i] & 255);
      ivBytes.push(IV2[i] >>> 8 & 255);
      ivBytes.push(IV2[i] >>> 16 & 255);
      ivBytes.push(IV2[i] >>> 24 & 255);
    }
    put([253, 12, ...ivBytes]);
    put([33, 24 + i]);
  }
  put([65, ...toLebU32Min2(BATCH_COUNTER_LOW)]);
  put([253, 0, 2, 0]);
  put([33, 28]);
  put([253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  put([33, 29]);
  const blockLen64 = [];
  for (let j = 0; j < 4; j++) {
    blockLen64.push(64, 0, 0, 0);
  }
  put([253, 12, ...blockLen64]);
  put([33, 30]);
  put([65, ...toLebU32Min2(BATCH_FLAGS_BASE)]);
  put([253, 0, 2, 0]);
  put([32, 32]);
  put([69]);
  put([32, 32]);
  put([65, 15]);
  put([70]);
  put([65, 1]);
  put([116]);
  put([114]);
  put([253, 17]);
  put([253, 80]);
  put([33, 31]);
  let msgIdx = 0;
  function g(a, b, c, d) {
    const mx = MSG_ACCESS_ORDER[msgIdx++];
    const my = MSG_ACCESS_ORDER[msgIdx++];
    put([32, 16 + a]);
    put([32, 16 + b]);
    put([253, 174, 1]);
    put([32, mx]);
    put([253, 174, 1]);
    put([33, 16 + a]);
    put([32, 16 + d]);
    put([32, 16 + a]);
    put([253, 81]);
    put([34, 16 + d]);
    put([32, 16 + d]);
    put([253, 13, 2, 3, 0, 1, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13]);
    put([33, 16 + d]);
    put([32, 16 + c]);
    put([32, 16 + d]);
    put([253, 174, 1]);
    put([33, 16 + c]);
    put([32, 16 + b]);
    put([32, 16 + c]);
    put([253, 81]);
    put([34, 16 + b]);
    put([65, 12]);
    put([253, 173, 1]);
    put([32, 16 + b]);
    put([65, 20]);
    put([253, 171, 1]);
    put([253, 80]);
    put([33, 16 + b]);
    put([32, 16 + a]);
    put([32, 16 + b]);
    put([253, 174, 1]);
    put([32, my]);
    put([253, 174, 1]);
    put([33, 16 + a]);
    put([32, 16 + d]);
    put([32, 16 + a]);
    put([253, 81]);
    put([34, 16 + d]);
    put([32, 16 + d]);
    put([253, 13, 1, 2, 3, 0, 5, 6, 7, 4, 9, 10, 11, 8, 13, 14, 15, 12]);
    put([33, 16 + d]);
    put([32, 16 + c]);
    put([32, 16 + d]);
    put([253, 174, 1]);
    put([33, 16 + c]);
    put([32, 16 + b]);
    put([32, 16 + c]);
    put([253, 81]);
    put([34, 16 + b]);
    put([65, 7]);
    put([253, 173, 1]);
    put([32, 16 + b]);
    put([65, 25]);
    put([253, 171, 1]);
    put([253, 80]);
    put([33, 16 + b]);
  }
  for (let round = 0; round < 7; round++) {
    g(0, 4, 8, 12);
    g(1, 5, 9, 13);
    g(2, 6, 10, 14);
    g(3, 7, 11, 15);
    g(0, 5, 10, 15);
    g(1, 6, 11, 12);
    g(2, 7, 8, 13);
    g(3, 4, 9, 14);
  }
  for (let i = 0; i < 8; i++) {
    put([32, 16 + i]);
    put([32, 24 + i]);
    put([253, 81]);
    put([33, 16 + i]);
  }
  put([32, 32]);
  put([65, 1]);
  put([106]);
  put([34, 32]);
  put([65, 16]);
  put([73]);
  put([13, 0]);
  put([11]);
  put([11]);
  for (let i = 0; i < 8; i++) {
    put([65, ...toLebU32Min2(BATCH_OUTPUT + i * 16)]);
    put([32, 16 + i]);
    put([253, 11, 2, 0]);
  }
  put([11]);
  return code;
}
function generateCompressParentBody() {
  const code = [];
  function put(bytes) {
    code.push(...bytes);
  }
  put([1]);
  put([32, 127]);
  const PARENT_BLOCK_OFFSET = SIMD_MEMORY.PARENT_BLOCK;
  const CHUNK_CV_OFFSET = SIMD_MEMORY.CHUNK_CV;
  const IV2 = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ];
  for (let i = 0; i < 16; i++) {
    put([65, ...toLebU32Min2(PARENT_BLOCK_OFFSET + i * 4)]);
    put([40, 2, 0]);
    put([33, i]);
  }
  for (let i = 0; i < 8; i++) {
    put([65, ...toSignedLeb128_i32(IV2[i])]);
    put([33, 16 + i]);
  }
  for (let i = 0; i < 4; i++) {
    put([65, ...toSignedLeb128_i32(IV2[i])]);
    put([33, 24 + i]);
  }
  put([65, 0]);
  put([33, 28]);
  put([65, 0]);
  put([33, 29]);
  put([65, 192, 0]);
  put([33, 30]);
  put([65, 4]);
  put([33, 31]);
  function g(a, b, c, d, mx, my) {
    const sa = 16 + a, sb = 16 + b, sc = 16 + c, sd = 16 + d;
    put([32, sa]);
    put([32, sb]);
    put([106]);
    put([32, mx]);
    put([106]);
    put([33, sa]);
    put([32, sd]);
    put([32, sa]);
    put([115]);
    put([65, 16]);
    put([120]);
    put([33, sd]);
    put([32, sc]);
    put([32, sd]);
    put([106]);
    put([33, sc]);
    put([32, sb]);
    put([32, sc]);
    put([115]);
    put([65, 12]);
    put([120]);
    put([33, sb]);
    put([32, sa]);
    put([32, sb]);
    put([106]);
    put([32, my]);
    put([106]);
    put([33, sa]);
    put([32, sd]);
    put([32, sa]);
    put([115]);
    put([65, 8]);
    put([120]);
    put([33, sd]);
    put([32, sc]);
    put([32, sd]);
    put([106]);
    put([33, sc]);
    put([32, sb]);
    put([32, sc]);
    put([115]);
    put([65, 7]);
    put([120]);
    put([33, sb]);
  }
  let msgIdx = 0;
  for (let round = 0; round < 7; round++) {
    g(0, 4, 8, 12, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(1, 5, 9, 13, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(2, 6, 10, 14, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(3, 7, 11, 15, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(0, 5, 10, 15, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(1, 6, 11, 12, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(2, 7, 8, 13, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
    g(3, 4, 9, 14, MSG_ACCESS_ORDER[msgIdx], MSG_ACCESS_ORDER[msgIdx + 1]);
    msgIdx += 2;
  }
  for (let i = 0; i < 8; i++) {
    put([65, ...toLebU32Min2(CHUNK_CV_OFFSET + i * 4)]);
    put([32, 16 + i]);
    put([32, 24 + i]);
    put([115]);
    put([54, 2, 0]);
  }
  put([11]);
  return code;
}
var wasmInstance = null;
var wasmMemory2 = null;
var wasmCompress4x = null;
var wasmCompressChunks4x = null;
var wasmCompressParent = null;
var wasmMemoryView = null;
var wasmMemoryView32 = null;
function isSimdSupported() {
  try {
    const simdTest = new Uint8Array([
      0,
      97,
      115,
      109,
      // magic: \0asm
      1,
      0,
      0,
      0,
      // version: 1
      // Type section (id=1): () -> v128
      1,
      // section id = 1 (type)
      5,
      // section length = 5
      1,
      // 1 type
      96,
      0,
      1,
      123,
      // func () -> v128
      // Function section (id=3)
      3,
      // section id = 3 (function)
      2,
      // section length = 2
      1,
      // 1 function
      0,
      // type index 0
      // Code section (id=10) with v128.const
      10,
      // section id = 10 (code)
      22,
      // section length = 22
      1,
      // 1 function body
      20,
      // body length = 20
      0,
      // 0 locals
      253,
      12,
      // v128.const opcode
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      11
      // end
    ]);
    return WebAssembly.validate(simdTest);
  } catch {
    return false;
  }
}
function setupArenaViews() {
  if (!wasmMemory2)
    return;
  const buffer = wasmMemory2.buffer;
  arenaCvStack = new Uint32Array(buffer, SIMD_MEMORY.CV_STACK, 64 * 8);
  arenaParentBlock = new Uint32Array(buffer, SIMD_MEMORY.PARENT_BLOCK, 16);
  arenaChunkCv = new Uint32Array(buffer, SIMD_MEMORY.CHUNK_CV, 8);
  arenaTempCvs = new Uint32Array(buffer, SIMD_MEMORY.TEMP_CVS, 32);
  arenaBatchBlockWords = new Uint32Array(buffer, SIMD_MEMORY.BATCH_BLOCK_WORDS, 16 * 16 * 4);
  arenaBatchCv = new Uint32Array(buffer, SIMD_MEMORY.BATCH_CV, 32);
  arenaBatchCounterLow = new Uint32Array(buffer, SIMD_MEMORY.BATCH_COUNTER_LOW, 4);
  arenaBatchFlagsBase = new Uint32Array(buffer, SIMD_MEMORY.BATCH_FLAGS_BASE, 4);
  arenaBatchOutput = new Uint32Array(buffer, SIMD_MEMORY.BATCH_OUTPUT, 32);
}
var cachedWasmBytes = null;
function initSimdSync() {
  if (wasmInstance)
    return true;
  if (!isSimdSupported()) {
    return false;
  }
  try {
    const wasmBytes = cachedWasmBytes || generateWasmBytes2();
    cachedWasmBytes = wasmBytes;
    wasmMemory2 = new WebAssembly.Memory({ initial: 1 });
    const importObject = {
      js: { mem: wasmMemory2 }
    };
    const module = new WebAssembly.Module(wasmBytes.buffer);
    wasmInstance = new WebAssembly.Instance(module, importObject);
    wasmCompress4x = wasmInstance.exports.compress4x;
    wasmCompressChunks4x = wasmInstance.exports.compressChunks4x;
    wasmCompressParent = wasmInstance.exports.compressParent;
    wasmMemoryView = new Uint8Array(wasmMemory2.buffer);
    wasmMemoryView32 = new Uint32Array(wasmMemory2.buffer);
    setupArenaViews();
    return true;
  } catch (e) {
    console.warn("Failed to initialize WASM SIMD:", e);
    return false;
  }
}
var SIMD_MEMORY = {
  // SIMD compress4x working area (used by WASM code) - single block
  BLOCK_WORDS: 0,
  // 4 x 16 words = 512 bytes (transposed layout)
  CHAINING_VALUES: 512,
  // 4 x 8 words = 128 bytes
  OUTPUT: 640,
  // 4 x 8 words = 128 bytes
  COUNTER_LOW: 768,
  // 4 words = 16 bytes
  COUNTER_HIGH: 784,
  // 4 words = 16 bytes
  BLOCK_LEN: 800,
  // 4 words = 16 bytes
  FLAGS: 816,
  // 4 words = 16 bytes
  // End of single-block SIMD working area: 832 bytes
  // SIMD compressChunks4x working area - 16 blocks batched
  // Each block position has 16 v128 values (one per message word) = 256 bytes
  // 16 block positions = 16 × 256 = 4096 bytes
  BATCH_BLOCK_WORDS: 832,
  // 16 positions × 256 bytes = 4096 bytes (transposed), ends at 4928
  BATCH_CV: 4928,
  // 4 × 8 words × 4 bytes = 128 bytes (working CVs), ends at 5056
  BATCH_COUNTER_LOW: 5056,
  // 4 words × 4 bytes = 16 bytes (per-chunk counters), ends at 5072
  BATCH_FLAGS_BASE: 5072,
  // 4 words × 4 bytes = 16 bytes (base flags, no START/END), ends at 5088
  BATCH_OUTPUT: 5088,
  // 4 × 8 words × 4 bytes = 128 bytes (final output), ends at 5216
  // End of batch working area: 5216 bytes
  // WASM Arena: JS working buffers (accessed via TypedArray views)
  CV_STACK: 5216,
  // 64 levels × 8 words × 4 bytes = 2048 bytes, ends at 7264
  PARENT_BLOCK: 7264,
  // 16 words × 4 bytes = 64 bytes, ends at 7328
  CHUNK_CV: 7328,
  // 8 words × 4 bytes = 32 bytes, ends at 7360
  TEMP_CVS: 7360
  // 4 × 8 words × 4 bytes = 128 bytes, ends at 7488
  // Total arena usage: ~7488 bytes (fits comfortably in 64KB page)
};
var arenaCvStack = null;
var arenaParentBlock = null;
var arenaChunkCv = null;
var arenaTempCvs = null;
var arenaBatchBlockWords = null;
var arenaBatchCv = null;
var arenaBatchCounterLow = null;
var arenaBatchFlagsBase = null;
var arenaBatchOutput = null;

// node_modules/@huggingface/blake3-jit/dist/esm/hash.js
var CV_STACK_DEPTH = 64;
var HYPER_CV_STACK = new Uint32Array(CV_STACK_DEPTH * 8);
var CV_POOL_SIZE = 64;
var CV_POOL = new Uint32Array(CV_POOL_SIZE * 8);
var CV_VIEWS = [];
for (let i = 0; i < CV_POOL_SIZE; i++) {
  CV_VIEWS.push(CV_POOL.subarray(i * 8, i * 8 + 8));
}
var simdAvailable = false;
var SIMD_THRESHOLD = 4 * CHUNK_LEN;
function ensureSimdSync() {
  if (simdAvailable)
    return true;
  simdAvailable = initSimdSync();
  return simdAvailable;
}
var simdChunkCvs = new Uint32Array(32);
var reusableTempCv = new Uint32Array(8);
var reusableChunkCv = new Uint32Array(8);
var reusablePureParentBlock = new Uint32Array(16);
var reusablePureParentCv = new Uint32Array(8);
var reusableSimdCvs = new Uint32Array(32);
var reusableSimdParentBlock = new Uint32Array(16);
var reusableSimdParentCv = new Uint32Array(8);
var reusableOffsets = new Uint32Array(4);
var reusableCounters = new Uint32Array(4);
var reusableBlockLens = new Uint32Array(4);
var reusableFlags = new Uint32Array(4);
var reusableOut8 = new Uint32Array(8);
var reusableOut8View = new Uint8Array(reusableOut8.buffer, 0, 32);
var SIMD_CV_BASE = SIMD_MEMORY.CHAINING_VALUES / 4;
var SIMD_OUT_BASE = SIMD_MEMORY.OUTPUT / 4;
var SIMD_COUNTER_LOW_BASE = SIMD_MEMORY.COUNTER_LOW / 4;
var SIMD_COUNTER_HIGH_BASE = SIMD_MEMORY.COUNTER_HIGH / 4;
var SIMD_BLOCK_LEN_BASE = SIMD_MEMORY.BLOCK_LEN / 4;
var BATCH_CV_BASE = SIMD_MEMORY.BATCH_CV / 4;
var BATCH_COUNTER_LOW_BASE = SIMD_MEMORY.BATCH_COUNTER_LOW / 4;
var BATCH_FLAGS_BASE_OFFSET = SIMD_MEMORY.BATCH_FLAGS_BASE / 4;
var BATCH_OUTPUT_BASE = SIMD_MEMORY.BATCH_OUTPUT / 4;
var batchChunkOffsets = new Uint32Array(4);
var SIMD_FLAGS_BASE = SIMD_MEMORY.FLAGS / 4;
function warmupSimd() {
  return ensureSimdSync();
}

// node_modules/@huggingface/blake3-jit/dist/esm/index.js
if (typeof globalThis !== "undefined" && typeof globalThis.document !== "undefined") {
  queueMicrotask(() => {
    warmupSimd();
  });
}

// node_modules/@huggingface/xetchunk-wasm/dist/esm/xet-chunker.js
var TARGET_CHUNK_SIZE = 64 * 1024;
var MINIMUM_CHUNK_DIVISOR = 8;
var MAXIMUM_CHUNK_MULTIPLIER = 2;
var HASH_WINDOW_SIZE = 64;
var BLAKE3_DATA_KEY = new Uint8Array([
  102,
  151,
  245,
  119,
  91,
  149,
  80,
  222,
  49,
  53,
  203,
  172,
  165,
  151,
  24,
  28,
  157,
  228,
  33,
  16,
  155,
  235,
  43,
  88,
  180,
  208,
  176,
  75,
  147,
  173,
  242,
  41
]);
var XetChunker = class {
  minimumChunk;
  maximumChunk;
  chunkBuf;
  curChunkLen;
  gear;
  blake3;
  constructor(targetChunkSize = TARGET_CHUNK_SIZE) {
    if (targetChunkSize <= 0) {
      throw new Error("Target chunk size must be greater than 0");
    }
    if ((targetChunkSize & targetChunkSize - 1) !== 0) {
      throw new Error("Target chunk size must be a power of 2");
    }
    if (targetChunkSize <= HASH_WINDOW_SIZE) {
      throw new Error("Target chunk size must be greater than hash window size");
    }
    if (targetChunkSize >= Number.MAX_SAFE_INTEGER) {
      throw new Error("Target chunk size must be less than Number.MAX_SAFE_INTEGER");
    }
    let mask = BigInt(targetChunkSize - 1);
    let leadingZeros = 0;
    for (let i = 63; i >= 0; i--) {
      if ((mask & 1n << BigInt(i)) !== 0n) {
        break;
      }
      leadingZeros++;
    }
    mask = mask << BigInt(leadingZeros);
    const maximumChunk = targetChunkSize * MAXIMUM_CHUNK_MULTIPLIER;
    this.minimumChunk = targetChunkSize / MINIMUM_CHUNK_DIVISOR;
    this.maximumChunk = maximumChunk;
    this.chunkBuf = new Uint8Array(maximumChunk);
    this.curChunkLen = 0;
    this.gear = new Hasher(mask);
    this.blake3 = Hasher2.newKeyed(BLAKE3_DATA_KEY);
  }
  /**
   * Streaming entry point: accepts an arbitrary slice of data, accumulates
   * it, and emits a chunk when a boundary (or max size) is reached.
   * Data is copied into an internal buffer because it may span calls.
   */
  next(data, isFinal) {
    const nBytes = data.length;
    let createChunk = false;
    let consumeLen = 0;
    if (nBytes !== 0) {
      if (this.curChunkLen + HASH_WINDOW_SIZE < this.minimumChunk) {
        const maxAdvance = Math.min(this.minimumChunk - this.curChunkLen - HASH_WINDOW_SIZE - 1, nBytes - consumeLen);
        consumeLen += maxAdvance;
        this.curChunkLen += maxAdvance;
      }
      const readEnd = Math.min(nBytes, consumeLen + this.maximumChunk - this.curChunkLen);
      let bytesToNextBoundary;
      const position = this.gear.nextMatch(data.subarray(consumeLen, readEnd));
      if (position !== -1) {
        bytesToNextBoundary = position;
        createChunk = true;
      } else {
        bytesToNextBoundary = readEnd - consumeLen;
      }
      if (bytesToNextBoundary + this.curChunkLen >= this.maximumChunk) {
        bytesToNextBoundary = this.maximumChunk - this.curChunkLen;
        createChunk = true;
      }
      this.curChunkLen += bytesToNextBoundary;
      consumeLen += bytesToNextBoundary;
      this.chunkBuf.set(data.subarray(0, consumeLen), this.curChunkLen - consumeLen);
    }
    if (createChunk || isFinal && this.curChunkLen > 0) {
      const chunkData = this.chunkBuf.subarray(0, this.curChunkLen);
      const hash3 = this.blake3.reset().update(chunkData).finalize(32);
      const chunk2 = {
        length: chunkData.length,
        hash: hash3
      };
      this.curChunkLen = 0;
      this.gear.resetHash();
      return {
        chunk: chunk2,
        bytesConsumed: consumeLen
      };
    }
    return {
      chunk: null,
      bytesConsumed: consumeLen
    };
  }
  /**
   * Batch entry point: processes a large contiguous buffer and returns all
   * complete chunks. Hashes directly from `data` — no intermediate copy
   * to chunkBuf — for every chunk whose bytes are fully within `data`.
   */
  nextBlock(data, isFinal) {
    const chunks = [];
    let pos = 0;
    while (pos < data.length && this.curChunkLen > 0) {
      const result = this.next(data.subarray(pos), false);
      if (result.chunk)
        chunks.push(result.chunk);
      pos += result.bytesConsumed;
    }
    const minSkip = this.minimumChunk > HASH_WINDOW_SIZE ? this.minimumChunk - HASH_WINDOW_SIZE - 1 : 0;
    while (pos < data.length) {
      const chunkStart = pos;
      const scanStart = Math.min(pos + minSkip, data.length);
      const scanEnd = Math.min(data.length, pos + this.maximumChunk);
      const position = this.gear.nextMatch(data.subarray(scanStart, scanEnd));
      let chunkEnd;
      let foundBoundary;
      if (position !== -1 && scanStart + position - chunkStart <= this.maximumChunk) {
        chunkEnd = scanStart + position;
        foundBoundary = true;
      } else if (scanEnd - chunkStart >= this.maximumChunk) {
        chunkEnd = chunkStart + this.maximumChunk;
        foundBoundary = true;
      } else {
        foundBoundary = false;
        chunkEnd = scanEnd;
      }
      if (foundBoundary) {
        const hash3 = this.blake3.reset().update(data.subarray(chunkStart, chunkEnd)).finalize(32);
        chunks.push({ length: chunkEnd - chunkStart, hash: hash3 });
        pos = chunkEnd;
        this.gear.resetHash();
      } else if (isFinal) {
        const hash3 = this.blake3.reset().update(data.subarray(chunkStart)).finalize(32);
        chunks.push({ length: data.length - chunkStart, hash: hash3 });
        pos = data.length;
      } else {
        this.chunkBuf.set(data.subarray(chunkStart), 0);
        this.curChunkLen = data.length - chunkStart;
        pos = data.length;
      }
    }
    return chunks;
  }
  finish() {
    if (this.curChunkLen > 0) {
      const chunkData = this.chunkBuf.subarray(0, this.curChunkLen);
      const hash3 = this.blake3.reset().update(chunkData).finalize(32);
      const chunk2 = { length: this.curChunkLen, hash: hash3 };
      this.curChunkLen = 0;
      this.gear.resetHash();
      return chunk2;
    }
    return null;
  }
};
function createChunker(targetChunkSize = TARGET_CHUNK_SIZE) {
  return new XetChunker(targetChunkSize);
}
function nextBlock(chunker, data) {
  return chunker.nextBlock(data, false);
}
function finalize(chunker) {
  return chunker.finish();
}
function hashToHex(hash3) {
  const view = new DataView(hash3.buffer, hash3.byteOffset, hash3.byteLength);
  const u64 = view.getBigUint64(0, true);
  const u64_2 = view.getBigUint64(8, true);
  const u64_3 = view.getBigUint64(16, true);
  const u64_4 = view.getBigUint64(24, true);
  return u64.toString(16).padStart(16, "0") + u64_2.toString(16).padStart(16, "0") + u64_3.toString(16).padStart(16, "0") + u64_4.toString(16).padStart(16, "0");
}
function hexToBytes(hex) {
  const bytes = new Uint8Array(32);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(0, BigInt("0x" + hex.slice(0, 16)), true);
  view.setBigUint64(8, BigInt("0x" + hex.slice(16, 32)), true);
  view.setBigUint64(16, BigInt("0x" + hex.slice(32, 48)), true);
  view.setBigUint64(24, BigInt("0x" + hex.slice(48, 64)), true);
  return bytes;
}

// node_modules/@huggingface/xetchunk-wasm/dist/esm/xorb-hash.js
var MEAN_CHUNK_PER_NODE = 4;
var BLAKE3_NODE_KEY = new Uint8Array([
  1,
  126,
  197,
  199,
  165,
  71,
  41,
  150,
  253,
  148,
  102,
  102,
  180,
  138,
  2,
  230,
  93,
  221,
  83,
  111,
  55,
  199,
  109,
  210,
  248,
  99,
  82,
  230,
  74,
  83,
  113,
  63
]);
var INDEX_OF_LAST_BYTE_OF_LAST_U64_IN_CHUNK_HASH = 3 * 8;
var nodeHasher = Hasher2.newKeyed(BLAKE3_NODE_KEY);
function isNaturalCut(hash3) {
  return hash3[INDEX_OF_LAST_BYTE_OF_LAST_U64_IN_CHUNK_HASH] % MEAN_CHUNK_PER_NODE === 0;
}
function xorbHash(chunks) {
  if (chunks.length === 0) {
    return new Uint8Array(32);
  }
  let currentChunks = chunks;
  while (currentChunks.length > 1) {
    const nodes = [];
    let currentIndex = 0;
    let numOfChildrenSoFar = 0;
    for (let i = 0; i < currentChunks.length; i++) {
      if (i === currentChunks.length - 1 || numOfChildrenSoFar === 2 * MEAN_CHUNK_PER_NODE || numOfChildrenSoFar >= 2 && currentChunks[i].hash[INDEX_OF_LAST_BYTE_OF_LAST_U64_IN_CHUNK_HASH] % MEAN_CHUNK_PER_NODE === 0) {
        nodes.push(mergedHashOfSequence(currentChunks.slice(currentIndex, i + 1)));
        currentIndex = i + 1;
        numOfChildrenSoFar = 0;
      } else {
        numOfChildrenSoFar++;
      }
    }
    currentChunks = nodes;
  }
  return currentChunks[0].hash;
}
function mergedHashOfSequence(chunks) {
  let text = "";
  let totalLength = 0;
  for (const chunk2 of chunks) {
    text += hashToHex(chunk2.hash) + " : " + chunk2.length + "\n";
    totalLength += chunk2.length;
  }
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = text.charCodeAt(i);
  }
  const hash3 = nodeHasher.reset().update(bytes).finalize(32);
  return { hash: hash3, length: totalLength };
}

// node_modules/@huggingface/xetchunk-wasm/dist/esm/hash-utils.js
var ZERO_KEY = new Uint8Array(32);
var VERIFICATION_KEY = new Uint8Array([
  127,
  24,
  87,
  214,
  206,
  86,
  237,
  102,
  18,
  127,
  249,
  19,
  231,
  165,
  195,
  243,
  164,
  205,
  38,
  213,
  181,
  219,
  73,
  230,
  65,
  36,
  152,
  127,
  40,
  251,
  148,
  195
]);
var fileHasher = Hasher2.newKeyed(ZERO_KEY);
var verificationHasher = Hasher2.newKeyed(VERIFICATION_KEY);
function fileHash(chunks) {
  if (chunks.length === 0) {
    return new Uint8Array(32);
  }
  const xorb = xorbHash(chunks);
  return fileHasher.reset().update(xorb).finalize(32);
}
function hmac(hash3, key) {
  return Hasher2.newKeyed(key).update(hash3).finalize(32);
}
function verificationHash(chunkHashes) {
  const combined = new Uint8Array(chunkHashes.length * 32);
  for (let i = 0; i < chunkHashes.length; i++) {
    combined.set(chunkHashes[i], i * 32);
  }
  return verificationHasher.reset().update(combined).finalize(32);
}

// node_modules/@huggingface/xetchunk-wasm/dist/esm/merkle-hash-subtree.js
var MIN_GROUP_SIZE = 2;
var MAX_GROUP_SIZE = 9;
function nextMergeCut(nodes, start, end) {
  const len = end - start;
  if (len <= MIN_GROUP_SIZE) {
    return len;
  }
  const lim = Math.min(MAX_GROUP_SIZE, len);
  for (let i = MIN_GROUP_SIZE; i < lim; i++) {
    if (isNaturalCut(nodes[start + i].hash)) {
      return i + 1;
    }
  }
  return lim;
}
function validGap(gap) {
  return gap > MIN_GROUP_SIZE && gap < MAX_GROUP_SIZE - 1;
}
function findStableStart(nodes) {
  if (nodes.length < MIN_GROUP_SIZE + 1) {
    return void 0;
  }
  let prevPrevCut;
  let prevCut;
  for (let pos = 0; pos < nodes.length; pos++) {
    if (!isNaturalCut(nodes[pos].hash)) {
      continue;
    }
    if (prevCut !== void 0 && validGap(pos - prevCut) && prevPrevCut !== void 0 && validGap(prevCut - prevPrevCut)) {
      return prevCut + 1;
    }
    prevPrevCut = prevCut;
    prevCut = pos;
  }
  return void 0;
}
function findStableEnd(nodes) {
  if (nodes.length < MIN_GROUP_SIZE + 1) {
    return void 0;
  }
  let nextNextCut;
  let nextCut;
  for (let pos = nodes.length - 1; pos >= 0; pos--) {
    if (!isNaturalCut(nodes[pos].hash)) {
      continue;
    }
    if (nextCut !== void 0 && validGap(nextCut - pos) && nextNextCut !== void 0 && validGap(nextNextCut - nextCut)) {
      return nextCut + 1;
    }
    nextNextCut = nextCut;
    nextCut = pos;
  }
  return void 0;
}
function splitAndPromote(nodes, atStart, atEnd, promoted) {
  if (nodes.length <= 1) {
    return [nodes.length, 0];
  }
  let stableStart;
  if (atStart) {
    stableStart = 0;
  } else {
    const idx = findStableStart(nodes);
    if (idx === void 0) {
      return [nodes.length, 0];
    }
    stableStart = idx;
  }
  let stableEnd;
  if (atEnd) {
    stableEnd = nodes.length;
  } else {
    const idx = findStableEnd(nodes.slice(stableStart));
    if (idx === void 0) {
      return [nodes.length, 0];
    }
    stableEnd = stableStart + idx;
  }
  if (stableStart >= stableEnd) {
    return [nodes.length, 0];
  }
  let pos = stableStart;
  while (pos < stableEnd) {
    const cutLen = nextMergeCut(nodes, pos, stableEnd);
    promoted.push(mergedHashOfSequence(nodes.slice(pos, pos + cutLen)));
    pos += cutLen;
  }
  return [stableStart, nodes.length - stableEnd];
}
function flattenHump(hump) {
  const nodes = [];
  for (const left of hump.leftLevels) {
    nodes.push(...left);
  }
  for (let level = hump.rightLevels.length - 1; level >= 0; level--) {
    nodes.push(...hump.rightLevels[level]);
  }
  const levels = hump.leftLevels.map((left, i) => [left.length, hump.rightLevels[i].length]);
  return { nodes, levels };
}
function buildHump(chunks, atStart, atEnd) {
  const leftLevels = [];
  const rightLevels = [];
  let current = chunks;
  let allLeftsEmpty = true;
  let allRightsEmpty = true;
  while (true) {
    const levelAtStart = atStart && allLeftsEmpty;
    const levelAtEnd = atEnd && allRightsEmpty;
    const promoted = [];
    const [prefixLen, suffixLen] = splitAndPromote(current, levelAtStart, levelAtEnd, promoted);
    leftLevels.push(current.slice(0, prefixLen));
    rightLevels.push(current.slice(current.length - suffixLen));
    if (prefixLen > 0) {
      allLeftsEmpty = false;
    }
    if (suffixLen > 0) {
      allRightsEmpty = false;
    }
    if (promoted.length === 0) {
      break;
    }
    if (promoted.length === 1) {
      leftLevels.push(promoted);
      rightLevels.push([]);
      break;
    }
    current = promoted;
  }
  return { leftLevels, rightLevels };
}
var MerkleHashSubtree = class _MerkleHashSubtree {
  nodes;
  /** Per-level `[leftCount, rightCount]` pairs indexing into `nodes`. */
  levels;
  leftOffsets;
  rightOffsets;
  /** True if this range begins at chunk 0 of the full sequence. */
  atStart;
  /** True if this range ends at the last chunk of the full sequence. */
  atEnd;
  constructor(nodes, levels, atStart, atEnd) {
    this.nodes = nodes;
    this.levels = levels;
    this.atStart = atStart;
    this.atEnd = atEnd;
    [this.leftOffsets, this.rightOffsets] = computeOffsets(levels);
  }
  /**
   * Create a subtree from a contiguous run of level-0 chunks.
   *
   * - `atStart`: `chunks[0]` is the first chunk of the entire file.
   * - `atEnd`: the last element of `chunks` is the file's final chunk.
   */
  static fromChunks(atStart, chunks, atEnd) {
    const { nodes, levels } = flattenHump(buildHump(chunks, atStart, atEnd));
    return new _MerkleHashSubtree(nodes, levels, atStart, atEnd);
  }
  get numNodes() {
    return this.nodes.length;
  }
  get numLevels() {
    return this.levels.length;
  }
  get isEmpty() {
    return this.nodes.length === 0;
  }
  leftAt(level) {
    if (level >= this.levels.length) {
      return [];
    }
    const start = this.leftOffsets[level];
    return this.nodes.slice(start, start + this.levels[level][0]);
  }
  rightAt(level) {
    if (level >= this.levels.length) {
      return [];
    }
    const start = this.rightOffsets[level];
    return this.nodes.slice(start, start + this.levels[level][1]);
  }
  /**
   * Merge an adjacent subtree (the right neighbor) into this one, in place.
   * After the call, `this` covers the combined range: it keeps its own
   * `atStart` and takes `other`'s `atEnd`.
   *
   * Throws if `this.atEnd` (nothing can follow the end) or `other.atStart`
   * (the start cannot appear on the right side of a merge).
   */
  mergeInto(other) {
    if (this.atEnd) {
      throw new Error("Cannot merge into a subtree that is already at the end");
    }
    if (other.atStart) {
      throw new Error("Cannot merge a subtree that is at the start on the right side");
    }
    const combinedAtStart = this.atStart;
    const combinedAtEnd = other.atEnd;
    const maxLevels = Math.max(this.numLevels, other.numLevels);
    const leftLevels = [];
    const rightLevels = [];
    let carry = [];
    let allLeftsEmpty = true;
    let allRightsEmpty = true;
    for (let level = 0; level < maxLevels; level++) {
      const full = [
        ...this.leftAt(level),
        ...this.rightAt(level),
        ...carry,
        ...other.leftAt(level),
        ...other.rightAt(level)
      ];
      const levelAtStart = combinedAtStart && allLeftsEmpty;
      const levelAtEnd = combinedAtEnd && allRightsEmpty;
      const promoted = [];
      const [prefixLen, suffixLen] = splitAndPromote(full, levelAtStart, levelAtEnd, promoted);
      leftLevels.push(full.slice(0, prefixLen));
      rightLevels.push(full.slice(full.length - suffixLen));
      if (prefixLen > 0) {
        allLeftsEmpty = false;
      }
      if (suffixLen > 0) {
        allRightsEmpty = false;
      }
      carry = promoted;
    }
    while (carry.length > 0) {
      if (carry.length === 1) {
        leftLevels.push(carry);
        rightLevels.push([]);
        carry = [];
      } else {
        const promoted = [];
        const [prefixLen, suffixLen] = splitAndPromote(carry, combinedAtStart && allLeftsEmpty, combinedAtEnd && allRightsEmpty, promoted);
        leftLevels.push(carry.slice(0, prefixLen));
        rightLevels.push(carry.slice(carry.length - suffixLen));
        if (prefixLen > 0) {
          allLeftsEmpty = false;
        }
        if (suffixLen > 0) {
          allRightsEmpty = false;
        }
        carry = promoted;
      }
    }
    while (leftLevels.length > 1 && leftLevels[leftLevels.length - 1].length === 0 && rightLevels[rightLevels.length - 1].length === 0) {
      leftLevels.pop();
      rightLevels.pop();
    }
    const { nodes, levels } = flattenHump({ leftLevels, rightLevels });
    this.nodes = nodes;
    this.levels = levels;
    [this.leftOffsets, this.rightOffsets] = computeOffsets(levels);
    this.atStart = combinedAtStart;
    this.atEnd = combinedAtEnd;
  }
  /**
   * Merge multiple adjacent ranges left-to-right.
   * Returns an empty fully-closed range when `ranges` is empty.
   */
  static merge(ranges) {
    if (ranges.length === 0) {
      return _MerkleHashSubtree.fromChunks(true, [], true);
    }
    const result = ranges[0].clone();
    for (let i = 1; i < ranges.length; i++) {
      result.mergeInto(ranges[i]);
    }
    return result;
  }
  clone() {
    return new _MerkleHashSubtree([...this.nodes], this.levels.map((l) => [...l]), this.atStart, this.atEnd);
  }
  /**
   * The final aggregated hash — only available when both boundaries are
   * known (`atStart && atEnd`). Equals `xorbHash(allChunks)`; apply
   * `hmac(hash, zeroKey)` to obtain the file hash.
   *
   * Returns `undefined` when either boundary is unknown.
   */
  finalHash() {
    if (!this.atStart || !this.atEnd) {
      return void 0;
    }
    if (this.nodes.length === 0) {
      return new Uint8Array(32);
    }
    const top = this.levels.length - 1;
    const topLeft = this.leftAt(top);
    if (topLeft.length !== 1 || this.rightAt(top).length !== 0) {
      throw new Error("Invariant violation: fully-closed hump should have a single node at the top level");
    }
    return topLeft[0].hash;
  }
  /** Total byte length covered by this subtree. */
  get totalLength() {
    let total = 0;
    for (let level = 0; level < this.levels.length; level++) {
      for (const node of this.leftAt(level)) {
        total += node.length;
      }
      for (const node of this.rightAt(level)) {
        total += node.length;
      }
    }
    return total;
  }
  /** Serde-human-readable-compatible JSON (what the CAS server produces/accepts). */
  toJSON() {
    return {
      nodes: this.nodes.map((node) => ({ hash: hashToHex(node.hash), size: node.length })),
      levels: this.levels.map((l) => [...l]),
      at_start: this.atStart,
      at_end: this.atEnd
    };
  }
  static fromJSON(json) {
    return new _MerkleHashSubtree(json.nodes.map((node) => ({ hash: hexToBytes(node.hash), length: node.size })), json.levels.map((l) => [l[0], l[1]]), json.at_start, json.at_end);
  }
};
function computeOffsets(levels) {
  const leftOffsets = [];
  const rightOffsets = [];
  let cumulativeLeft = 0;
  for (const [leftCount] of levels) {
    leftOffsets.push(cumulativeLeft);
    cumulativeLeft += leftCount;
  }
  const totalLeft = cumulativeLeft;
  let cumulativeRightAfter = 0;
  for (const [, rightCount] of levels) {
    cumulativeRightAfter += rightCount;
  }
  for (const [, rightCount] of levels) {
    cumulativeRightAfter -= rightCount;
    rightOffsets.push(totalLeft + cumulativeRightAfter);
  }
  return [leftOffsets, rightOffsets];
}

// node_modules/@huggingface/hub/dist/chunk-FUNS5M5E.mjs
var HUB_URL = "https://huggingface.co";
async function createApiError(response, opts) {
  const error = new HubApiError(response.url, response.status, response.headers.get("X-Request-Id") ?? opts?.requestId);
  error.message = `Api error with status ${error.statusCode}${opts?.message ? `. ${opts.message}` : ""}`;
  const trailer = [`URL: ${error.url}`, error.requestId ? `Request ID: ${error.requestId}` : void 0].filter(Boolean).join(". ");
  if (response.headers.get("Content-Type")?.startsWith("application/json")) {
    const json = await response.json();
    error.message = json.error || json.message || error.message;
    if (json.error_description) {
      error.message = error.message ? error.message + `: ${json.error_description}` : json.error_description;
    }
    error.data = json;
  } else {
    error.data = { message: await response.text() };
  }
  error.message += `. ${trailer}`;
  throw error;
}
var HubApiError = class extends Error {
  statusCode;
  url;
  requestId;
  data;
  constructor(url, statusCode, requestId, message) {
    super(message);
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.url = url;
  }
};
var InvalidApiResponseFormatError = class extends Error {
};
function checkAccessToken(accessToken) {
  if (!accessToken.startsWith("hf_")) {
    throw new TypeError("Your access token must start with 'hf_'");
  }
}
function checkCredentials(params) {
  if (params.accessToken) {
    checkAccessToken(params.accessToken);
    return params.accessToken;
  }
  if (params.credentials?.accessToken) {
    checkAccessToken(params.credentials.accessToken);
    return params.credentials.accessToken;
  }
}
function toRepoId(repo) {
  if (typeof repo !== "string") {
    return repo;
  }
  if (repo.startsWith("model/") || repo.startsWith("models/")) {
    throw new TypeError(
      "A repo designation for a model should not start with 'models/', directly specify the model namespace / name"
    );
  }
  if (repo.startsWith("space/")) {
    throw new TypeError("Spaces should start with 'spaces/', plural, not 'space/'");
  }
  if (repo.startsWith("dataset/")) {
    throw new TypeError("Datasets should start with 'datasets/', plural, not 'dataset/'");
  }
  if (repo.startsWith("bucket/")) {
    throw new TypeError("Buckets should start with 'buckets/', plural, not 'bucket/'");
  }
  if (repo.startsWith("kernel/")) {
    throw new TypeError("Kernels should start with 'kernels/', plural, not 'kernel/'");
  }
  const slashes = repo.split("/").length - 1;
  if (repo.startsWith("spaces/")) {
    if (slashes !== 2) {
      throw new TypeError("Space Id must include namespace and name of the space");
    }
    return {
      type: "space",
      name: repo.slice("spaces/".length)
    };
  }
  if (repo.startsWith("datasets/")) {
    if (slashes > 2) {
      throw new TypeError("Too many slashes in repo designation: " + repo);
    }
    return {
      type: "dataset",
      name: repo.slice("datasets/".length)
    };
  }
  if (repo.startsWith("buckets/")) {
    if (slashes !== 2) {
      throw new TypeError("Bucket Id must include namespace and name of the bucket");
    }
    return {
      type: "bucket",
      name: repo.slice("buckets/".length)
    };
  }
  if (repo.startsWith("kernels/")) {
    if (slashes !== 2) {
      throw new TypeError("Kernel Id must include namespace and name of the kernel");
    }
    return {
      type: "kernel",
      name: repo.slice("kernels/".length)
    };
  }
  if (slashes > 1) {
    throw new TypeError("Too many slashes in repo designation: " + repo);
  }
  return {
    type: "model",
    name: repo
  };
}
async function* eventToGenerator(cb) {
  const promises = [];
  function addPromise() {
    let resolve3;
    let reject;
    const p = new Promise((res, rej) => {
      resolve3 = res;
      reject = rej;
    });
    promises.push({ p, resolve: resolve3, reject });
  }
  addPromise();
  const callbackRes = Promise.resolve().then(
    () => cb(
      (y) => {
        addPromise();
        promises.at(-2)?.resolve({ done: false, value: y });
      },
      (r) => {
        addPromise();
        promises.at(-2)?.resolve({ done: true, value: r });
      },
      (err) => promises.shift()?.reject(err)
    )
  ).catch((err) => promises.shift()?.reject(err));
  while (1) {
    const p = promises[0];
    if (!p) {
      throw new Error("Logic error in eventGenerator, promises should never be empty");
    }
    const result = await p.p;
    promises.shift();
    if (result.done) {
      await callbackRes;
      return result.value;
    }
    yield result.value;
  }
  throw new Error("Unreachable");
}
function hexFromBytes(arr) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("hex");
  } else {
    const bin = [];
    arr.forEach((byte) => {
      bin.push(byte.toString(16).padStart(2, "0"));
    });
    return bin.join("");
  }
}
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isWebWorker = typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
var isBackend = !isBrowser && !isWebWorker;
var isFrontend = !isBackend;
async function getWebWorkerCode() {
  const sha256Module = await Promise.resolve().then(() => (init_sha256_wrapper_ITDNMKRK(), sha256_wrapper_ITDNMKRK_exports));
  return URL.createObjectURL(new Blob([sha256Module.createSHA256WorkerCode()]));
}
var pendingWorkers = [];
var runningWorkers = /* @__PURE__ */ new Set();
var resolve;
var waitPromise = new Promise((r) => {
  resolve = r;
});
async function getWorker(poolSize) {
  {
    const worker2 = pendingWorkers.pop();
    if (worker2) {
      runningWorkers.add(worker2);
      return worker2;
    }
  }
  if (!poolSize) {
    const worker2 = new Worker(await getWebWorkerCode());
    runningWorkers.add(worker2);
    return worker2;
  }
  if (poolSize <= 0) {
    throw new TypeError("Invalid webworker pool size: " + poolSize);
  }
  while (runningWorkers.size >= poolSize) {
    await waitPromise;
  }
  const worker = new Worker(await getWebWorkerCode());
  runningWorkers.add(worker);
  return worker;
}
async function freeWorker(worker, poolSize) {
  if (!poolSize) {
    return destroyWorker(worker);
  }
  runningWorkers.delete(worker);
  pendingWorkers.push(worker);
  const r = resolve;
  waitPromise = new Promise((r2) => {
    resolve = r2;
  });
  r();
}
function destroyWorker(worker) {
  runningWorkers.delete(worker);
  worker.terminate();
  const r = resolve;
  waitPromise = new Promise((r2) => {
    resolve = r2;
  });
  r();
}
async function* sha256(buffer, opts) {
  yield 0;
  const maxCryptoSize = typeof opts?.useWebWorker === "object" && opts?.useWebWorker.minSize !== void 0 ? opts.useWebWorker.minSize : 1e7;
  if (buffer.size < maxCryptoSize && globalThis.crypto?.subtle) {
    const res = hexFromBytes(
      new Uint8Array(
        await globalThis.crypto.subtle.digest("SHA-256", buffer instanceof Blob ? await buffer.arrayBuffer() : buffer)
      )
    );
    yield 1;
    return res;
  }
  if (isFrontend) {
    if (opts?.useWebWorker) {
      try {
        const poolSize = typeof opts?.useWebWorker === "object" ? opts.useWebWorker.poolSize : void 0;
        const worker = await getWorker(poolSize);
        let messageHandler;
        let errorHandler;
        let abortListener;
        const cleanup = () => {
          worker.removeEventListener("message", messageHandler);
          worker.removeEventListener("error", errorHandler);
          if (abortListener) {
            opts?.abortSignal?.removeEventListener("abort", abortListener);
          }
        };
        return yield* eventToGenerator((yieldCallback, returnCallback, rejectCallback) => {
          messageHandler = (event) => {
            if (event.data.sha256) {
              cleanup();
              freeWorker(worker, poolSize);
              returnCallback(event.data.sha256);
            } else if (event.data.progress) {
              yieldCallback(event.data.progress);
              try {
                opts.abortSignal?.throwIfAborted();
              } catch (err) {
                cleanup();
                destroyWorker(worker);
                rejectCallback(err);
              }
            } else {
              cleanup();
              destroyWorker(worker);
              rejectCallback(event);
            }
          };
          errorHandler = (event) => {
            cleanup();
            destroyWorker(worker);
            rejectCallback(event.error);
          };
          if (opts?.abortSignal) {
            try {
              opts.abortSignal?.throwIfAborted();
            } catch (err) {
              cleanup();
              destroyWorker(worker);
              rejectCallback(opts.abortSignal.reason ?? new DOMException("Aborted", "AbortError"));
              return;
            }
            abortListener = () => {
              cleanup();
              destroyWorker(worker);
              rejectCallback(opts.abortSignal?.reason ?? new DOMException("Aborted", "AbortError"));
            };
            opts.abortSignal.addEventListener("abort", abortListener);
          }
          worker.addEventListener("message", messageHandler);
          worker.addEventListener("error", errorHandler);
          worker.postMessage({ file: buffer });
        });
      } catch (err) {
        console.warn("Failed to use web worker for sha256", err);
      }
    }
    if (!wasmModule) {
      wasmModule = await Promise.resolve().then(() => (init_sha256_wrapper_ITDNMKRK(), sha256_wrapper_ITDNMKRK_exports));
    }
    const sha2562 = await wasmModule.createSHA256();
    sha2562.init();
    const reader = buffer.stream().getReader();
    const total = buffer.size;
    let bytesDone = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      sha2562.update(value);
      bytesDone += value.length;
      yield bytesDone / total;
      opts?.abortSignal?.throwIfAborted();
    }
    return sha2562.digest("hex");
  }
  if (!cryptoModule) {
    cryptoModule = await Promise.resolve().then(() => (init_sha256_node_ZPWO3OWR(), sha256_node_ZPWO3OWR_exports));
  }
  return yield* cryptoModule.sha256Node(buffer, { abortSignal: opts?.abortSignal });
}
var cryptoModule;
var wasmModule;
function combineUint8Arrays(...arrays) {
  const totalLength = arrays.reduce((sum2, array) => sum2 + array.length, 0);
  const combinedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    combinedBytes.set(array, offset);
    offset += array.length;
  }
  return combinedBytes;
}
function hashU32(a) {
  a = a | 0;
  a = a + 2127912214 + (a << 12) | 0;
  a = a ^ -949894596 ^ a >>> 19;
  a = a + 374761393 + (a << 5) | 0;
  a = a + -744332180 ^ a << 9;
  a = a + -42973499 + (a << 3) | 0;
  return a ^ -1252372727 ^ a >>> 16 | 0;
}
function readU64(b, n) {
  let x = 0;
  x |= b[n++] << 0;
  x |= b[n++] << 8;
  x |= b[n++] << 16;
  x |= b[n++] << 24;
  x |= b[n++] << 32;
  x |= b[n++] << 40;
  x |= b[n++] << 48;
  x |= b[n++] << 56;
  return x;
}
function readU32(b, n) {
  let x = 0;
  x |= b[n++] << 0;
  x |= b[n++] << 8;
  x |= b[n++] << 16;
  x |= b[n++] << 24;
  return x;
}
function writeU32(b, n, x) {
  b[n++] = x >> 0 & 255;
  b[n++] = x >> 8 & 255;
  b[n++] = x >> 16 & 255;
  b[n++] = x >> 24 & 255;
}
function imul(a, b) {
  const ah = a >>> 16;
  const al = a & 65535;
  const bh = b >>> 16;
  const bl = b & 65535;
  return al * bl + (ah * bl + al * bh << 16) | 0;
}
var prime1 = 2654435761;
var prime2 = 2246822519;
var prime3 = 3266489917;
var prime4 = 668265263;
var prime5 = 374761393;
function rotl32(x, r) {
  x = x | 0;
  r = r | 0;
  return x >>> (32 - r | 0) | x << r | 0;
}
function rotmul32(h, r, m) {
  h = h | 0;
  r = r | 0;
  m = m | 0;
  return imul(h >>> (32 - r | 0) | h << r, m) | 0;
}
function shiftxor32(h, s) {
  h = h | 0;
  s = s | 0;
  return h >>> s ^ h | 0;
}
function xxhapply(h, src, m0, s, m1) {
  return rotmul32(imul(src, m0) + h, s, m1);
}
function xxh1(h, src, index) {
  return rotmul32(h + imul(src[index], prime5), 11, prime1);
}
function xxh4(h, src, index) {
  return xxhapply(h, readU32(src, index), prime3, 17, prime4);
}
function xxh16(h, src, index) {
  return [
    xxhapply(h[0], readU32(src, index + 0), prime2, 13, prime1),
    xxhapply(h[1], readU32(src, index + 4), prime2, 13, prime1),
    xxhapply(h[2], readU32(src, index + 8), prime2, 13, prime1),
    xxhapply(h[3], readU32(src, index + 12), prime2, 13, prime1)
  ];
}
function xxh32(seed, src, index, len) {
  let h;
  const l = len;
  if (len >= 16) {
    h = [seed + prime1 + prime2, seed + prime2, seed, seed - prime1];
    while (len >= 16) {
      h = xxh16(h, src, index);
      index += 16;
      len -= 16;
    }
    h = rotl32(h[0], 1) + rotl32(h[1], 7) + rotl32(h[2], 12) + rotl32(h[3], 18) + l;
  } else {
    h = seed + prime5 + len >>> 0;
  }
  while (len >= 4) {
    h = xxh4(h, src, index);
    index += 4;
    len -= 4;
  }
  while (len > 0) {
    h = xxh1(h, src, index);
    index++;
    len--;
  }
  h = shiftxor32(imul(shiftxor32(imul(shiftxor32(h, 15), prime2), 13), prime3), 16);
  return h >>> 0;
}
var hash2 = xxh32;
var minMatch = 4;
var matchSearchLimit = 12;
var minTrailingLitterals = 5;
var skipTrigger = 6;
var hashSize = 1 << 16;
var mlBits = 4;
var mlMask = (1 << mlBits) - 1;
var runBits = 4;
var runMask = (1 << runBits) - 1;
var blockBuf = makeBuffer(5 << 20);
var hashTable = makeHashTable();
var magicNum = 407708164;
var fdContentChksum = 4;
var fdContentSize = 8;
var fdBlockChksum = 16;
var fdVersion = 64;
var fdVersionMask = 192;
var bsUncompressed = 2147483648;
var bsDefault = 7;
var bsShift = 4;
var bsMask = 7;
var bsMap = {
  4: 65536,
  5: 262144,
  6: 1048576,
  7: 4194304
};
function makeHashTable() {
  try {
    return new Uint32Array(hashSize);
  } catch (error) {
    const hashTable2 = new Array(hashSize);
    for (let i = 0; i < hashSize; i++) {
      hashTable2[i] = 0;
    }
    return hashTable2;
  }
}
function clearHashTable(table) {
  for (let i = 0; i < hashSize; i++) {
    table[i] = 0;
  }
}
function makeBuffer(size) {
  return new Uint8Array(size);
}
function sliceArray(array, start, end) {
  return array.slice(start, end);
}
function compressBound(n) {
  return n + n / 255 + 16 | 0;
}
function decompressBound(src) {
  let sIndex = 0;
  if (readU32(src, sIndex) !== magicNum) {
    throw new Error("invalid magic number");
  }
  sIndex += 4;
  const descriptor = src[sIndex++];
  if ((descriptor & fdVersionMask) !== fdVersion) {
    throw new Error("incompatible descriptor version " + (descriptor & fdVersionMask));
  }
  const useBlockSum = (descriptor & fdBlockChksum) !== 0;
  const useContentSize = (descriptor & fdContentSize) !== 0;
  const bsIdx = src[sIndex++] >> bsShift & bsMask;
  if (bsMap[bsIdx] === void 0) {
    throw new Error("invalid block size " + bsIdx);
  }
  const maxBlockSize = bsMap[bsIdx];
  if (useContentSize) {
    return readU64(src, sIndex);
  }
  sIndex++;
  let maxSize = 0;
  while (true) {
    let blockSize = readU32(src, sIndex);
    sIndex += 4;
    if (blockSize & bsUncompressed) {
      blockSize &= ~bsUncompressed;
      maxSize += blockSize;
    } else if (blockSize > 0) {
      maxSize += maxBlockSize;
    }
    if (blockSize === 0) {
      return maxSize;
    }
    if (useBlockSum) {
      sIndex += 4;
    }
    sIndex += blockSize;
  }
}
function decompressBlock(src, dst, sIndex, sLength, dIndex) {
  let mLength, mOffset, sEnd, n, i;
  const hasCopyWithin = dst.copyWithin !== void 0 && dst.fill !== void 0;
  sEnd = sIndex + sLength;
  while (sIndex < sEnd) {
    const token = src[sIndex++];
    let literalCount = token >> 4;
    if (literalCount > 0) {
      if (literalCount === 15) {
        while (true) {
          literalCount += src[sIndex];
          if (src[sIndex++] !== 255) {
            break;
          }
        }
      }
      for (n = sIndex + literalCount; sIndex < n; ) {
        dst[dIndex++] = src[sIndex++];
      }
    }
    if (sIndex >= sEnd) {
      break;
    }
    mLength = token & 15;
    mOffset = src[sIndex++] | src[sIndex++] << 8;
    if (mLength === 15) {
      while (true) {
        mLength += src[sIndex];
        if (src[sIndex++] !== 255) {
          break;
        }
      }
    }
    mLength += minMatch;
    if (hasCopyWithin && mOffset === 1) {
      dst.fill(dst[dIndex - 1] | 0, dIndex, dIndex + mLength);
      dIndex += mLength;
    } else if (hasCopyWithin && mOffset > mLength && mLength > 31) {
      dst.copyWithin(dIndex, dIndex - mOffset, dIndex - mOffset + mLength);
      dIndex += mLength;
    } else {
      for (i = dIndex - mOffset, n = i + mLength; i < n; ) {
        dst[dIndex++] = dst[i++] | 0;
      }
    }
  }
  return dIndex;
}
function compressBlock(src, dst, sIndex, sLength, hashTable2) {
  let mIndex, mAnchor, mLength, mOffset, mStep;
  let literalCount, dIndex, sEnd, n;
  dIndex = 0;
  sEnd = sLength + sIndex;
  mAnchor = sIndex;
  let searchMatchCount = (1 << skipTrigger) + 3;
  while (sIndex <= sEnd - matchSearchLimit) {
    const seq = readU32(src, sIndex);
    let hash22 = hashU32(seq) >>> 0;
    hash22 = (hash22 >> 16 ^ hash22) >>> 0 & 65535;
    mIndex = hashTable2[hash22] - 1;
    hashTable2[hash22] = sIndex + 1;
    if (mIndex < 0 || sIndex - mIndex >>> 16 > 0 || readU32(src, mIndex) !== seq) {
      mStep = searchMatchCount++ >> skipTrigger;
      sIndex += mStep;
      continue;
    }
    searchMatchCount = (1 << skipTrigger) + 3;
    literalCount = sIndex - mAnchor;
    mOffset = sIndex - mIndex;
    sIndex += minMatch;
    mIndex += minMatch;
    mLength = sIndex;
    while (sIndex < sEnd - minTrailingLitterals && src[sIndex] === src[mIndex]) {
      sIndex++;
      mIndex++;
    }
    mLength = sIndex - mLength;
    const token = mLength < mlMask ? mLength : mlMask;
    if (literalCount >= runMask) {
      dst[dIndex++] = (runMask << mlBits) + token;
      for (n = literalCount - runMask; n >= 255; n -= 255) {
        dst[dIndex++] = 255;
      }
      dst[dIndex++] = n;
    } else {
      dst[dIndex++] = (literalCount << mlBits) + token;
    }
    for (let i = 0; i < literalCount; i++) {
      dst[dIndex++] = src[mAnchor + i];
    }
    dst[dIndex++] = mOffset;
    dst[dIndex++] = mOffset >> 8;
    if (mLength >= mlMask) {
      for (n = mLength - mlMask; n >= 255; n -= 255) {
        dst[dIndex++] = 255;
      }
      dst[dIndex++] = n;
    }
    mAnchor = sIndex;
  }
  if (mAnchor === 0) {
    return 0;
  }
  literalCount = sEnd - mAnchor;
  if (literalCount >= runMask) {
    dst[dIndex++] = runMask << mlBits;
    for (n = literalCount - runMask; n >= 255; n -= 255) {
      dst[dIndex++] = 255;
    }
    dst[dIndex++] = n;
  } else {
    dst[dIndex++] = literalCount << mlBits;
  }
  sIndex = mAnchor;
  while (sIndex < sEnd) {
    dst[dIndex++] = src[sIndex++];
  }
  return dIndex;
}
function decompressFrame(src, dst) {
  let useBlockSum, useContentSum, useContentSize, descriptor;
  let sIndex = 0;
  let dIndex = 0;
  if (readU32(src, sIndex) !== magicNum) {
    throw new Error("invalid magic number");
  }
  sIndex += 4;
  descriptor = src[sIndex++];
  if ((descriptor & fdVersionMask) !== fdVersion) {
    throw new Error("incompatible descriptor version");
  }
  useBlockSum = (descriptor & fdBlockChksum) !== 0;
  useContentSum = (descriptor & fdContentChksum) !== 0;
  useContentSize = (descriptor & fdContentSize) !== 0;
  const bsIdx = src[sIndex++] >> bsShift & bsMask;
  if (bsMap[bsIdx] === void 0) {
    throw new Error("invalid block size");
  }
  if (useContentSize) {
    sIndex += 8;
  }
  sIndex++;
  while (true) {
    var compSize;
    compSize = readU32(src, sIndex);
    sIndex += 4;
    if (compSize === 0) {
      break;
    }
    if (useBlockSum) {
      sIndex += 4;
    }
    if ((compSize & bsUncompressed) !== 0) {
      compSize &= ~bsUncompressed;
      for (let j = 0; j < compSize; j++) {
        dst[dIndex++] = src[sIndex++];
      }
    } else {
      dIndex = decompressBlock(src, dst, sIndex, compSize, dIndex);
      sIndex += compSize;
    }
  }
  if (useContentSum) {
    sIndex += 4;
  }
  return dIndex;
}
function compressFrame(src, dst) {
  let dIndex = 0;
  writeU32(dst, dIndex, magicNum);
  dIndex += 4;
  dst[dIndex++] = fdVersion;
  dst[dIndex++] = bsDefault << bsShift;
  dst[dIndex] = hash2(0, dst, 4, dIndex - 4) >> 8;
  dIndex++;
  const maxBlockSize = bsMap[bsDefault];
  let remaining2 = src.length;
  let sIndex = 0;
  clearHashTable(hashTable);
  while (remaining2 > 0) {
    let compSize = 0;
    const blockSize = remaining2 > maxBlockSize ? maxBlockSize : remaining2;
    compSize = compressBlock(src, blockBuf, sIndex, blockSize, hashTable);
    if (compSize > blockSize || compSize === 0) {
      writeU32(dst, dIndex, 2147483648 | blockSize);
      dIndex += 4;
      for (let z = sIndex + blockSize; sIndex < z; ) {
        dst[dIndex++] = src[sIndex++];
      }
      remaining2 -= blockSize;
    } else {
      writeU32(dst, dIndex, compSize);
      dIndex += 4;
      for (let j = 0; j < compSize; ) {
        dst[dIndex++] = blockBuf[j++];
      }
      sIndex += blockSize;
      remaining2 -= blockSize;
    }
  }
  writeU32(dst, dIndex, 0);
  dIndex += 4;
  return dIndex;
}
function decompress(src, maxSize) {
  let dst, size;
  if (maxSize === void 0) {
    maxSize = decompressBound(src);
  }
  dst = makeBuffer(maxSize);
  size = decompressFrame(src, dst);
  if (size !== maxSize) {
    dst = sliceArray(dst, 0, size);
  }
  return dst;
}
function compress2(src, maxSize) {
  let dst, size;
  if (maxSize === void 0) {
    maxSize = compressBound(src.length);
  }
  dst = makeBuffer(maxSize);
  size = compressFrame(src, dst);
  if (size !== maxSize) {
    dst = sliceArray(dst, 0, size);
  }
  return dst;
}
var RangeList = class {
  ranges = [];
  /**
   * Add a range to the list. If it overlaps with existing ranges,
   * it will split them and increment reference counts accordingly.
   */
  add(start, end) {
    if (end <= start) {
      throw new TypeError("End must be greater than start");
    }
    const overlappingRanges = [];
    for (let i = 0; i < this.ranges.length; i++) {
      const range2 = this.ranges[i];
      if (start < range2.end && end > range2.start) {
        overlappingRanges.push({ index: i, range: range2 });
      }
      if (range2.data !== null) {
        throw new Error("Overlapping range already has data");
      }
    }
    if (overlappingRanges.length === 0) {
      this.ranges.push({ start, end, refCount: 1, data: null });
      this.ranges.sort((a, b) => a.start - b.start);
      return;
    }
    const newRanges = [];
    let currentPos = start;
    for (let i = 0; i < overlappingRanges.length; i++) {
      const { range: range2 } = overlappingRanges[i];
      if (currentPos < range2.start) {
        newRanges.push({
          start: currentPos,
          end: range2.start,
          refCount: 1,
          data: null
        });
      } else if (range2.start < currentPos) {
        newRanges.push({
          start: range2.start,
          end: currentPos,
          refCount: range2.refCount,
          data: null
        });
      }
      newRanges.push({
        start: Math.max(currentPos, range2.start),
        end: Math.min(end, range2.end),
        refCount: range2.refCount + 1,
        data: null
      });
      if (range2.end > end) {
        newRanges.push({
          start: end,
          end: range2.end,
          refCount: range2.refCount,
          data: null
        });
      }
      currentPos = Math.max(currentPos, range2.end);
    }
    if (currentPos < end) {
      newRanges.push({
        start: currentPos,
        end,
        refCount: 1,
        data: null
      });
    }
    const firstIndex = overlappingRanges[0].index;
    const lastIndex = overlappingRanges[overlappingRanges.length - 1].index;
    this.ranges.splice(firstIndex, lastIndex - firstIndex + 1, ...newRanges);
    this.ranges.sort((a, b) => a.start - b.start);
  }
  /**
   * Remove a range from the list. The range must start and end at existing boundaries.
   */
  remove(start, end) {
    if (end <= start) {
      throw new TypeError("End must be greater than start");
    }
    const affectedRanges = [];
    for (let i = 0; i < this.ranges.length; i++) {
      const range2 = this.ranges[i];
      if (start < range2.end && end > range2.start) {
        affectedRanges.push({ index: i, range: range2 });
      }
    }
    if (affectedRanges.length === 0) {
      throw new Error("No ranges found to remove");
    }
    if (start !== affectedRanges[0].range.start || end !== affectedRanges[affectedRanges.length - 1].range.end) {
      throw new Error("Range boundaries must match existing boundaries");
    }
    for (let i = 0; i < affectedRanges.length; i++) {
      const { range: range2 } = affectedRanges[i];
      range2.refCount--;
    }
    this.ranges = this.ranges.filter((range2) => range2.refCount > 0);
  }
  /**
   * Get all ranges within the specified boundaries.
   */
  getRanges(start, end) {
    if (end <= start) {
      throw new TypeError("End must be greater than start");
    }
    return this.ranges.filter((range2) => start < range2.end && end > range2.start);
  }
  /**
   * Get all ranges in the list
   */
  getAllRanges() {
    return [...this.ranges];
  }
};
function indexOfSubsequence(haystack, needle, from = 0) {
  const needleLength = needle.length;
  if (needleLength === 0) {
    return from <= haystack.length ? from : -1;
  }
  const last = needleLength - 1;
  const maxStart = haystack.length - needleLength;
  const skip = new Uint16Array(256).fill(needleLength);
  for (let i2 = 0; i2 < last; i2++) {
    skip[needle[i2]] = last - i2;
  }
  let i = from;
  while (i <= maxStart) {
    let j = last;
    while (j >= 0 && haystack[i + j] === needle[j]) {
      j--;
    }
    if (j < 0) {
      return i;
    }
    i += skip[haystack[i + last]];
  }
  return -1;
}
var textEncoder = new TextEncoder();
var CRLF = textEncoder.encode("\r\n");
var HEADER_SEPARATOR = textEncoder.encode("\r\n\r\n");
var STAGING_BLOCK_SIZE = 65536;
var StreamingMultipartParser = class {
  #delimiter;
  /**
   * Unprocessed bytes carried between pushes: bounded by the delimiter length in states 0/2
   * (a possible partial delimiter), tiny in state 1. Seeded with a virtual CRLF so a body
   * starting directly with `--boundary` (RFC 2046: the first delimiter's leading CRLF is
   * "considered part of the preamble") still matches the `\r\n--boundary` delimiter.
   */
  #carry = CRLF;
  /** Confirmed bytes (headers + data) of the in-progress part, as ≥STAGING_BLOCK_SIZE chunks. */
  #partChunks = [];
  #partLength = 0;
  /** Staging block coalescing small appends; pushed to #partChunks when full. */
  #staging;
  #stagingLength = 0;
  /** 0 = scanning for first boundary, 1 = consuming CRLF/`--` after a boundary, 2 = inside a part */
  #state = 0;
  #done = false;
  constructor(contentType) {
    const boundary = extractBoundary(contentType);
    if (!boundary) {
      throw new Error(`No boundary found in Content-Type: ${contentType}`);
    }
    this.#delimiter = textEncoder.encode(`\r
--${boundary}`);
  }
  /**
   * Push a chunk of body bytes (call with no argument to flush at end of stream).
   * Returns the raw bytes of any parts that completed as a result.
   *
   * Copying is linear: each byte is combined with the (bounded) carry once, staged once, and
   * copied into the completed part once.
   */
  push(chunk2) {
    if (this.#done) {
      return [];
    }
    let data = chunk2 && chunk2.byteLength ? combineUint8Arrays(this.#carry, chunk2) : this.#carry;
    this.#carry = new Uint8Array(0);
    const parts = [];
    for (; ; ) {
      if (this.#state === 0 || this.#state === 2) {
        const delimIndex = indexOfSubsequence(data, this.#delimiter, 0);
        if (delimIndex === -1) {
          const safeLength = Math.max(0, data.byteLength - (this.#delimiter.byteLength - 1));
          if (this.#state === 2 && safeLength > 0) {
            this.#appendToPart(data.subarray(0, safeLength));
          }
          this.#carry = data.slice(safeLength);
          break;
        }
        if (this.#state === 2) {
          this.#appendToPart(data.subarray(0, delimIndex));
          const partBody = this.#takePart();
          const headerEnd = indexOfSubsequence(partBody, HEADER_SEPARATOR, 0);
          if (headerEnd === -1) {
            throw new Error("Malformed multipart part: missing header/data separator");
          }
          parts.push(partBody.subarray(headerEnd + HEADER_SEPARATOR.byteLength));
        }
        data = data.slice(delimIndex + this.#delimiter.byteLength);
        this.#state = 1;
        continue;
      }
      if (data.byteLength < 2) {
        this.#carry = data;
        break;
      }
      if (data[0] === 45 && data[1] === 45) {
        this.#done = true;
        return parts;
      }
      if (data[0] === CRLF[0] && data[1] === CRLF[1]) {
        data = data.slice(2);
        this.#state = 2;
        continue;
      }
      throw new Error("Malformed multipart body: expected CRLF or closing delimiter after boundary");
    }
    return parts;
  }
  /** Append confirmed part bytes, coalescing small appends into staging blocks. */
  #appendToPart(bytes) {
    this.#partLength += bytes.byteLength;
    if (bytes.byteLength >= STAGING_BLOCK_SIZE) {
      this.#flushStaging();
      this.#partChunks.push(bytes);
      return;
    }
    let offset = 0;
    while (offset < bytes.byteLength) {
      if (!this.#staging) {
        this.#staging = new Uint8Array(STAGING_BLOCK_SIZE);
        this.#stagingLength = 0;
      }
      const toCopy = Math.min(STAGING_BLOCK_SIZE - this.#stagingLength, bytes.byteLength - offset);
      this.#staging.set(bytes.subarray(offset, offset + toCopy), this.#stagingLength);
      this.#stagingLength += toCopy;
      offset += toCopy;
      if (this.#stagingLength === STAGING_BLOCK_SIZE) {
        this.#partChunks.push(this.#staging);
        this.#staging = void 0;
      }
    }
  }
  #flushStaging() {
    if (this.#staging && this.#stagingLength > 0) {
      this.#partChunks.push(this.#staging.subarray(0, this.#stagingLength));
    }
    this.#staging = void 0;
    this.#stagingLength = 0;
  }
  /** Assemble and reset the in-progress part. Loop-based copy: the chunk count is unbounded-safe. */
  #takePart() {
    this.#flushStaging();
    const out = new Uint8Array(this.#partLength);
    let offset = 0;
    for (const chunk2 of this.#partChunks) {
      out.set(chunk2, offset);
      offset += chunk2.byteLength;
    }
    this.#partChunks = [];
    this.#partLength = 0;
    return out;
  }
};
function extractBoundary(contentType) {
  for (const part of contentType.split(";")) {
    const trimmed = part.trim();
    if (trimmed.toLowerCase().startsWith("boundary=")) {
      return trimmed.slice("boundary=".length).replace(/^"|"$/g, "");
    }
  }
  return null;
}
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function concatUint8Arrays(arrays) {
  const result = new Uint8Array(sum(arrays.map((array) => array.byteLength)));
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.byteLength;
  }
  return result;
}
function hasH2Fetch(versions = typeof process !== "undefined" ? process.versions : void 0, frontend = isFrontend) {
  if (frontend || !versions?.undici || versions.bun) {
    return false;
  }
  return Number(versions.undici.split(".")[0]) >= 8;
}
var GLOBAL_DISPATCHER_KEYS = [Symbol.for("undici.globalDispatcher.2"), Symbol.for("undici.globalDispatcher.1")];
function withHttp1(base) {
  return {
    dispatch: (options, handler) => base.dispatch({ ...options, allowH2: false }, handler)
  };
}
var cached;
async function getHttp1Dispatcher() {
  const globals = globalThis;
  const find = () => GLOBAL_DISPATCHER_KEYS.map((key) => globals[key]).find((d) => typeof d?.dispatch === "function");
  let base = find();
  if (base === void 0) {
    await (await fetch("data:,")).arrayBuffer();
    base = find();
  }
  if (base === void 0) {
    return void 0;
  }
  if (cached?.base !== base) {
    cached = { base, http1: withHttp1(base) };
  }
  return cached.http1;
}
var undiciHttp1Fetch = async (input, init) => {
  const dispatcher = await getHttp1Dispatcher();
  return dispatcher ? fetch(input, { ...init, dispatcher }) : fetch(input, init);
};
var http1Fetch = hasH2Fetch() ? undiciHttp1Fetch : (input, init) => fetch(input, init);
var JWT_SAFETY_PERIOD = 6e4;
var JWT_CACHE_SIZE = 1e3;
var PARALLEL_DEFAULT_MAX_CONCURRENCY = isFrontend ? 4 : 8;
var PARALLEL_MIN_IN_FLIGHT_BYTES = 64 * 1024 * 1024;
var PARALLEL_MAX_IN_FLIGHT_BYTES = 256 * 1024 * 1024;
var PARALLEL_CONTROLLER_TICK_MS = 500;
var PARALLEL_PROBE_KEEP_MARGIN = 1.05;
var PARALLEL_PLATEAU_HOLD_TICKS = 10;
var Notifier = class {
  #resolvers = [];
  wait() {
    return new Promise((resolve3) => this.#resolvers.push(resolve3));
  }
  notifyAll() {
    const resolvers = this.#resolvers;
    this.#resolvers = [];
    for (const resolve3 of resolvers) {
      resolve3();
    }
  }
};
function delay(ms) {
  return new Promise((resolve3) => setTimeout(resolve3, ms));
}
var compressionSchemeLabels = {
  [
    0
    /* None */
  ]: "None",
  [
    1
    /* LZ4 */
  ]: "LZ4",
  [
    2
    /* ByteGroupingLZ4 */
  ]: "ByteGroupingLZ4"
};
var XET_CHUNK_HEADER_BYTES = 8;
function parseChunkHeader(view) {
  const chunkHeader = {
    version: view.getUint8(0),
    compressed_length: view.getUint8(1) | view.getUint8(2) << 8 | view.getUint8(3) << 16,
    compression_scheme: view.getUint8(4),
    uncompressed_length: view.getUint8(5) | view.getUint8(6) << 8 | view.getUint8(7) << 16
  };
  if (chunkHeader.version !== 0) {
    throw new Error(`Unsupported chunk version ${chunkHeader.version}`);
  }
  if (chunkHeader.compression_scheme !== 0 && chunkHeader.compression_scheme !== 1 && chunkHeader.compression_scheme !== 2) {
    throw new Error(
      `Unsupported compression scheme ${compressionSchemeLabels[chunkHeader.compression_scheme] ?? chunkHeader.compression_scheme}`
    );
  }
  return chunkHeader;
}
function decompressChunk(chunkHeader, compressed) {
  switch (chunkHeader.compression_scheme) {
    case 1:
      return decompress(compressed, chunkHeader.uncompressed_length);
    case 2:
      return bg4_regroup_bytes(decompress(compressed, chunkHeader.uncompressed_length));
    default:
      return compressed.slice();
  }
}
function decodePartChunks(data, descriptor, rangeList) {
  const ranges = rangeList.getRanges(descriptor.chunks.start, descriptor.chunks.end);
  const staged = /* @__PURE__ */ new Map();
  let chunkIndex = descriptor.chunks.start;
  let offset = 0;
  while (offset < data.byteLength) {
    if (chunkIndex >= descriptor.chunks.end) {
      throw new Error(
        `Multipart part for chunks ${descriptor.chunks.start}-${descriptor.chunks.end} contains more chunks than expected`
      );
    }
    if (data.byteLength - offset < XET_CHUNK_HEADER_BYTES) {
      throw new Error("Truncated chunk header in multipart part");
    }
    const chunkHeader = parseChunkHeader(new DataView(data.buffer, data.byteOffset + offset, XET_CHUNK_HEADER_BYTES));
    const compressedStart = offset + XET_CHUNK_HEADER_BYTES;
    const compressedEnd = compressedStart + chunkHeader.compressed_length;
    if (compressedEnd > data.byteLength) {
      throw new Error("Truncated chunk data in multipart part");
    }
    const uncompressed = decompressChunk(chunkHeader, data.subarray(compressedStart, compressedEnd));
    const range2 = ranges.find((range3) => chunkIndex >= range3.start && chunkIndex < range3.end);
    if (range2) {
      let chunks = staged.get(range2);
      if (!chunks) {
        chunks = [];
        staged.set(range2, chunks);
      }
      chunks.push(uncompressed);
    }
    chunkIndex++;
    offset = compressedEnd;
  }
  if (chunkIndex !== descriptor.chunks.end) {
    throw new Error(
      `Multipart part decoded chunks ${descriptor.chunks.start}-${chunkIndex} but expected ${descriptor.chunks.start}-${descriptor.chunks.end}`
    );
  }
  return staged;
}
function commitChunks(staged) {
  let committed = 0;
  for (const [range2, chunks] of staged) {
    if (range2.data) {
      continue;
    }
    range2.data = chunks;
    committed += sum(chunks.map((chunk2) => chunk2.byteLength));
  }
  return committed;
}
var XetBlob = class extends Blob {
  fetch;
  accessToken;
  refreshUrl;
  reconstructionUrl;
  hash;
  start = 0;
  end = 0;
  internalLogging = false;
  reconstructionInfo;
  listener;
  parallelDownloads;
  constructor(params) {
    super([]);
    this.fetch = params.fetch ?? http1Fetch;
    this.accessToken = checkCredentials(params);
    this.refreshUrl = params.refreshUrl;
    this.end = params.size;
    this.reconstructionUrl = params.reconstructionUrl;
    this.hash = params.hash;
    this.listener = params.listener;
    this.internalLogging = params.internalLogging ?? false;
    this.parallelDownloads = params.parallelDownloads;
    if (params.readToken) {
      const key = cacheKey({ refreshUrl: this.refreshUrl, initialAccessToken: this.accessToken });
      jwts.set(key, {
        accessToken: params.readToken.accessToken,
        expiresAt: new Date(params.readToken.exp * 1e3),
        casUrl: params.readToken.casUrl
      });
    }
  }
  get size() {
    return this.end - this.start;
  }
  #clone() {
    const blob = new XetBlob({
      fetch: this.fetch,
      hash: this.hash,
      refreshUrl: this.refreshUrl,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      reconstructionUrl: this.reconstructionUrl,
      size: this.size
    });
    blob.accessToken = this.accessToken;
    blob.start = this.start;
    blob.end = this.end;
    blob.reconstructionInfo = this.reconstructionInfo;
    blob.listener = this.listener;
    blob.internalLogging = this.internalLogging;
    blob.parallelDownloads = this.parallelDownloads;
    return blob;
  }
  slice(start = 0, end = this.size) {
    if (start < 0 || end < 0) {
      throw new TypeError("Unsupported negative start/end on XetBlob.slice");
    }
    const slice = this.#clone();
    slice.start = this.start + start;
    slice.end = Math.min(this.start + end, this.end);
    if (slice.start !== this.start || slice.end !== this.end) {
      slice.reconstructionInfo = void 0;
    }
    return slice;
  }
  #reconstructionInfoPromise;
  #loadReconstructionInfo() {
    if (this.#reconstructionInfoPromise) {
      return this.#reconstructionInfoPromise;
    }
    this.#reconstructionInfoPromise = (async () => {
      const connParams = await getAccessToken(this.accessToken, this.fetch, this.refreshUrl);
      const url = this.reconstructionUrl ? this.reconstructionUrl.replace("/v1/reconstructions/", "/v2/reconstructions/") : `${connParams.casUrl}/v2/reconstructions/${this.hash}`;
      const resp = await this.fetch(url, {
        headers: {
          Authorization: `Bearer ${connParams.accessToken}`,
          Range: `bytes=${this.start}-${this.end - 1}`
        }
      });
      if (!resp.ok) {
        throw await createApiError(resp);
      }
      this.reconstructionInfo = await resp.json();
      return this.reconstructionInfo;
    })().finally(() => this.#reconstructionInfoPromise = void 0);
    return this.#reconstructionInfoPromise;
  }
  async #fetch() {
    if (this.size === 0) {
      return new ReadableStream({
        start(controller) {
          controller.close();
        }
      });
    }
    if (!this.reconstructionInfo) {
      await this.#loadReconstructionInfo();
    }
    const rangeLists = /* @__PURE__ */ new Map();
    if (!this.reconstructionInfo) {
      throw new Error("Failed to load reconstruction info");
    }
    for (const term of this.reconstructionInfo.terms) {
      let rangeList = rangeLists.get(term.hash);
      if (!rangeList) {
        rangeList = new RangeList();
        rangeLists.set(term.hash, rangeList);
      }
      rangeList.add(term.range.start, term.range.end);
    }
    const listener = this.listener;
    const log2 = this.internalLogging ? (...args2) => console.log(...args2) : () => {
    };
    async function* readData(reconstructionInfo, customFetch, maxBytes, reloadReconstructionInfo) {
      let totalBytesRead = 0;
      let readBytesToSkip = reconstructionInfo.offset_into_first_range;
      for (const term of reconstructionInfo.terms) {
        if (totalBytesRead >= maxBytes) {
          break;
        }
        const rangeList = rangeLists.get(term.hash);
        if (!rangeList) {
          throw new Error(`Failed to find range list for term ${term.hash}`);
        }
        const locate = (info) => {
          for (const entry of info.xorbs[term.hash] ?? []) {
            const descriptor2 = entry.ranges.find(
              (r) => r.chunks.start <= term.range.start && r.chunks.end >= term.range.end
            );
            if (descriptor2) {
              return { entry, descriptor: descriptor2 };
            }
          }
          return void 0;
        };
        const buildMultiRangeHeader = (entry) => `bytes=${entry.ranges.map((r) => `${r.bytes.start}-${r.bytes.end}`).join(",")}`;
        const fetchMultiRangeEntry = async (entry) => {
          let resp2 = await customFetch(entry.url, { headers: { Range: buildMultiRangeHeader(entry) } });
          if (resp2.status === 403) {
            reconstructionInfo = await reloadReconstructionInfo();
            const relocated = locate(reconstructionInfo);
            if (!relocated) {
              throw new Error(
                `Failed to find fetch info for term ${term.hash} and range ${term.range.start}-${term.range.end} after refresh`
              );
            }
            entry = relocated.entry;
            resp2 = await customFetch(entry.url, { headers: { Range: buildMultiRangeHeader(entry) } });
          }
          if (!resp2.ok) {
            throw await createApiError(resp2);
          }
          const contentType = resp2.headers.get("content-type") ?? "";
          if (!contentType.includes("multipart/byteranges")) {
            throw new Error(`Expected multipart/byteranges response for multi-range request, got "${contentType}"`);
          }
          const reader2 = resp2.body?.getReader();
          if (!reader2) {
            throw new Error("Failed to get reader from response body");
          }
          const parser = new StreamingMultipartParser(contentType);
          const stagedParts = [];
          let partIndex = 0;
          const consumeParts = (parts) => {
            for (const part of parts) {
              const descriptor2 = entry.ranges[partIndex];
              if (!descriptor2) {
                throw new Error(`Received more multipart parts than the ${entry.ranges.length} signed ranges`);
              }
              stagedParts.push(decodePartChunks(part, descriptor2, rangeList));
              partIndex++;
            }
          };
          try {
            for (; ; ) {
              const result = await reader2.read();
              listener?.({ event: "read" });
              if (result.done) {
                break;
              }
              if (result.value) {
                consumeParts(parser.push(result.value));
              }
            }
            consumeParts(parser.push());
          } finally {
            await reader2.cancel().catch(() => {
            });
          }
          if (partIndex !== entry.ranges.length) {
            throw new Error(
              `Multi-range fetch produced ${partIndex} parts but expected ${entry.ranges.length} for term ${term.hash}`
            );
          }
          for (const staged of stagedParts) {
            commitChunks(staged);
          }
        };
        let termRanges = rangeList.getRanges(term.range.start, term.range.end);
        if (!termRanges.every((range2) => range2.data)) {
          const located2 = locate(reconstructionInfo);
          if (!located2) {
            throw new Error(
              `Failed to find fetch info for term ${term.hash} and range ${term.range.start}-${term.range.end}`
            );
          }
          if (located2.entry.ranges.length > 1) {
            await fetchMultiRangeEntry(located2.entry);
            termRanges = rangeList.getRanges(term.range.start, term.range.end);
          }
        }
        {
          if (termRanges.every((range2) => range2.data)) {
            log2("all data available for term", term.hash, readBytesToSkip);
            const cachedLength = sum(termRanges.map((range2) => sum(range2.data.map((chunk2) => chunk2.byteLength))));
            if (cachedLength !== term.unpacked_length) {
              throw new Error(
                `Term ${term.hash} range ${term.range.start}-${term.range.end} decoded to ${cachedLength} bytes, expected ${term.unpacked_length}`
              );
            }
            rangeLoop:
              for (const range2 of termRanges) {
                for (let chunk2 of range2.data) {
                  if (readBytesToSkip) {
                    const skipped = Math.min(readBytesToSkip, chunk2.byteLength);
                    chunk2 = chunk2.slice(skipped);
                    readBytesToSkip -= skipped;
                    if (!chunk2.byteLength) {
                      continue;
                    }
                  }
                  if (chunk2.byteLength > maxBytes - totalBytesRead) {
                    chunk2 = chunk2.slice(0, maxBytes - totalBytesRead);
                  }
                  totalBytesRead += chunk2.byteLength;
                  yield range2.refCount > 1 ? chunk2.slice() : chunk2;
                  listener?.({ event: "progress", progress: { read: totalBytesRead, total: maxBytes } });
                  if (totalBytesRead >= maxBytes) {
                    break rangeLoop;
                  }
                }
              }
            rangeList.remove(term.range.start, term.range.end);
            continue;
          }
        }
        let located = locate(reconstructionInfo);
        if (!located) {
          throw new Error(
            `Failed to find fetch info for term ${term.hash} and range ${term.range.start}-${term.range.end}`
          );
        }
        let descriptor = located.descriptor;
        log2("term", term);
        log2("descriptor", descriptor);
        log2("readBytesToSkip", readBytesToSkip);
        let resp = await customFetch(located.entry.url, {
          headers: {
            Range: `bytes=${descriptor.bytes.start}-${descriptor.bytes.end}`
          }
        });
        if (resp.status === 403) {
          reconstructionInfo = await reloadReconstructionInfo();
          located = locate(reconstructionInfo);
          if (!located) {
            throw new Error(
              `Failed to find fetch info for term ${term.hash} and range ${term.range.start}-${term.range.end} after refresh`
            );
          }
          descriptor = located.descriptor;
          resp = await customFetch(located.entry.url, {
            headers: {
              Range: `bytes=${descriptor.bytes.start}-${descriptor.bytes.end}`
            }
          });
        }
        if (!resp.ok) {
          throw await createApiError(resp);
        }
        log2(
          "expected content length",
          resp.headers.get("content-length"),
          "range",
          descriptor.bytes,
          resp.headers.get("content-range")
        );
        const reader = resp.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get reader from response body");
        }
        let done = false;
        let chunkIndex = descriptor.chunks.start;
        const ranges = rangeList.getRanges(descriptor.chunks.start, descriptor.chunks.end);
        let leftoverBytes = void 0;
        let totalFetchBytes = 0;
        fetchData:
          while (!done && totalBytesRead < maxBytes) {
            const result = await reader.read();
            listener?.({ event: "read" });
            done = result.done;
            log2("read", result.value?.byteLength, "bytes", "total read", totalBytesRead, "toSkip", readBytesToSkip);
            if (!result.value) {
              log2("no data in result, cancelled", result);
              continue;
            }
            totalFetchBytes += result.value.byteLength;
            if (leftoverBytes) {
              result.value = combineUint8Arrays(leftoverBytes, result.value);
              leftoverBytes = void 0;
            }
            while (totalBytesRead < maxBytes && result.value?.byteLength) {
              if (result.value.byteLength < 8) {
                leftoverBytes = result.value;
                continue fetchData;
              }
              const header = new DataView(result.value.buffer, result.value.byteOffset, XET_CHUNK_HEADER_BYTES);
              const chunkHeader = parseChunkHeader(header);
              log2("chunk header", chunkHeader, "to skip", readBytesToSkip);
              if (result.value.byteLength < chunkHeader.compressed_length + XET_CHUNK_HEADER_BYTES) {
                leftoverBytes = result.value;
                continue fetchData;
              }
              result.value = result.value.slice(XET_CHUNK_HEADER_BYTES);
              let uncompressed = decompressChunk(chunkHeader, result.value.subarray(0, chunkHeader.compressed_length));
              const range2 = ranges.find((range3) => chunkIndex >= range3.start && chunkIndex < range3.end);
              const shouldYield = chunkIndex >= term.range.start && chunkIndex < term.range.end;
              const minRefCountToStore = shouldYield ? 2 : 1;
              let stored = false;
              if (range2 && range2.refCount >= minRefCountToStore) {
                range2.data ??= [];
                range2.data.push(uncompressed);
                stored = true;
              }
              if (shouldYield) {
                if (readBytesToSkip) {
                  const skipped = Math.min(readBytesToSkip, uncompressed.byteLength);
                  uncompressed = uncompressed.slice(readBytesToSkip);
                  readBytesToSkip -= skipped;
                }
                if (uncompressed.byteLength > maxBytes - totalBytesRead) {
                  uncompressed = uncompressed.slice(0, maxBytes - totalBytesRead);
                }
                if (uncompressed.byteLength) {
                  log2(
                    "yield",
                    uncompressed.byteLength,
                    "bytes",
                    result.value.byteLength,
                    "total read",
                    totalBytesRead,
                    stored
                  );
                  totalBytesRead += uncompressed.byteLength;
                  yield stored ? uncompressed.slice() : uncompressed;
                  listener?.({ event: "progress", progress: { read: totalBytesRead, total: maxBytes } });
                }
              }
              chunkIndex++;
              result.value = result.value.slice(chunkHeader.compressed_length);
            }
          }
        if (done && totalBytesRead < maxBytes && totalFetchBytes < descriptor.bytes.end - descriptor.bytes.start + 1) {
          log2("done", done, "total read", totalBytesRead, maxBytes, totalFetchBytes);
          log2("failed to fetch all data for term", term.hash);
          throw new Error(
            `Failed to fetch all data for term ${term.hash}, fetched ${totalFetchBytes} bytes out of ${descriptor.bytes.end - descriptor.bytes.start + 1}`
          );
        }
        log2("done", done, "total read", totalBytesRead, maxBytes, totalFetchBytes);
        log2("cancel reader");
        await reader.cancel();
      }
    }
    const parallelOptions = this.parallelDownloads === false ? void 0 : this.parallelDownloads === true || this.parallelDownloads === void 0 ? {} : this.parallelDownloads;
    async function* readDataParallel(reconstructionInfo, customFetch, maxBytes, reloadReconstructionInfo, opts) {
      let totalBytesRead = 0;
      let readBytesToSkip = reconstructionInfo.offset_into_first_range;
      const terms = reconstructionInfo.terms;
      const locateEntryFor = (info, term) => {
        for (const entry of info.xorbs[term.hash] ?? []) {
          const descriptor = entry.ranges.find(
            (r) => r.chunks.start <= term.range.start && r.chunks.end >= term.range.end
          );
          if (descriptor) {
            return entry;
          }
        }
        return void 0;
      };
      const plan = [];
      const planIndexByUrl = /* @__PURE__ */ new Map();
      const termEntryIndex = [];
      for (const term of terms) {
        const entry = locateEntryFor(reconstructionInfo, term);
        if (!entry) {
          throw new Error(
            `Failed to find fetch info for term ${term.hash} and range ${term.range.start}-${term.range.end}`
          );
        }
        let idx = planIndexByUrl.get(entry.url);
        if (idx === void 0) {
          idx = plan.length;
          plan.push({ hash: term.hash, ranges: entry.ranges, url: entry.url });
          planIndexByUrl.set(entry.url, idx);
        }
        termEntryIndex.push(idx);
      }
      const maxConcurrency = Math.max(1, opts.maxConcurrency ?? PARALLEL_DEFAULT_MAX_CONCURRENCY);
      const estimateEntryBytes = (item) => sum(item.ranges.map((r) => r.bytes.end - r.bytes.start + 1));
      const largestEntryBytes = plan.length ? Math.max(...plan.map(estimateEntryBytes)) : 0;
      const maxInFlightBytes = opts.maxInFlightBytes ?? Math.min(PARALLEL_MAX_IN_FLIGHT_BYTES, Math.max(PARALLEL_MIN_IN_FLIGHT_BYTES, 3 * largestEntryBytes));
      const state = {
        nextEntry: 0,
        neededEntry: 0,
        target: 1,
        error: void 0,
        finished: false,
        inFlightBytes: 0,
        decodedBytes: 0,
        active: 0,
        claimed: 0,
        maxActive: 0,
        activeHighWater: 0,
        count429: 0,
        targetHistory: []
      };
      const notifier = new Notifier();
      const budgetAcquire = async (n, entryIdx) => {
        while (!state.error && !state.finished && state.inFlightBytes + n > maxInFlightBytes && entryIdx !== state.neededEntry) {
          await notifier.wait();
        }
        state.inFlightBytes += n;
      };
      const budgetRelease = (n) => {
        state.inFlightBytes -= n;
        notifier.notifyAll();
      };
      const refreshPlanUrls = (info) => {
        for (const item of plan) {
          const match = (info.xorbs[item.hash] ?? []).find(
            (e) => e.ranges.length === item.ranges.length && e.ranges.every(
              (r, i) => r.chunks.start === item.ranges[i].chunks.start && r.chunks.end === item.ranges[i].chunks.end
            )
          );
          if (match) {
            item.url = match.url;
            item.ranges = match.ranges;
          }
        }
      };
      const rangeHeaderFor = (item) => `bytes=${item.ranges.map((r) => `${r.bytes.start}-${r.bytes.end}`).join(",")}`;
      const decodeEntry = async (item, entryIdx, tally) => {
        if (state.error || state.finished) {
          return;
        }
        const rangeList = rangeLists.get(item.hash);
        if (!rangeList) {
          throw new Error(`Failed to find range list for entry ${item.hash}`);
        }
        let resp = await customFetch(item.url, { headers: { Range: rangeHeaderFor(item) } });
        let attempts403 = 0;
        let attempts429 = 0;
        while (resp.status === 403 && attempts403 < 1 || resp.status === 429 && attempts429 < 3) {
          await resp.body?.cancel().catch(() => {
          });
          if (resp.status === 403) {
            attempts403++;
            reconstructionInfo = await reloadReconstructionInfo();
            refreshPlanUrls(reconstructionInfo);
          } else {
            attempts429++;
            state.count429++;
            notifier.notifyAll();
            await delay(300 * attempts429);
          }
          resp = await customFetch(item.url, { headers: { Range: rangeHeaderFor(item) } });
        }
        if (!resp.ok) {
          throw await createApiError(resp);
        }
        const reader = resp.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get reader from response body");
        }
        try {
          if (item.ranges.length > 1) {
            const contentType = resp.headers.get("content-type") ?? "";
            if (!contentType.includes("multipart/byteranges")) {
              throw new Error(`Expected multipart/byteranges response for multi-range request, got "${contentType}"`);
            }
            const parser = new StreamingMultipartParser(contentType);
            let partIndex = 0;
            const handleParts = async (parts) => {
              for (const part of parts) {
                const descriptor = item.ranges[partIndex];
                if (!descriptor) {
                  throw new Error(`Received more multipart parts than the ${item.ranges.length} signed ranges`);
                }
                const staged = decodePartChunks(part, descriptor, rangeList);
                tally.committed += commitChunks(staged);
                state.decodedBytes += part.byteLength;
                partIndex++;
                notifier.notifyAll();
              }
            };
            for (; ; ) {
              if (state.error || state.finished) {
                return;
              }
              const result = await reader.read();
              listener?.({ event: "read" });
              if (result.done) {
                break;
              }
              if (result.value) {
                await handleParts(parser.push(result.value));
              }
            }
            await handleParts(parser.push());
            if (!state.finished && partIndex !== item.ranges.length) {
              throw new Error(
                `Multi-range fetch produced ${partIndex} parts but expected ${item.ranges.length} for ${item.hash}`
              );
            }
          } else {
            const descriptor = item.ranges[0];
            const ranges = rangeList.getRanges(descriptor.chunks.start, descriptor.chunks.end);
            const staged = /* @__PURE__ */ new Map();
            let chunkIndex = descriptor.chunks.start;
            let leftover;
            let done = false;
            while (!done) {
              if (state.error || state.finished) {
                return;
              }
              const result = await reader.read();
              listener?.({ event: "read" });
              done = result.done;
              let value = result.value;
              if (!value) {
                continue;
              }
              if (leftover) {
                value = combineUint8Arrays(leftover, value);
                leftover = void 0;
              }
              while (value.byteLength) {
                if (value.byteLength < XET_CHUNK_HEADER_BYTES) {
                  leftover = value;
                  break;
                }
                const chunkHeader = parseChunkHeader(
                  new DataView(value.buffer, value.byteOffset, XET_CHUNK_HEADER_BYTES)
                );
                if (value.byteLength < XET_CHUNK_HEADER_BYTES + chunkHeader.compressed_length) {
                  leftover = value;
                  break;
                }
                const uncompressed = decompressChunk(
                  chunkHeader,
                  value.subarray(XET_CHUNK_HEADER_BYTES, XET_CHUNK_HEADER_BYTES + chunkHeader.compressed_length)
                );
                const range2 = ranges.find((r) => chunkIndex >= r.start && chunkIndex < r.end);
                if (range2) {
                  let chunks = staged.get(range2);
                  if (!chunks) {
                    chunks = [];
                    staged.set(range2, chunks);
                  }
                  chunks.push(uncompressed);
                  if (chunkIndex === range2.end - 1 && !range2.data) {
                    range2.data = chunks;
                    tally.committed += sum(chunks.map((chunk2) => chunk2.byteLength));
                    notifier.notifyAll();
                  }
                }
                state.decodedBytes += uncompressed.byteLength;
                chunkIndex++;
                value = value.slice(XET_CHUNK_HEADER_BYTES + chunkHeader.compressed_length);
              }
            }
            if (!state.finished) {
              for (const range2 of ranges) {
                if (!range2.data) {
                  throw new Error(
                    `Failed to fetch all data for ${item.hash} chunks ${range2.start}-${range2.end} (stream ended early)`
                  );
                }
              }
            }
          }
        } finally {
          await reader.cancel().catch(() => {
          });
        }
      };
      const isTransientNetworkError = (error) => error instanceof TypeError || /terminated|socket|network|ECONNRESET|fetch failed/i.test(String(error));
      const runWorker = async (workerId) => {
        for (; ; ) {
          if (state.error || state.finished) {
            return;
          }
          if (workerId >= state.target) {
            await notifier.wait();
            continue;
          }
          const idx = state.nextEntry;
          if (idx >= plan.length) {
            return;
          }
          state.nextEntry++;
          state.claimed++;
          const est = estimateEntryBytes(plan[idx]);
          try {
            await budgetAcquire(est, idx);
            if (state.error || state.finished) {
              budgetRelease(est);
              return;
            }
            state.active++;
            state.maxActive = Math.max(state.maxActive, state.active);
            state.activeHighWater = Math.max(state.activeHighWater, state.active);
            let lastError;
            const tally = { committed: 0 };
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                await decodeEntry(plan[idx], idx, tally);
                budgetRelease(est - tally.committed);
                lastError = void 0;
                break;
              } catch (error) {
                lastError = error;
                if (attempt === 0 && !state.finished && isTransientNetworkError(error)) {
                  log2("retrying entry after transient error", plan[idx].hash, error);
                  await delay(250);
                  continue;
                }
              }
            }
            if (lastError) {
              budgetRelease(est);
              state.error ??= lastError;
            }
            state.active--;
          } finally {
            state.claimed--;
            notifier.notifyAll();
          }
        }
      };
      const workersDone = Promise.allSettled(Array.from({ length: maxConcurrency }, (_, i) => runWorker(i)));
      const levelRate = /* @__PURE__ */ new Map();
      let lastBytes = 0;
      let last429 = 0;
      let settleTicks = 1;
      let holdTicks = 0;
      const controller = setInterval(() => {
        const rate = state.decodedBytes - lastBytes;
        lastBytes = state.decodedBytes;
        const tickHighWater = state.activeHighWater;
        state.activeHighWater = state.active;
        holdTicks = Math.max(0, holdTicks - 1);
        if (state.count429 > last429) {
          last429 = state.count429;
          state.target = Math.max(1, state.target - 1);
          settleTicks = 1;
          holdTicks = PARALLEL_PLATEAU_HOLD_TICKS;
        } else if (rate === 0 && state.nextEntry < plan.length) {
          state.target = Math.min(maxConcurrency, state.target + 1);
          settleTicks = 1;
        } else if (settleTicks > 0) {
          settleTicks--;
        } else if (state.claimed >= state.target && tickHighWater <= state.target) {
          const ewma = ((levelRate.get(state.target) ?? rate) + rate) / 2;
          levelRate.set(state.target, ewma);
          const below = levelRate.get(state.target - 1);
          if (state.target > 1 && below === void 0) {
            state.target--;
            settleTicks = 1;
          } else if (below !== void 0 && ewma < below * PARALLEL_PROBE_KEEP_MARGIN) {
            levelRate.delete(state.target);
            state.target--;
            settleTicks = 1;
            holdTicks = PARALLEL_PLATEAU_HOLD_TICKS;
          } else if (holdTicks === 0 && state.target < maxConcurrency) {
            state.target++;
            settleTicks = 1;
          }
        }
        state.targetHistory.push(state.target);
        notifier.notifyAll();
      }, opts.controllerTickMs ?? PARALLEL_CONTROLLER_TICK_MS);
      try {
        for (let termIdx = 0; termIdx < terms.length; termIdx++) {
          const term = terms[termIdx];
          if (totalBytesRead >= maxBytes) {
            break;
          }
          state.neededEntry = termEntryIndex[termIdx];
          notifier.notifyAll();
          const rangeList = rangeLists.get(term.hash);
          if (!rangeList) {
            throw new Error(`Failed to find range list for term ${term.hash}`);
          }
          let termRanges = rangeList.getRanges(term.range.start, term.range.end);
          while (!termRanges.every((range2) => range2.data)) {
            if (state.error) {
              throw state.error;
            }
            if (state.claimed === 0 && state.nextEntry >= plan.length) {
              throw new Error(
                `Download workers finished without producing data for term ${term.hash} range ${term.range.start}-${term.range.end}`
              );
            }
            await notifier.wait();
            termRanges = rangeList.getRanges(term.range.start, term.range.end);
          }
          log2("all data available for term", term.hash, readBytesToSkip);
          const cachedLength = sum(termRanges.map((range2) => sum(range2.data.map((chunk2) => chunk2.byteLength))));
          if (cachedLength !== term.unpacked_length) {
            throw new Error(
              `Term ${term.hash} range ${term.range.start}-${term.range.end} decoded to ${cachedLength} bytes, expected ${term.unpacked_length}`
            );
          }
          rangeLoop:
            for (const range2 of termRanges) {
              for (let chunk2 of range2.data) {
                if (readBytesToSkip) {
                  const skipped = Math.min(readBytesToSkip, chunk2.byteLength);
                  chunk2 = chunk2.slice(skipped);
                  readBytesToSkip -= skipped;
                  if (!chunk2.byteLength) {
                    continue;
                  }
                }
                if (chunk2.byteLength > maxBytes - totalBytesRead) {
                  chunk2 = chunk2.slice(0, maxBytes - totalBytesRead);
                }
                totalBytesRead += chunk2.byteLength;
                yield range2.refCount > 1 ? chunk2.slice() : chunk2;
                listener?.({ event: "progress", progress: { read: totalBytesRead, total: maxBytes } });
                if (totalBytesRead >= maxBytes) {
                  break rangeLoop;
                }
              }
            }
          let freed = 0;
          for (const range2 of termRanges) {
            if (range2.refCount === 1 && range2.data) {
              freed += sum(range2.data.map((chunk2) => chunk2.byteLength));
            }
          }
          rangeList.remove(term.range.start, term.range.end);
          budgetRelease(freed);
        }
      } finally {
        state.finished = true;
        clearInterval(controller);
        notifier.notifyAll();
        await workersDone;
        opts.onStat?.({
          entries: plan.length,
          maxActive: state.maxActive,
          finalTarget: state.target,
          count429: state.count429,
          targetHistory: state.targetHistory
        });
      }
    }
    const iterator = parallelOptions && (parallelOptions.maxConcurrency ?? PARALLEL_DEFAULT_MAX_CONCURRENCY) > 1 ? readDataParallel(
      this.reconstructionInfo,
      this.fetch,
      this.end - this.start,
      this.#loadReconstructionInfo.bind(this),
      parallelOptions
    ) : readData(this.reconstructionInfo, this.fetch, this.end - this.start, this.#loadReconstructionInfo.bind(this));
    return new ReadableStream(
      {
        // todo: when Safari supports it, type controller as ReadableByteStreamController
        async pull(controller) {
          const result = await iterator.next();
          if (result.value) {
            controller.enqueue(result.value);
          }
          if (result.done) {
            controller.close();
          }
        },
        async cancel() {
          await iterator.return?.(void 0);
        },
        type: "bytes"
        // todo: when Safari supports it, add autoAllocateChunkSize param
      },
      // todo : use ByteLengthQueuingStrategy when there's good support for it, currently in Node.js it fails due to size being a function
      {
        highWaterMark: 1e3
        // 1_000 chunks for ~1MB of RAM
      }
    );
  }
  async arrayBuffer() {
    const reader = (await this.#fetch()).getReader();
    const chunks = [];
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
    return concatUint8Arrays(chunks).buffer;
  }
  async text() {
    return new TextDecoder().decode(await this.arrayBuffer());
  }
  async response() {
    const result = await this.#fetch();
    return new Response(result);
  }
  stream() {
    const stream = new TransformStream();
    this.#fetch().then((response) => response.pipeThrough(stream)).catch((error) => stream.writable.abort(error.message));
    return stream.readable;
  }
};
var jwtPromises = /* @__PURE__ */ new Map();
var jwts = /* @__PURE__ */ new Map();
function cacheKey(params) {
  return JSON.stringify([params.refreshUrl, params.initialAccessToken]);
}
function bg4_regroup_bytes(bytes) {
  const split = Math.floor(bytes.byteLength / 4);
  const rem = bytes.byteLength % 4;
  const g1_pos = split + (rem >= 1 ? 1 : 0);
  const g2_pos = g1_pos + split + (rem >= 2 ? 1 : 0);
  const g3_pos = g2_pos + split + (rem == 3 ? 1 : 0);
  const ret = new Uint8Array(bytes.byteLength);
  for (let i = 0, j = 0; i < bytes.byteLength; i += 4, j++) {
    ret[i] = bytes[j];
  }
  for (let i = 1, j = g1_pos; i < bytes.byteLength; i += 4, j++) {
    ret[i] = bytes[j];
  }
  for (let i = 2, j = g2_pos; i < bytes.byteLength; i += 4, j++) {
    ret[i] = bytes[j];
  }
  for (let i = 3, j = g3_pos; i < bytes.byteLength; i += 4, j++) {
    ret[i] = bytes[j];
  }
  return ret;
}
function bg4_split_bytes(bytes) {
  const ret = new Uint8Array(bytes.byteLength);
  const split = Math.floor(bytes.byteLength / 4);
  const rem = bytes.byteLength % 4;
  const g1_pos = split + (rem >= 1 ? 1 : 0);
  const g2_pos = g1_pos + split + (rem >= 2 ? 1 : 0);
  const g3_pos = g2_pos + split + (rem == 3 ? 1 : 0);
  for (let i = 0, j = 0; i < bytes.byteLength; i += 4, j++) {
    ret[j] = bytes[i];
  }
  for (let i = 1, j = g1_pos; i < bytes.byteLength; i += 4, j++) {
    ret[j] = bytes[i];
  }
  for (let i = 2, j = g2_pos; i < bytes.byteLength; i += 4, j++) {
    ret[j] = bytes[i];
  }
  for (let i = 3, j = g3_pos; i < bytes.byteLength; i += 4, j++) {
    ret[j] = bytes[i];
  }
  return ret;
}
async function getAccessToken(initialAccessToken, customFetch, refreshUrl) {
  const key = cacheKey({ refreshUrl, initialAccessToken });
  const jwt = jwts.get(key);
  if (jwt && jwt.expiresAt > new Date(Date.now() + JWT_SAFETY_PERIOD)) {
    return { accessToken: jwt.accessToken, casUrl: jwt.casUrl };
  }
  const existingPromise = jwtPromises.get(key);
  if (existingPromise) {
    return existingPromise;
  }
  const promise = (async () => {
    const resp = await customFetch(refreshUrl, {
      headers: {
        ...initialAccessToken ? {
          Authorization: `Bearer ${initialAccessToken}`
        } : {}
      }
    });
    if (!resp.ok) {
      throw new Error(`Failed to get JWT token: ${resp.status} ${await resp.text()}`);
    }
    const json = await resp.json();
    const jwt2 = {
      accessToken: json.accessToken,
      expiresAt: new Date(json.exp * 1e3),
      casUrl: json.casUrl
    };
    for (const [key2, value] of jwts.entries()) {
      if (value.expiresAt < new Date(Date.now() + JWT_SAFETY_PERIOD)) {
        jwts.delete(key2);
      } else {
        break;
      }
    }
    if (jwts.size >= JWT_CACHE_SIZE) {
      const keyToDelete = jwts.keys().next().value;
      if (keyToDelete) {
        jwts.delete(keyToDelete);
      }
    }
    jwts.set(key, jwt2);
    return {
      accessToken: json.accessToken,
      casUrl: json.casUrl
    };
  })().finally(() => {
    jwtPromises.delete(key);
  });
  jwtPromises.set(key, promise);
  return promise;
}
function range(n, b) {
  return b ? Array(b - n).fill(0).map((_, i) => n + i) : Array(n).fill(0).map((_, i) => i);
}
function chunk(arr, chunkSize) {
  if (isNaN(chunkSize) || chunkSize < 1) {
    throw new RangeError("Invalid chunk size: " + chunkSize);
  }
  if (!arr.length) {
    return [];
  }
  if (arr.length <= chunkSize) {
    return [arr];
  }
  return range(Math.ceil(arr.length / chunkSize)).map((i) => {
    return arr.slice(i * chunkSize, (i + 1) * chunkSize);
  });
}
async function promisesQueue(factories, concurrency) {
  const results = [];
  const executing = /* @__PURE__ */ new Set();
  let index = 0;
  for (const factory of factories) {
    const closureIndex = index++;
    const e = factory().then((r) => {
      results[closureIndex] = r;
      executing.delete(e);
    });
    executing.add(e);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}
async function promisesQueueStreaming(factories, concurrency) {
  const executing = [];
  for await (const factory of factories) {
    const e = factory().then(() => {
      executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
}
var WebBlob = class extends Blob {
  static async create(url, opts) {
    const customFetch = opts?.fetch ?? fetch;
    const probe = await customFetch(url, {
      headers: {
        Range: "bytes=0-0",
        ...opts?.accessToken && { Authorization: `Bearer ${opts.accessToken}` }
      }
    });
    if (!probe.ok) {
      throw await createApiError(probe);
    }
    const contentType = probe.headers.get("content-type") || "";
    if (probe.status === 206) {
      const totalSize = Number(probe.headers.get("content-range")?.split("/").pop());
      await probe.body?.cancel();
      if (Number.isFinite(totalSize) && totalSize >= (opts?.cacheBelow ?? 1e6)) {
        return new WebBlob(url, 0, totalSize, contentType, true, customFetch, opts?.accessToken);
      }
      const full = await customFetch(url, {
        ...opts?.accessToken && { headers: { Authorization: `Bearer ${opts.accessToken}` } }
      });
      if (!full.ok) {
        throw await createApiError(full);
      }
      return full.blob();
    }
    return probe.blob();
  }
  url;
  start;
  end;
  contentType;
  full;
  fetch;
  accessToken;
  constructor(url, start, end, contentType, full, customFetch, accessToken) {
    super([]);
    this.url = url;
    this.start = start;
    this.end = end;
    this.contentType = contentType;
    this.full = full;
    this.fetch = customFetch;
    this.accessToken = accessToken;
  }
  get size() {
    return this.end - this.start;
  }
  get type() {
    return this.contentType;
  }
  slice(start = 0, end = this.size) {
    if (start < 0 || end < 0) {
      throw new TypeError("Unsupported negative start/end on WebBlob.slice");
    }
    const slice = new WebBlob(
      this.url,
      this.start + start,
      Math.min(this.start + end, this.end),
      this.contentType,
      start === 0 && end === this.size ? this.full : false,
      this.fetch,
      this.accessToken
    );
    return slice;
  }
  async arrayBuffer() {
    const result = await this.fetchRange();
    return result.arrayBuffer();
  }
  async text() {
    const result = await this.fetchRange();
    return result.text();
  }
  stream() {
    const stream = new TransformStream();
    this.fetchRange().then((response) => response.body?.pipeThrough(stream)).catch((error) => stream.writable.abort(error.message));
    return stream.readable;
  }
  fetchRange() {
    const fetch2 = this.fetch;
    if (this.full) {
      return fetch2(this.url, {
        ...this.accessToken && {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        }
      }).then((resp) => resp.ok ? resp : createApiError(resp));
    }
    return fetch2(this.url, {
      headers: {
        Range: `bytes=${this.start}-${this.end - 1}`,
        ...this.accessToken && { Authorization: `Bearer ${this.accessToken}` }
      }
    }).then((resp) => resp.ok ? resp : createApiError(resp));
  }
};
function base64FromBytes(arr) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}
async function createBlobs(url, destPath, opts) {
  if (url.protocol === "http:" || url.protocol === "https:") {
    const blob = await WebBlob.create(url, { fetch: opts?.fetch, accessToken: opts?.accessToken });
    return [{ path: destPath, blob }];
  }
  if (isFrontend) {
    throw new TypeError(`Unsupported URL protocol "${url.protocol}"`);
  }
  if (url.protocol === "file:") {
    const { FileBlob: FileBlob2 } = await Promise.resolve().then(() => (init_FileBlob_UNXOJWFM(), FileBlob_UNXOJWFM_exports));
    const { subPaths: subPaths2 } = await Promise.resolve().then(() => (init_sub_paths_HFKHI55E(), sub_paths_HFKHI55E_exports));
    const paths = await subPaths2(url, opts?.maxFolderDepth);
    if (paths.length === 1 && paths[0].relativePath === ".") {
      const blob = await FileBlob2.create(url);
      return [{ path: destPath, blob }];
    }
    return Promise.all(
      paths.map(async (path22) => ({
        path: `${destPath}/${path22.relativePath}`.replace(/\/[.]$/, "").replaceAll("//", "/").replace(/^[.]?\//, ""),
        blob: await FileBlob2.create(new URL(path22.path))
      }))
    );
  }
  throw new TypeError(`Unsupported URL protocol "${url.protocol}"`);
}
var CHUNK_CACHE_INITIAL_SIZE = 1e4;
var CHUNK_CACHE_GROW_FACTOR = 1.5;
var CHUNK_CACHE_MAX_SIZE = 1e6;
var ChunkCache = class {
  index = 0;
  // Index >= 0 means local xorb, < 0 means remote xorb
  xorbIndices;
  // Max 8K chunks per xorb, less than 64K uint16_t
  chunkIndices;
  map = /* @__PURE__ */ new Map();
  // hash -> chunkCacheIndex. Less overhead that way, empty object is 60+B and empty array is 40+B
  hmacs = /* @__PURE__ */ new Set();
  // todo : remove old hmacs
  maxSize;
  constructor(maxSize = CHUNK_CACHE_MAX_SIZE) {
    if (maxSize < 1) {
      throw new Error("maxSize must be at least 1");
    }
    this.maxSize = maxSize;
    this.xorbIndices = new Int32Array(Math.min(CHUNK_CACHE_INITIAL_SIZE, maxSize));
    this.chunkIndices = new Uint16Array(Math.min(CHUNK_CACHE_INITIAL_SIZE, maxSize));
  }
  addChunkToCache(hash22, xorbIndex, chunkIndex, hmac3) {
    if (this.map.has(hash22)) {
      return;
    }
    if (this.map.values().next().value === this.index) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(hash22, this.index);
    if (hmac3 !== null) {
      this.hmacs.add(hmac3);
    }
    if (this.index >= this.xorbIndices.length) {
      const oldXorbIndices = this.xorbIndices;
      const oldChunkIndices = this.chunkIndices;
      this.xorbIndices = new Int32Array(Math.min(this.xorbIndices.length * CHUNK_CACHE_GROW_FACTOR, this.maxSize));
      this.chunkIndices = new Uint16Array(Math.min(this.chunkIndices.length * CHUNK_CACHE_GROW_FACTOR, this.maxSize));
      this.xorbIndices.set(oldXorbIndices);
      this.chunkIndices.set(oldChunkIndices);
    }
    this.xorbIndices[this.index] = xorbIndex;
    this.chunkIndices[this.index] = chunkIndex;
    this.index = (this.index + 1) % this.maxSize;
  }
  getChunk(hash22, hmacFunction) {
    let index = this.map.get(hash22);
    if (index === void 0 && hmacFunction !== null) {
      for (const hmac3 of this.hmacs) {
        index = this.map.get(hmacFunction(hash22, hmac3));
        if (index !== void 0) {
          break;
        }
      }
    }
    if (index === void 0) {
      return void 0;
    }
    return {
      xorbIndex: this.xorbIndices[index],
      chunkIndex: this.chunkIndices[index]
    };
  }
  updateChunkIndex(hash22, chunkIndex) {
    const index = this.map.get(hash22);
    if (index === void 0) {
      throw new Error(`Chunk not found in cache: ${hash22}`);
    }
    this.chunkIndices[index] = chunkIndex;
  }
  removeChunkFromCache(hash22) {
    this.map.delete(hash22);
  }
};
var JWT_SAFETY_PERIOD2 = 6e4;
var JWT_CACHE_SIZE2 = 1e3;
var jwtPromises2 = /* @__PURE__ */ new Map();
var jwts2 = /* @__PURE__ */ new Map();
async function xetWriteToken(params) {
  if (params.xetParams.expiresAt && params.xetParams.casUrl && params.xetParams.accessToken && params.xetParams.expiresAt > new Date(Date.now() + JWT_SAFETY_PERIOD2)) {
    return { accessToken: params.xetParams.accessToken, casUrl: params.xetParams.casUrl };
  }
  const key = params.xetParams.refreshWriteTokenUrl;
  const jwt = jwts2.get(key);
  if (jwt && jwt.expiresAt > new Date(Date.now() + JWT_SAFETY_PERIOD2)) {
    return { accessToken: jwt.accessToken, casUrl: jwt.casUrl };
  }
  const existingPromise = jwtPromises2.get(key);
  if (existingPromise) {
    return existingPromise;
  }
  const promise = (async () => {
    const resp = await (params.fetch ?? fetch)(params.xetParams.refreshWriteTokenUrl, {
      headers: {
        ...params.accessToken ? {
          Authorization: `Bearer ${params.accessToken}`
        } : {},
        ...params.xetParams.sessionId ? { "X-Xet-Session-Id": params.xetParams.sessionId } : {}
      }
    });
    if (!resp.ok) {
      throw await createApiError(resp);
    }
    const json = await resp.json();
    const jwt2 = {
      accessToken: json.accessToken,
      expiresAt: new Date(json.exp * 1e3),
      casUrl: json.casUrl
    };
    for (const [key2, value] of jwts2.entries()) {
      if (value.expiresAt < new Date(Date.now() + JWT_SAFETY_PERIOD2)) {
        jwts2.delete(key2);
      } else {
        break;
      }
    }
    if (jwts2.size >= JWT_CACHE_SIZE2) {
      const keyToDelete = jwts2.keys().next().value;
      if (keyToDelete) {
        jwts2.delete(keyToDelete);
      }
    }
    jwts2.set(key, jwt2);
    return {
      accessToken: json.accessToken,
      casUrl: json.casUrl
    };
  })().finally(() => {
    jwtPromises2.delete(key);
  });
  jwtPromises2.set(key, promise);
  return promise;
}
var HASH_LENGTH = 32;
var XORB_HASH_BOOKEND = "ff".repeat(HASH_LENGTH);
function readHashFromArray(array, offset) {
  let hash22 = "";
  for (let i = 0; i < HASH_LENGTH; i += 8) {
    hash22 += `${array[offset + i + 7].toString(16).padStart(2, "0")}${array[offset + i + 6].toString(16).padStart(2, "0")}${array[offset + i + 5].toString(16).padStart(2, "0")}${array[offset + i + 4].toString(16).padStart(2, "0")}${array[offset + i + 3].toString(16).padStart(2, "0")}${array[offset + i + 2].toString(16).padStart(2, "0")}${array[offset + i + 1].toString(16).padStart(2, "0")}${array[offset + i].toString(16).padStart(2, "0")}`;
  }
  return hash22;
}
async function parseShardData(shardBlob) {
  const shard = new Uint8Array(await shardBlob.arrayBuffer());
  const shardView = new DataView(shard.buffer);
  const magicTag = shard.slice(0, SHARD_MAGIC_TAG.length);
  if (!magicTag.every((byte, i) => byte === SHARD_MAGIC_TAG[i])) {
    throw new Error("Invalid shard magic tag");
  }
  const version = shardView.getBigUint64(SHARD_MAGIC_TAG.length, true);
  if (version !== SHARD_HEADER_VERSION) {
    throw new Error(`Invalid shard version: ${version}`);
  }
  const footerSize = Number(shardView.getBigUint64(SHARD_MAGIC_TAG.length + 8, true));
  const footerStart = shard.length - footerSize;
  const footerVersion = shardView.getBigUint64(footerStart, true);
  if (footerVersion !== SHARD_FOOTER_VERSION) {
    throw new Error(`Invalid shard footer version: ${footerVersion}`);
  }
  const xorbInfoStart = Number(shardView.getBigUint64(footerStart + 16, true));
  const fileLookupStart = Number(shardView.getBigUint64(footerStart + 24, true));
  const hmacKey = readHashFromArray(shard, footerStart + 72);
  const xorbs = [];
  let offset = xorbInfoStart;
  while (offset < fileLookupStart) {
    const xorbHash2 = readHashFromArray(shard, offset);
    offset += HASH_LENGTH;
    if (xorbHash2 === XORB_HASH_BOOKEND) {
      break;
    }
    offset += 4;
    const chunkCount = shardView.getUint32(offset, true);
    offset += 4;
    offset += 4;
    offset += 4;
    const chunks = [];
    for (let i = 0; i < chunkCount; i++) {
      const chunkHash = readHashFromArray(shard, offset);
      offset += HASH_LENGTH;
      const startOffset = shardView.getUint32(offset, true);
      offset += 4;
      const length = shardView.getUint32(offset, true);
      offset += 4;
      offset += 8;
      chunks.push({
        hash: chunkHash,
        startOffset,
        unpackedLength: length
      });
    }
    xorbs.push({
      hash: xorbHash2,
      chunks
    });
  }
  return {
    hmacKey,
    xorbs
  };
}
var SplicedBlob = class extends Blob {
  originalBlob;
  spliceOperations;
  constructor(originalBlob, spliceOperations) {
    super();
    this.originalBlob = originalBlob;
    this.spliceOperations = spliceOperations;
  }
  /**
   * Create a SplicedBlob from an original blob and a set of splice operations.
   *
   * Each operation replaces the original content in `[start, end)` with `insert`
   * (a pure insertion when `start === end`). Positions are byte offsets in the
   * original blob, are relative to the **original** content (not shifted by other
   * operations), and operations must not overlap (they can be passed in any order).
   *
   * As a convenience, a single `{ insert, start, end }` object is also accepted
   * instead of a one-element array.
   */
  static create(originalBlob, operations) {
    if (!Array.isArray(operations)) {
      operations = [operations];
    }
    for (const op of operations) {
      if (op.start < 0 || op.end < 0) {
        throw new Error("Invalid start/end positions for SplicedBlob");
      }
      if (op.start > originalBlob.size || op.end > originalBlob.size) {
        throw new Error("Invalid start/end positions for SplicedBlob");
      }
      if (op.start > op.end) {
        throw new Error("Invalid start/end positions for SplicedBlob");
      }
    }
    const sortedOps = [...operations].sort((a, b) => a.start - b.start);
    for (let i = 0; i < sortedOps.length - 1; i++) {
      if (sortedOps[i].end > sortedOps[i + 1].start) {
        throw new Error("Overlapping splice operations are not supported");
      }
    }
    return new SplicedBlob(originalBlob, sortedOps);
  }
  /**
   * Returns the size of the spliced blob.
   * Size = original size - total replaced size + total insert size
   */
  get size() {
    let totalReplacedSize = 0;
    let totalInsertSize = 0;
    for (const op of this.spliceOperations) {
      totalReplacedSize += op.end - op.start;
      totalInsertSize += op.insert.size;
    }
    return this.originalBlob.size - totalReplacedSize + totalInsertSize;
  }
  /**
   * Returns the MIME type of the original blob.
   */
  get type() {
    return this.originalBlob.type;
  }
  /**
   * Returns a new instance of SplicedBlob that is a slice of the current one.
   *
   * The slice is inclusive of the start and exclusive of the end.
   * The slice method does not support negative start/end.
   *
   * @param start beginning of the slice
   * @param end end of the slice
   */
  slice(start = 0, end = this.size) {
    if (start < 0 || end < 0) {
      throw new TypeError("Unsupported negative start/end on SplicedBlob.slice");
    }
    start = Math.min(start, this.size);
    end = Math.min(end, this.size);
    if (start >= end) {
      return new Blob([]);
    }
    const segments = this.segments;
    const segmentBoundaries = [0];
    let cumulativeSize = 0;
    for (const segment of segments) {
      cumulativeSize += segment.size;
      segmentBoundaries.push(cumulativeSize);
    }
    const resultSegments = [];
    for (let i = 0; i < segments.length; i++) {
      const segmentStart = segmentBoundaries[i];
      const segmentEnd = segmentBoundaries[i + 1];
      if (segmentEnd <= start) {
        continue;
      }
      if (segmentStart >= end) {
        break;
      }
      const sliceStart = Math.max(0, start - segmentStart);
      const sliceEnd = Math.min(segments[i].size, end - segmentStart);
      if (sliceStart < sliceEnd) {
        resultSegments.push(segments[i].slice(sliceStart, sliceEnd));
      }
    }
    return new Blob(resultSegments);
  }
  get firstSpliceIndex() {
    return this.spliceOperations[0]?.start ?? Infinity;
  }
  /**
   * Read the spliced blob content and returns it as an ArrayBuffer.
   */
  async arrayBuffer() {
    const segments = this.segments;
    const buffers = await Promise.all(segments.map((segment) => segment.arrayBuffer()));
    const totalSize = sum(buffers.map((buffer) => buffer.byteLength));
    const result = new Uint8Array(totalSize);
    let offset = 0;
    for (const buffer of buffers) {
      result.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }
    return result.buffer;
  }
  /**
   * Read the spliced blob content and returns it as a string.
   */
  async text() {
    const buffer = await this.arrayBuffer();
    return new TextDecoder().decode(buffer);
  }
  /**
   * Returns a stream around the spliced blob content.
   */
  stream() {
    const readable = new ReadableStream({
      start: async (controller) => {
        try {
          const segments = this.segments;
          for (const segment of segments) {
            const reader = segment.stream().getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  break;
                }
                controller.enqueue(value);
              }
            } finally {
              reader.releaseLock();
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
    return readable;
  }
  /**
   * Get all segments that make up the spliced blob.
   * This includes original blob segments between splice operations and insert blobs.
   */
  get segments() {
    const segments = [];
    let currentPosition = 0;
    const sortedOps = [...this.spliceOperations].sort((a, b) => a.start - b.start);
    for (const op of sortedOps) {
      if (currentPosition < op.start) {
        segments.push(this.originalBlob.slice(currentPosition, op.start));
      }
      if (op.insert.size > 0) {
        segments.push(op.insert);
      }
      currentPosition = op.end;
    }
    if (currentPosition < this.originalBlob.size) {
      segments.push(this.originalBlob.slice(currentPosition));
    }
    return segments;
  }
};
var RANGE_EDIT_CACHE_MAX_ENTRIES = 10;
function addToRangeEditCache(cache, xetHash, entry) {
  cache.delete(xetHash);
  cache.set(xetHash, entry);
  while (cache.size > RANGE_EDIT_CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === void 0) {
      break;
    }
    cache.delete(oldest);
  }
}
async function planRangeEdit(spliced, original, params) {
  const originalHash = original.hash;
  const originalSize = original.size;
  if (!originalHash || originalSize === 0 || original.start !== 0) {
    return void 0;
  }
  if (params.rangeEditCache) {
    const cached2 = planRangeEditFromCache(spliced, originalHash, originalSize, params.rangeEditCache);
    if (cached2) {
      return cached2;
    }
  }
  const token = await xetWriteToken(params);
  const reconstructionResp = await (params.fetch ?? fetch)(`${token.casUrl}/v2/reconstructions/${originalHash}`, {
    headers: { Authorization: `Bearer ${token.accessToken}` }
  });
  if (!reconstructionResp.ok) {
    return void 0;
  }
  const reconstruction = await reconstructionResp.json();
  const terms = reconstruction.terms.map((term) => ({
    hash: term.hash,
    unpackedLength: term.unpacked_length,
    range: { start: term.range.start, end: term.range.end }
  }));
  const segByteStarts = [0];
  let acc = 0;
  for (const term of terms) {
    acc += term.unpackedLength;
    segByteStarts.push(acc);
  }
  if (acc !== originalSize) {
    throw new Error(
      `Original file size mismatch: reconstruction reports ${acc} bytes but the blob is ${originalSize} bytes`
    );
  }
  const edits = spliced.spliceOperations;
  const dirtyRanges = snapAndCoalesceDirtyRanges(edits, segByteStarts, originalSize);
  if (dirtyRanges.length === 0) {
    return void 0;
  }
  const rangeHeader = "bytes=" + dirtyRanges.map(([start, end]) => `${start}-${end - 1}`).join(",");
  const resp = await (params.fetch ?? fetch)(`${token.casUrl}/v2/file-chunk-hashes/${originalHash}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "X-Range-Dirty": rangeHeader
    }
  });
  if (!resp.ok) {
    return void 0;
  }
  const chunkHashes = await resp.json();
  if (chunkHashes.windows.length === 0) {
    throw new Error("Server returned no windows for range edit");
  }
  if (chunkHashes.hashRanges.length !== chunkHashes.windows.length + 1) {
    throw new Error(
      `Server returned ${chunkHashes.hashRanges.length} hashRanges, expected ${chunkHashes.windows.length + 1}`
    );
  }
  const windows = assignEditsToWindows(
    chunkHashes.windows.map((w) => ({ start: w.dirtyByteRange[0], end: w.dirtyByteRange[1] })),
    edits,
    originalSize,
    segByteStarts
  );
  return {
    originalHash,
    originalSize,
    newSize: spliced.size,
    terms,
    segByteStarts,
    windows,
    hashRanges: chunkHashes.hashRanges,
    gapVerification: chunkHashes.gapVerification
  };
}
function planRangeEditFromCache(spliced, originalHash, originalSize, cache) {
  const entry = cache.get(originalHash);
  if (!entry || entry.size !== originalSize || entry.terms.length === 0) {
    return void 0;
  }
  const edits = spliced.spliceOperations;
  if (edits.length === 0) {
    return void 0;
  }
  const lastTerm = entry.terms[entry.terms.length - 1];
  const lastTermStart = originalSize - lastTerm.unpackedLength;
  for (const edit of edits) {
    const editStart = edit.start === edit.end && edit.start === originalSize ? originalSize : edit.start;
    if (editStart < lastTermStart) {
      return void 0;
    }
  }
  const segByteStarts = [0];
  let acc = 0;
  for (const term of entry.terms) {
    acc += term.unpackedLength;
    segByteStarts.push(acc);
  }
  const windows = assignEditsToWindows(
    [{ start: lastTermStart, end: originalSize }],
    edits,
    originalSize,
    segByteStarts
  );
  return {
    originalHash,
    originalSize,
    newSize: spliced.size,
    terms: entry.terms,
    segByteStarts,
    windows,
    hashRanges: [entry.openSubtree, null],
    gapVerification: entry.terms.slice(0, -1).map((term) => term.rangeHash)
  };
}
function snapAndCoalesceDirtyRanges(edits, segByteStarts, originalSize) {
  const nSegs = segByteStarts.length - 1;
  const snapStart = (byte) => {
    let idx = 0;
    while (idx + 1 < segByteStarts.length && segByteStarts[idx + 1] <= byte) {
      idx++;
    }
    return segByteStarts[idx];
  };
  const snapEnd = (byte) => {
    let idx = 0;
    while (idx < segByteStarts.length && segByteStarts[idx] < byte) {
      idx++;
    }
    return segByteStarts[Math.min(idx, segByteStarts.length - 1)];
  };
  const snapped = [];
  for (const edit of edits) {
    if (edit.start === edit.end) {
      if (edit.start === originalSize) {
        snapped.push([segByteStarts[nSegs - 1], segByteStarts[nSegs]]);
      } else {
        snapped.push([snapStart(edit.start), snapEnd(edit.start + 1)]);
      }
    } else {
      snapped.push([snapStart(edit.start), snapEnd(edit.end)]);
    }
  }
  snapped.sort((a, b) => a[0] - b[0]);
  const coalesced = [];
  for (const range2 of snapped) {
    const last = coalesced[coalesced.length - 1];
    if (last && range2[0] <= last[1]) {
      last[1] = Math.max(last[1], range2[1]);
      continue;
    }
    coalesced.push([range2[0], range2[1]]);
  }
  return coalesced;
}
function assignEditsToWindows(windows, edits, originalSize, segByteStarts) {
  let editIdx = 0;
  const result = [];
  for (const [windowIdx, window2] of windows.entries()) {
    const assigned = [];
    while (editIdx < edits.length) {
      const edit = edits[editIdx];
      const belongsHere = edit.start === edit.end ? edit.start < window2.end || edit.start === window2.end && window2.end === originalSize : edit.end <= window2.end;
      if (!belongsHere) {
        break;
      }
      if (edit.start < window2.start) {
        throw new Error(
          `Edit at [${edit.start}, ${edit.end}) starts before its window [${window2.start}, ${window2.end})`
        );
      }
      assigned.push(edit);
      editIdx++;
    }
    let removed = 0;
    let added = 0;
    for (const edit of assigned) {
      removed += edit.end - edit.start;
      added += edit.insert.size;
    }
    const effectiveEnd = segByteStarts.find((segStart) => segStart >= window2.end);
    if (effectiveEnd === void 0) {
      throw new Error(`Window end ${window2.end} exceeds the file size ${segByteStarts[segByteStarts.length - 1]}`);
    }
    const nextWindowStart = windows[windowIdx + 1]?.start;
    if (nextWindowStart !== void 0 && effectiveEnd > nextWindowStart) {
      throw new Error(
        `Window [${window2.start}, ${window2.end}) extends to term boundary ${effectiveEnd}, overlapping the next window at ${nextWindowStart}`
      );
    }
    result.push({
      start: window2.start,
      end: window2.end,
      effectiveEnd,
      edits: assigned,
      newSize: effectiveEnd - window2.start + added - removed,
      hashSplitSize: window2.end - window2.start + added - removed
    });
  }
  if (editIdx !== edits.length) {
    throw new Error(`${edits.length - editIdx} edits were not assigned to any window`);
  }
  return result;
}
function windowSegments(window2, original) {
  const segments = [];
  let cursor = window2.start;
  for (const edit of window2.edits) {
    if (cursor < edit.start) {
      segments.push(original.slice(cursor, edit.start));
    }
    if (edit.insert.size > 0) {
      segments.push(edit.insert);
    }
    cursor = edit.end;
  }
  if (cursor < window2.effectiveEnd) {
    segments.push(original.slice(cursor, window2.effectiveEnd));
  }
  return segments;
}
function composeRepresentation(plan, windowRepresentations) {
  const representation = [];
  const nSegs = plan.terms.length;
  let segIdx = 0;
  let gapIdx = 0;
  const reuseTerm = (idx) => {
    const rangeHash = plan.gapVerification[gapIdx];
    if (rangeHash === void 0) {
      throw new Error(`Ran out of gapVerification entries at stable term ${idx}`);
    }
    gapIdx++;
    representation.push({
      xorbId: plan.terms[idx].hash,
      indexStart: plan.terms[idx].range.start,
      indexEnd: plan.terms[idx].range.end,
      length: plan.terms[idx].unpackedLength,
      rangeHash
    });
  };
  for (let i = 0; i < plan.windows.length; i++) {
    const window2 = plan.windows[i];
    while (segIdx < nSegs && plan.segByteStarts[segIdx] < window2.start) {
      if (plan.segByteStarts[segIdx + 1] > window2.start) {
        throw new Error(
          `Window starting at ${window2.start} straddles term ${segIdx} (${plan.segByteStarts[segIdx]}..${plan.segByteStarts[segIdx + 1]})`
        );
      }
      reuseTerm(segIdx);
      segIdx++;
    }
    while (segIdx < nSegs && plan.segByteStarts[segIdx] < window2.effectiveEnd) {
      segIdx++;
    }
    representation.push(...windowRepresentations[i]);
  }
  while (segIdx < nSegs) {
    reuseTerm(segIdx);
    segIdx++;
  }
  if (gapIdx < plan.gapVerification.length) {
    throw new Error(
      `Server returned ${plan.gapVerification.length} gapVerification entries but only ${gapIdx} stable terms were emitted`
    );
  }
  return representation;
}
var ZERO_KEY2 = new Uint8Array(32);
function chunkSplitIndex(chunks, size, context) {
  let cumulative = 0;
  let index = 0;
  while (index < chunks.length && cumulative < size) {
    cumulative += chunks[index].length;
    index++;
  }
  if (cumulative !== size) {
    throw new Error(`${context}: expected a chunk boundary at ${size} bytes, got ${cumulative}`);
  }
  return index;
}
function buildRangeEditCachePayload(plan, windowChunks, representation) {
  if (plan.hashRanges[plan.hashRanges.length - 1] !== null) {
    return void 0;
  }
  const lastRep = representation[representation.length - 1];
  const lastWindow = windowChunks[windowChunks.length - 1];
  if (!lastRep || !lastWindow) {
    return void 0;
  }
  const lastTermChunkCount = lastRep.indexEnd - lastRep.indexStart;
  if (lastTermChunkCount <= 0 || lastTermChunkCount > lastWindow.length) {
    return void 0;
  }
  const lastTermChunks = lastWindow.slice(lastWindow.length - lastTermChunkCount);
  const hashRanges = plan.hashRanges.map((json) => json === null ? null : MerkleHashSubtree.fromJSON(json));
  const firstWindowAtStart = hashRanges[0] === null;
  const sequence = [];
  for (let i = 0; i < plan.windows.length; i++) {
    const gap = hashRanges[i];
    if (gap !== null && gap !== void 0) {
      sequence.push(gap);
    }
    const splitIndex = chunkSplitIndex(windowChunks[i], plan.windows[i].hashSplitSize, "buildRangeEditCachePayload");
    let chunks = windowChunks[i].slice(0, splitIndex);
    if (i === plan.windows.length - 1) {
      chunks = chunks.slice(0, chunks.length - lastTermChunkCount);
    }
    if (chunks.length > 0 || i === 0 && firstWindowAtStart) {
      sequence.push(
        MerkleHashSubtree.fromChunks(
          i === 0 && firstWindowAtStart,
          chunks.map((chunk2) => ({ hash: hexToBytes(chunk2.hash), length: chunk2.length })),
          false
        )
      );
    }
  }
  const openSubtree = sequence.length > 0 ? MerkleHashSubtree.merge(sequence) : null;
  return {
    size: plan.newSize,
    openSubtree: openSubtree && !openSubtree.isEmpty ? openSubtree.toJSON() : null,
    lastTermChunks
  };
}
function buildFreshFileCachePayload(fileChunks, representation) {
  const lastRep = representation[representation.length - 1];
  if (!lastRep) {
    return void 0;
  }
  const lastTermChunkCount = lastRep.indexEnd - lastRep.indexStart;
  if (lastTermChunkCount <= 0 || lastTermChunkCount > fileChunks.length) {
    return void 0;
  }
  const lastTermChunks = fileChunks.slice(fileChunks.length - lastTermChunkCount);
  const rest = fileChunks.slice(0, fileChunks.length - lastTermChunkCount);
  const openSubtree = rest.length > 0 ? MerkleHashSubtree.fromChunks(
    true,
    rest.map((chunk2) => ({ hash: hexToBytes(chunk2.hash), length: chunk2.length })),
    false
  ).toJSON() : null;
  return {
    size: fileChunks.reduce((sum2, chunk2) => sum2 + chunk2.length, 0),
    openSubtree,
    lastTermChunks
  };
}
function computeComposedFileHash(plan, windowChunks) {
  if (plan.newSize === 0) {
    return "0".repeat(64);
  }
  const hashRanges = plan.hashRanges.map((json) => json === null ? null : MerkleHashSubtree.fromJSON(json));
  const trailingGap = hashRanges[hashRanges.length - 1];
  const firstWindowAtStart = hashRanges[0] === null;
  const lastWindowAtEnd = trailingGap === null;
  const lastIdx = plan.windows.length - 1;
  const mergeSequence = [];
  for (let i = 0; i < plan.windows.length; i++) {
    const gap = hashRanges[i];
    if (gap !== null) {
      mergeSequence.push(gap);
    }
    const window2 = plan.windows[i];
    const splitIndex = chunkSplitIndex(
      windowChunks[i],
      window2.hashSplitSize,
      `Window [${window2.start}, ${window2.end}) chunk boundaries did not re-sync at the window end`
    );
    mergeSequence.push(
      MerkleHashSubtree.fromChunks(
        i === 0 && firstWindowAtStart,
        windowChunks[i].slice(0, splitIndex).map((chunk2) => ({ hash: hexToBytes(chunk2.hash), length: chunk2.length })),
        i === lastIdx && lastWindowAtEnd
      )
    );
  }
  if (trailingGap !== null && trailingGap !== void 0) {
    mergeSequence.push(trailingGap);
  }
  const merged = MerkleHashSubtree.merge(mergeSequence);
  const aggregated = merged.finalHash();
  if (aggregated === void 0) {
    throw new Error("Merged subtree is not fully closed; cannot derive the file hash");
  }
  return hashToHex(hmac(aggregated, ZERO_KEY2));
}
var TARGET_CHUNK_SIZE2 = 64 * 1024;
var MAX_CHUNK_SIZE = 2 * TARGET_CHUNK_SIZE2;
var XORB_SIZE = 64 * 1024 * 1024;
var MAX_XORB_CHUNKS = 8 * 1024;
var MIN_CHUNK_SIZE = TARGET_CHUNK_SIZE2 / 8;
var INTERVAL_BETWEEN_REMOTE_DEDUP = 4e6;
var PROCESSING_PROGRESS_RATIO = 0.1;
var UPLOADING_PROGRESS_RATIO = 1 - PROCESSING_PROGRESS_RATIO;
function computeXorbHashHex(chunks) {
  const chunkObjs = chunks.map((c) => ({ hash: hexToBytes(c.hash), length: c.length }));
  return hashToHex(xorbHash(chunkObjs));
}
function computeHmacHex(hash22, key) {
  return hashToHex(hmac(hexToBytes(hash22), hexToBytes(key)));
}
function computeVerificationHashHex(hashes) {
  return hashToHex(verificationHash(hashes.map(hexToBytes)));
}
function computeFileHashHex(chunks) {
  const chunkObjs = chunks.map((c) => ({ hash: hexToBytes(c.hash), length: c.length }));
  return hashToHex(fileHash(chunkObjs));
}
function addDataToChunker(data, chunker) {
  return nextBlock(chunker, data).map((c) => ({ hash: hashToHex(c.hash), length: c.length, dedup: false }));
}
function finalizeChunker(chunker) {
  const last = finalize(chunker);
  if (!last) {
    return [];
  }
  return [{ hash: hashToHex(last.hash), length: last.length, dedup: false }];
}
var CurrentXorbInfo = class {
  id;
  offset;
  chunks;
  fileProcessedBytes;
  fileUploadedBytes;
  fileSize;
  data;
  immutableData;
  constructor() {
    this.id = 0;
    this.offset = 0;
    this.chunks = [];
    this.fileProcessedBytes = {};
    this.fileUploadedBytes = {};
    this.fileSize = {};
    this.data = new Uint8Array(0);
    this.immutableData = null;
  }
  /**
   * Make sure the xorb buffer can hold `needed` bytes.
   *
   * @param remainingBytesHint Upper bound of the raw bytes still to be written for the current file. Used
   * to size the buffer in one go for big files, while small files only get a small buffer.
   */
  ensureCapacity(needed, remainingBytesHint) {
    if (needed <= this.data.length) {
      return;
    }
    const estimatedSize = this.offset + remainingBytesHint + XET_CHUNK_HEADER_BYTES * (Math.ceil(remainingBytesHint / MIN_CHUNK_SIZE) + 1);
    const newCapacity = Math.min(XORB_SIZE, Math.max(needed, estimatedSize, this.data.length * 2));
    const newData = new Uint8Array(newCapacity);
    newData.set(this.data.subarray(0, this.offset));
    this.data = newData;
  }
  event(computeXorbHash) {
    const xorbChunksCleaned = this.chunks.map((chunk2) => ({
      hash: chunk2.hash,
      length: chunk2.length
    }));
    return {
      event: "xorb",
      xorb: this.data.subarray(0, this.offset),
      hash: computeXorbHash(xorbChunksCleaned),
      chunks: xorbChunksCleaned,
      id: this.id,
      files: Object.entries(this.fileProcessedBytes).map(([path22, processedBytes]) => ({
        path: path22,
        progress: processedBytes / this.fileSize[path22],
        lastSentProgress: ((this.fileUploadedBytes[path22] ?? 0) + (processedBytes - (this.fileUploadedBytes[path22] ?? 0)) * PROCESSING_PROGRESS_RATIO) / this.fileSize[path22]
      }))
    };
  }
};
async function* createXorbs(fileSources, params) {
  const alreadyDoneFileSha256s = /* @__PURE__ */ new Set();
  let xorbId = 0;
  const chunkCache = new ChunkCache();
  let xorb = new CurrentXorbInfo();
  const nextXorb = (currentFile) => {
    const event = xorb.event(computeXorbHashHex);
    xorbId++;
    xorb = new CurrentXorbInfo();
    xorb.id = xorbId;
    xorb.fileUploadedBytes = {
      [currentFile.path]: currentFile.uploadedBytes
    };
    xorb.fileSize[currentFile.path] = currentFile.size;
    return event;
  };
  const pendingFileEvents = [];
  const remoteXorbHashes = [""];
  const resolveXorbId = (xorbId2) => typeof xorbId2 === "string" ? xorbId2 : xorbId2 >= 0 ? xorbId2 : remoteXorbHashes[-xorbId2];
  for await (const fileSource of fileSources) {
    params.yieldCallback?.({
      event: "fileProgress",
      path: fileSource.path,
      progress: 0
    });
    if (fileSource.sha256 && alreadyDoneFileSha256s.has(fileSource.sha256)) {
      params.yieldCallback?.({
        event: "fileProgress",
        path: fileSource.path,
        progress: 1
      });
      continue;
    }
    if (fileSource.sha256) {
      alreadyDoneFileSha256s.add(fileSource.sha256);
    }
    {
      xorb.fileSize[fileSource.path] = fileSource.content.size;
      let rangeEditPlan;
      if (fileSource.content instanceof SplicedBlob && fileSource.content.originalBlob instanceof XetBlob && fileSource.content.originalBlob.hash !== void 0 && fileSource.content.originalBlob.size > 0) {
        rangeEditPlan = await planRangeEdit(fileSource.content, fileSource.content.originalBlob, params);
      }
      if (fileSource.content instanceof SplicedBlob && (rangeEditPlan !== void 0 || fileSource.content.firstSpliceIndex < MAX_CHUNK_SIZE)) {
        await loadFirstChunkDedupInfo(fileSource.content, remoteXorbHashes, params, chunkCache);
      }
      let bytesSinceRemoteDedup = Infinity;
      let bytesSinceLastProgressEvent = 0;
      let dedupNextChunk = true;
      const sourceChunks = [];
      let processedBytes = 0;
      const bytesToChunk = rangeEditPlan !== void 0 ? sum(rangeEditPlan.windows.map((window2) => window2.newSize)) : fileSource.content.size;
      let chunkedBytes = 0;
      let dedupedBytes = 0;
      const fileChunks = [];
      const chunkMetadata = [];
      const addChunks = async function* (chunks) {
        for (const chunk2 of chunks) {
          if (dedupNextChunk) {
            chunk2.dedup = true;
            dedupNextChunk = false;
          }
          let chunkIndex = xorb.chunks.length;
          let chunkXorbId = xorbId;
          const chunkToCopy = removeChunkFromSourceData(sourceChunks, chunk2.length);
          let cacheData = chunkCache.getChunk(chunk2.hash, computeHmacHex);
          if (cacheData === void 0 && chunk2.dedup && bytesSinceRemoteDedup >= INTERVAL_BETWEEN_REMOTE_DEDUP) {
            const token = await xetWriteToken(params);
            bytesSinceRemoteDedup = 0;
            const shardResp = await (params.fetch ?? fetch)(token.casUrl + "/v1/chunks/default/" + chunk2.hash, {
              headers: {
                Authorization: `Bearer ${token.accessToken}`
              }
            });
            if (shardResp.ok) {
              const shard = await shardResp.blob();
              const shardData = await parseShardData(shard);
              for (const xorb2 of shardData.xorbs) {
                const remoteXorbId = -remoteXorbHashes.length;
                remoteXorbHashes.push(xorb2.hash);
                let i = 0;
                for (const chunk3 of xorb2.chunks) {
                  chunkCache.addChunkToCache(chunk3.hash, remoteXorbId, i++, shardData.hmacKey);
                }
              }
              cacheData = chunkCache.getChunk(chunk2.hash, computeHmacHex);
              const oldDedupedBytes = dedupedBytes;
              dedupedBytes = backtrackDedup(xorb, computeHmacHex, shardData, chunkCache, chunkMetadata, dedupedBytes);
              if (dedupedBytes > oldDedupedBytes) {
                xorb.fileUploadedBytes[fileSource.path] ??= 0;
                xorb.fileUploadedBytes[fileSource.path] += dedupedBytes - oldDedupedBytes;
              }
            }
          }
          const remainingBytesHint = Math.max(bytesToChunk - chunkedBytes, chunk2.length);
          chunkedBytes += chunk2.length;
          if (cacheData === void 0) {
            if (!writeChunk(xorb, chunkToCopy, chunk2.hash, remainingBytesHint)) {
              yield nextXorb({ path: fileSource.path, uploadedBytes: processedBytes, size: fileSource.content.size });
              chunkIndex = 0;
              chunkXorbId = xorbId;
              for (const event of pendingFileEvents) {
                event.representation = event.representation.map((rep) => ({
                  ...rep,
                  xorbId: resolveXorbId(rep.xorbId)
                }));
                yield event;
              }
              pendingFileEvents.length = 0;
              if (!writeChunk(xorb, chunkToCopy, chunk2.hash, remainingBytesHint)) {
                throw new Error("Failed to write chunk into xorb");
              }
            }
            chunkCache.addChunkToCache(chunk2.hash, xorbId, chunkIndex, null);
          } else {
            chunkXorbId = cacheData.xorbIndex;
            chunkIndex = cacheData.chunkIndex;
            dedupedBytes += chunk2.length;
            xorb.fileUploadedBytes[fileSource.path] ??= 0;
            xorb.fileUploadedBytes[fileSource.path] += chunk2.length;
          }
          bytesSinceRemoteDedup += chunk2.length;
          bytesSinceLastProgressEvent += chunk2.length;
          fileChunks.push({ hash: chunk2.hash, length: chunk2.length });
          chunkMetadata.push({
            xorbId: chunkXorbId,
            chunkIndex,
            length: chunk2.length
          });
          xorb.fileProcessedBytes[fileSource.path] = processedBytes;
          if (bytesSinceLastProgressEvent >= 1e6) {
            bytesSinceLastProgressEvent = 0;
            params.yieldCallback?.({
              event: "fileProgress",
              path: fileSource.path,
              progress: ((xorb.fileUploadedBytes[fileSource.path] ?? 0) + (xorb.fileProcessedBytes[fileSource.path] - (xorb.fileUploadedBytes[fileSource.path] ?? 0)) * PROCESSING_PROGRESS_RATIO) / fileSource.content.size
            });
          }
          if (xorb.chunks.length >= MAX_XORB_CHUNKS) {
            yield nextXorb({ path: fileSource.path, uploadedBytes: processedBytes, size: fileSource.content.size });
            for (const event of pendingFileEvents) {
              event.representation = event.representation.map((rep) => ({
                ...rep,
                xorbId: resolveXorbId(rep.xorbId)
              }));
              yield event;
            }
            pendingFileEvents.length = 0;
          }
        }
      };
      const pumpBlob = async function* (chunker, blob) {
        const reader = blob.stream().getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          processedBytes += value.length;
          sourceChunks.push(value);
          yield* addChunks(addDataToChunker(value, chunker));
        }
      };
      let fileRepresentation;
      let fileHashHex;
      let dedupRatio;
      let rangeEditCachePayload;
      if (rangeEditPlan !== void 0) {
        const originalBlob = fileSource.content.originalBlob;
        const windowBounds = [];
        for (const window2 of rangeEditPlan.windows) {
          const chunker = createChunker(TARGET_CHUNK_SIZE2);
          dedupNextChunk = true;
          const startIndex = fileChunks.length;
          for (const segment of windowSegments(window2, originalBlob)) {
            yield* pumpBlob(chunker, segment);
          }
          yield* addChunks(finalizeChunker(chunker));
          windowBounds.push([startIndex, fileChunks.length]);
        }
        const windowNewBytes = sum(rangeEditPlan.windows.map((window2) => window2.newSize));
        const reusedBytes = fileSource.content.size - windowNewBytes;
        processedBytes += reusedBytes;
        xorb.fileUploadedBytes[fileSource.path] = (xorb.fileUploadedBytes[fileSource.path] ?? 0) + reusedBytes;
        xorb.fileProcessedBytes[fileSource.path] = processedBytes;
        const windowRepresentations = windowBounds.map(
          ([start, end]) => buildFileRepresentation(
            chunkMetadata.slice(start, end),
            fileChunks.slice(start, end),
            computeVerificationHashHex
          )
        );
        fileRepresentation = composeRepresentation(rangeEditPlan, windowRepresentations);
        fileHashHex = computeComposedFileHash(
          rangeEditPlan,
          windowBounds.map(([start, end]) => fileChunks.slice(start, end))
        );
        dedupRatio = fileSource.content.size > 0 ? (reusedBytes + dedupedBytes) / fileSource.content.size : 0;
        if (params.rangeEditCache) {
          rangeEditCachePayload = buildRangeEditCachePayload(
            rangeEditPlan,
            windowBounds.map(([start, end]) => fileChunks.slice(start, end)),
            fileRepresentation
          );
        }
      } else {
        const chunker = createChunker(TARGET_CHUNK_SIZE2);
        yield* pumpBlob(chunker, fileSource.content);
        yield* addChunks(finalizeChunker(chunker));
        fileRepresentation = buildFileRepresentation(chunkMetadata, fileChunks, computeVerificationHashHex);
        fileHashHex = computeFileHashHex(fileChunks);
        dedupRatio = fileSource.content.size > 0 ? dedupedBytes / fileSource.content.size : 0;
        if (params.rangeEditCache) {
          rangeEditCachePayload = buildFreshFileCachePayload(fileChunks, fileRepresentation);
        }
      }
      xorb.immutableData = {
        chunkIndex: xorb.chunks.length,
        offset: xorb.offset
      };
      pendingFileEvents.push({
        event: "file",
        path: fileSource.path,
        hash: fileHashHex,
        sha256: fileSource.sha256,
        dedupRatio,
        representation: fileRepresentation,
        rangeEditCachePayload
      });
    }
  }
  if (xorb.offset > 0) {
    yield xorb.event(computeXorbHashHex);
  }
  for (const event of pendingFileEvents) {
    event.representation = event.representation.map((rep) => ({
      ...rep,
      xorbId: resolveXorbId(rep.xorbId)
    }));
    yield event;
  }
}
function backtrackDedup(xorb, computeHmac, shardData, chunkCache, chunkMetadata, dedupedBytes) {
  const chunkIndexesToBacktrackFor = /* @__PURE__ */ new Map();
  for (let chunkToRecheckIndex = xorb.immutableData?.chunkIndex ?? 0; chunkToRecheckIndex < xorb.chunks.length; chunkToRecheckIndex++) {
    const chunk2 = xorb.chunks[chunkToRecheckIndex];
    const hmacHash = computeHmac(chunk2.hash, shardData.hmacKey);
    const cacheData = chunkCache.getChunk(hmacHash, null);
    if (cacheData !== void 0) {
      chunkIndexesToBacktrackFor.set(chunkToRecheckIndex, {
        xorbId: cacheData.xorbIndex,
        chunkIndex: cacheData.chunkIndex
      });
      chunkCache.removeChunkFromCache(chunk2.hash);
    }
  }
  for (const metadata of chunkMetadata) {
    if (metadata.xorbId === xorb.id && chunkIndexesToBacktrackFor.has(metadata.chunkIndex)) {
      const backtrackData = chunkIndexesToBacktrackFor.get(metadata.chunkIndex);
      if (backtrackData !== void 0) {
        metadata.xorbId = backtrackData.xorbId;
        metadata.chunkIndex = backtrackData.chunkIndex;
        dedupedBytes += metadata.length;
      }
    }
  }
  const xorbRangesToErase = [];
  for (let i = 0; i < xorb.chunks.length; i++) {
    const chunk2 = xorb.chunks[i];
    if (chunkIndexesToBacktrackFor.has(i)) {
      xorbRangesToErase.push({
        start: chunk2.offset,
        end: i < xorb.chunks.length - 1 ? xorb.chunks[i + 1].offset : xorb.offset
      });
    }
  }
  const xorbRangesToKeep = [];
  let currentStart = 0;
  for (let i = 0; i < xorbRangesToErase.length; i++) {
    const range2 = xorbRangesToErase[i];
    if (currentStart !== range2.start) {
      xorbRangesToKeep.push({ start: currentStart, end: range2.start });
    }
    currentStart = range2.end;
  }
  if (currentStart !== xorb.offset) {
    xorbRangesToKeep.push({ start: currentStart, end: xorb.offset });
  }
  let currentOffset = 0;
  for (const range2 of xorbRangesToKeep) {
    if (range2.start !== currentOffset) {
      xorb.data.set(xorb.data.subarray(range2.start, range2.end), currentOffset);
    }
    currentOffset += range2.end - range2.start;
  }
  const newXorbChunks = [];
  const oldIndexToNewIndex = /* @__PURE__ */ new Map();
  let erasedOffset = 0;
  for (let i = 0; i < xorb.chunks.length; i++) {
    const chunk2 = xorb.chunks[i];
    if (chunkIndexesToBacktrackFor.has(i)) {
      if (i < xorb.chunks.length - 1) {
        erasedOffset += xorb.chunks[i + 1].offset - chunk2.offset;
      }
    } else {
      newXorbChunks.push({
        hash: chunk2.hash,
        length: chunk2.length,
        offset: chunk2.offset - erasedOffset
      });
      if (erasedOffset > 0) {
        oldIndexToNewIndex.set(i, newXorbChunks.length - 1);
      }
    }
  }
  xorb.chunks = newXorbChunks;
  xorb.offset = currentOffset;
  for (const chunk2 of chunkMetadata) {
    if (chunk2.xorbId === xorb.id) {
      const newIndex = oldIndexToNewIndex.get(chunk2.chunkIndex);
      if (newIndex !== void 0) {
        const cached2 = chunkCache.getChunk(xorb.chunks[newIndex].hash, null);
        if (cached2 !== void 0 && cached2.xorbIndex === chunk2.xorbId && cached2.chunkIndex === chunk2.chunkIndex) {
          chunkCache.updateChunkIndex(xorb.chunks[newIndex].hash, newIndex);
        }
        chunk2.chunkIndex = newIndex;
      }
    }
  }
  return dedupedBytes;
}
function removeChunkFromSourceData(sourceChunks, chunkLength) {
  if (chunkLength === sourceChunks[0].length) {
    const chunkToCopy = sourceChunks[0];
    sourceChunks.shift();
    return chunkToCopy;
  } else if (chunkLength < sourceChunks[0].length) {
    const chunkToCopy = sourceChunks[0].subarray(0, chunkLength);
    sourceChunks[0] = sourceChunks[0].subarray(chunkLength);
    return chunkToCopy;
  } else {
    const chunkToCopy = new Uint8Array(chunkLength);
    let copyOffset = 0;
    let index = 0;
    let toSlice = -1;
    while (copyOffset < chunkLength) {
      const nToCopy = Math.min(sourceChunks[index].length, chunkLength - copyOffset);
      chunkToCopy.set(sourceChunks[index].subarray(0, nToCopy), copyOffset);
      copyOffset += nToCopy;
      if (nToCopy === sourceChunks[index].length) {
        index++;
      } else {
        toSlice = nToCopy;
      }
    }
    sourceChunks.splice(0, index);
    if (toSlice !== -1) {
      sourceChunks[0] = sourceChunks[0].subarray(toSlice);
    }
    return chunkToCopy;
  }
}
function writeChunk(xorb, chunk2, hash22, remainingBytesHint) {
  const regularCompressedChunk = compress2(chunk2);
  const bgCompressedChunk = compress2(bg4_split_bytes(chunk2));
  const compressedChunk = bgCompressedChunk.length < regularCompressedChunk.length ? bgCompressedChunk : regularCompressedChunk;
  const chunkToWrite = compressedChunk.length < chunk2.length ? compressedChunk : chunk2;
  const needed = xorb.offset + XET_CHUNK_HEADER_BYTES + chunkToWrite.length;
  if (needed > XORB_SIZE) {
    return false;
  }
  xorb.ensureCapacity(needed, remainingBytesHint);
  xorb.data[xorb.offset] = 0;
  xorb.data[xorb.offset + 1] = chunkToWrite.length & 255;
  xorb.data[xorb.offset + 2] = chunkToWrite.length >> 8 & 255;
  xorb.data[xorb.offset + 3] = chunkToWrite.length >> 16 & 255;
  xorb.data[xorb.offset + 4] = chunkToWrite.length < chunk2.length ? bgCompressedChunk.length < regularCompressedChunk.length ? 2 : 1 : 0;
  xorb.data[xorb.offset + 5] = chunk2.length & 255;
  xorb.data[xorb.offset + 6] = chunk2.length >> 8 & 255;
  xorb.data[xorb.offset + 7] = chunk2.length >> 16 & 255;
  xorb.data.set(chunkToWrite, xorb.offset + XET_CHUNK_HEADER_BYTES);
  xorb.chunks.push({ hash: hash22, length: chunk2.length, offset: xorb.offset });
  xorb.offset += XET_CHUNK_HEADER_BYTES + chunkToWrite.length;
  return true;
}
var buildFileRepresentation = (metadata, chunks, computeVerificationHash) => {
  if (metadata.length === 0) {
    return [];
  }
  const representation = [];
  let currentRange = {
    xorbId: metadata[0].xorbId,
    indexStart: metadata[0].chunkIndex,
    indexEnd: metadata[0].chunkIndex + 1,
    length: metadata[0].length,
    chunkHashStart: 0
  };
  for (let i = 1; i < metadata.length; i++) {
    const chunk2 = metadata[i];
    if (currentRange.xorbId === chunk2.xorbId && currentRange.indexEnd === chunk2.chunkIndex) {
      currentRange.indexEnd = chunk2.chunkIndex + 1;
      currentRange.length += chunk2.length;
    } else {
      const rangeHash2 = computeVerificationHash(chunks.slice(currentRange.chunkHashStart, i).map((x) => x.hash));
      representation.push({
        xorbId: currentRange.xorbId,
        indexStart: currentRange.indexStart,
        indexEnd: currentRange.indexEnd,
        length: currentRange.length,
        rangeHash: rangeHash2
      });
      currentRange = {
        xorbId: chunk2.xorbId,
        indexStart: chunk2.chunkIndex,
        indexEnd: chunk2.chunkIndex + 1,
        length: chunk2.length,
        chunkHashStart: i
      };
    }
  }
  const rangeHash = computeVerificationHash(chunks.slice(currentRange.chunkHashStart).map((x) => x.hash));
  representation.push({
    xorbId: currentRange.xorbId,
    indexStart: currentRange.indexStart,
    indexEnd: currentRange.indexEnd,
    length: currentRange.length,
    rangeHash
  });
  return representation;
};
async function loadFirstChunkDedupInfo(content, remoteXorbHashes, params, chunkCache) {
  await loadDedupInfoToCache(
    content.originalBlob.slice(0, MAX_CHUNK_SIZE),
    remoteXorbHashes,
    params,
    chunkCache,
    computeHmacHex,
    {
      maxChunks: 1,
      isAtBeginning: true
    }
  );
}
async function loadDedupInfoToCache(content, remoteXorbHashes, params, chunkCache, computeHmacHex2, opts) {
  const chunker = createChunker(TARGET_CHUNK_SIZE2);
  const cache = chunkCache;
  let dedupedBytes = 0;
  let chunksProcessed = 0;
  let totalBytes = 0;
  let bytesSinceRemoteDedup = Infinity;
  const sourceChunks = [];
  const reader = content.stream().getReader();
  const processChunks = async (chunks) => {
    for (const chunk2 of chunks) {
      chunksProcessed++;
      if (opts?.isAtBeginning && chunksProcessed === 1) {
        chunk2.dedup = true;
      }
      totalBytes += chunk2.length;
      removeChunkFromSourceData(sourceChunks, chunk2.length);
      let cacheData = cache.getChunk(chunk2.hash, computeHmacHex2);
      if (cacheData !== void 0) {
        dedupedBytes += chunk2.length;
        bytesSinceRemoteDedup += chunk2.length;
        continue;
      }
      if (chunk2.dedup && bytesSinceRemoteDedup >= INTERVAL_BETWEEN_REMOTE_DEDUP) {
        const token = await xetWriteToken(params);
        bytesSinceRemoteDedup = 0;
        const shardResp = await (params.fetch ?? fetch)(token.casUrl + "/v1/chunks/default/" + chunk2.hash, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        });
        if (shardResp.ok) {
          const shard = await shardResp.blob();
          const shardData = await parseShardData(shard);
          for (const xorb of shardData.xorbs) {
            const remoteXorbId = -remoteXorbHashes.length;
            remoteXorbHashes.push(xorb.hash);
            let i = 0;
            for (const xorbChunk of xorb.chunks) {
              cache.addChunkToCache(xorbChunk.hash, remoteXorbId, i++, shardData.hmacKey);
            }
          }
          cacheData = cache.getChunk(chunk2.hash, computeHmacHex2);
        }
      }
      if (cacheData !== void 0) {
        dedupedBytes += chunk2.length;
      }
      bytesSinceRemoteDedup += chunk2.length;
    }
  };
  while (true) {
    if (opts?.end !== void 0 && totalBytes >= opts.end) {
      break;
    }
    if (opts?.maxChunks !== void 0 && chunksProcessed >= opts.maxChunks) {
      break;
    }
    const { done, value } = await reader.read();
    if (done) {
      await processChunks(finalizeChunker(chunker));
      break;
    }
    sourceChunks.push(value);
    await processChunks(addDataToChunker(value, chunker));
  }
}
var SHARD_MAX_SIZE = 64 * 1024 * 1024;
var SHARD_HEADER_SIZE = 48;
var SHARD_FOOTER_SIZE = 200;
var HASH_LENGTH2 = 32;
var XORB_FOOTER_LENGTH = 48;
var FILE_FOOTER_LENGTH = 48;
var SHARD_HEADER_VERSION = 2n;
var SHARD_FOOTER_VERSION = 1n;
var FILE_INFO_SECTION_MAX_SIZE = Math.floor((SHARD_MAX_SIZE - SHARD_HEADER_SIZE - SHARD_FOOTER_SIZE) * 0.25);
var XORB_INFO_SECTION_MAX_SIZE = Math.floor((SHARD_MAX_SIZE - SHARD_HEADER_SIZE - SHARD_FOOTER_SIZE) * 0.75);
var SECTION_INITIAL_SIZE = 16 * 1024;
var MDB_FILE_FLAG_WITH_VERIFICATION = 2147483648;
var MDB_FILE_FLAG_WITH_METADATA_EXT = 1073741824;
var SHARD_MAGIC_TAG = new Uint8Array([
  "H".charCodeAt(0),
  "F".charCodeAt(0),
  "R".charCodeAt(0),
  "e".charCodeAt(0),
  "p".charCodeAt(0),
  "o".charCodeAt(0),
  "M".charCodeAt(0),
  "e".charCodeAt(0),
  "t".charCodeAt(0),
  "a".charCodeAt(0),
  "D".charCodeAt(0),
  "a".charCodeAt(0),
  "t".charCodeAt(0),
  "a".charCodeAt(0),
  0,
  85,
  105,
  103,
  69,
  106,
  123,
  129,
  87,
  131,
  165,
  189,
  217,
  92,
  205,
  209,
  74,
  169
]);
async function* uploadShards(source, params) {
  const xorbHashes = [];
  const seenFileXetHashes = /* @__PURE__ */ new Set();
  let fileInfoSection = new Uint8Array(0);
  let xorbInfoSection = new Uint8Array(0);
  let xorbView = new DataView(xorbInfoSection.buffer);
  let xorbViewOffset = 0;
  let fileInfoView = new DataView(fileInfoSection.buffer);
  let fileViewOffset = 0;
  const ensureXorbInfoCapacity = (needed) => {
    if (needed > xorbInfoSection.length) {
      xorbInfoSection = growSection(xorbInfoSection, xorbViewOffset, needed, XORB_INFO_SECTION_MAX_SIZE);
      xorbView = new DataView(xorbInfoSection.buffer);
    }
  };
  const ensureFileInfoCapacity = (needed) => {
    if (needed > fileInfoSection.length) {
      fileInfoSection = growSection(fileInfoSection, fileViewOffset, needed, FILE_INFO_SECTION_MAX_SIZE);
      fileInfoView = new DataView(fileInfoSection.buffer);
    }
  };
  let xorbTotalSize = 0n;
  let fileTotalSize = 0n;
  let xorbTotalUnpackedSize = 0n;
  for await (const output of createXorbs(source, params)) {
    switch (output.event) {
      case "xorb": {
        xorbHashes.push(output.hash);
        const xorbEntrySize = HASH_LENGTH2 + 4 + 4 + 4 + 4;
        const chunksSize = output.chunks.length * (HASH_LENGTH2 + 4 + 4 + 8);
        const totalXorbSize = xorbEntrySize + chunksSize;
        if (xorbViewOffset + totalXorbSize > XORB_INFO_SECTION_MAX_SIZE) {
          if (xorbViewOffset > 0 || fileViewOffset > 0) {
            await uploadShard(createShard(), params);
          }
        }
        ensureXorbInfoCapacity(xorbViewOffset + totalXorbSize);
        writeHashToArray(output.hash, xorbInfoSection, xorbViewOffset);
        xorbViewOffset += HASH_LENGTH2;
        xorbView.setUint32(xorbViewOffset, 0, true);
        xorbViewOffset += 4;
        xorbView.setUint32(xorbViewOffset, output.chunks.length, true);
        xorbViewOffset += 4;
        const xorbUnpackedSize = sum(output.chunks.map((x) => x.length));
        xorbView.setUint32(xorbViewOffset, xorbUnpackedSize, true);
        xorbTotalUnpackedSize += BigInt(xorbUnpackedSize);
        xorbTotalSize += BigInt(output.xorb.byteLength);
        xorbViewOffset += 4;
        xorbView.setUint32(xorbViewOffset, output.xorb.byteLength, true);
        xorbViewOffset += 4;
        let chunkBytes = 0;
        for (const chunk2 of output.chunks) {
          writeHashToArray(chunk2.hash, xorbInfoSection, xorbViewOffset);
          xorbViewOffset += HASH_LENGTH2;
          xorbView.setUint32(xorbViewOffset, chunkBytes, true);
          xorbViewOffset += 4;
          xorbView.setUint32(xorbViewOffset, chunk2.length, true);
          xorbViewOffset += 4;
          xorbView.setBigUint64(xorbViewOffset, 0n, true);
          xorbViewOffset += 8;
          chunkBytes += chunk2.length;
        }
        for (const file of output.files) {
          yield {
            event: "fileProgress",
            path: file.path,
            progress: file.lastSentProgress
          };
        }
        await uploadXorb(output, params);
        for (const file of output.files) {
          yield { event: "fileProgress", path: file.path, progress: file.progress };
        }
        break;
      }
      case "file": {
        yield {
          event: "file",
          path: output.path,
          xetHash: output.hash,
          sha256: output.sha256,
          dedupRatio: output.dedupRatio
        };
        if (params.rangeEditCache && output.rangeEditCachePayload) {
          addToRangeEditCache(params.rangeEditCache, output.hash, {
            size: output.rangeEditCachePayload.size,
            terms: output.representation.map((rep) => ({
              hash: typeof rep.xorbId === "number" ? xorbHashes[rep.xorbId] : rep.xorbId,
              unpackedLength: rep.length,
              range: { start: rep.indexStart, end: rep.indexEnd },
              rangeHash: rep.rangeHash
            })),
            openSubtree: output.rangeEditCachePayload.openSubtree,
            lastTermChunks: output.rangeEditCachePayload.lastTermChunks
          });
        }
        if (seenFileXetHashes.has(output.hash)) {
          break;
        }
        seenFileXetHashes.add(output.hash);
        const fileHeaderSize = HASH_LENGTH2 + 4 + 4 + 8;
        const representationSize = output.representation.length * (HASH_LENGTH2 + 4 + 4 + 4 + 4);
        const verificationSize = output.representation.length * (HASH_LENGTH2 + 16);
        const fileSha256 = output.sha256;
        const hasMetadataExt = fileSha256 !== void 0;
        const metadataSize = hasMetadataExt ? HASH_LENGTH2 + 16 : 0;
        const totalFileSize = fileHeaderSize + representationSize + verificationSize + metadataSize;
        if (fileViewOffset + totalFileSize > FILE_INFO_SECTION_MAX_SIZE) {
          if (xorbViewOffset > 0 || fileViewOffset > 0) {
            await uploadShard(createShard(), params);
          }
        }
        ensureFileInfoCapacity(fileViewOffset + totalFileSize);
        writeHashToArray(output.hash, fileInfoSection, fileViewOffset);
        fileViewOffset += HASH_LENGTH2;
        fileInfoView.setUint32(
          fileViewOffset,
          MDB_FILE_FLAG_WITH_VERIFICATION + (hasMetadataExt ? MDB_FILE_FLAG_WITH_METADATA_EXT : 0),
          true
        );
        fileViewOffset += 4;
        fileInfoView.setUint32(fileViewOffset, output.representation.length, true);
        fileViewOffset += 4;
        fileInfoView.setBigUint64(fileViewOffset, 0n, true);
        fileViewOffset += 8;
        for (const repItem of output.representation) {
          writeHashToArray(
            typeof repItem.xorbId === "number" ? xorbHashes[repItem.xorbId] : repItem.xorbId,
            fileInfoSection,
            fileViewOffset
          );
          fileViewOffset += HASH_LENGTH2;
          fileInfoView.setUint32(fileViewOffset, 0, true);
          fileViewOffset += 4;
          fileInfoView.setUint32(fileViewOffset, repItem.length, true);
          fileViewOffset += 4;
          fileInfoView.setUint32(fileViewOffset, repItem.indexStart, true);
          fileViewOffset += 4;
          fileInfoView.setUint32(fileViewOffset, repItem.indexEnd, true);
          fileViewOffset += 4;
        }
        for (const repItem of output.representation) {
          writeHashToArray(repItem.rangeHash, fileInfoSection, fileViewOffset);
          fileViewOffset += HASH_LENGTH2;
          for (let i = 0; i < 16; i++) {
            fileInfoSection[fileViewOffset + i] = 0;
          }
          fileViewOffset += 16;
        }
        if (hasMetadataExt) {
          writeHashToArray(fileSha256, fileInfoSection, fileViewOffset);
          fileViewOffset += HASH_LENGTH2;
          for (let i = 0; i < 16; i++) {
            fileInfoSection[fileViewOffset + i] = 0;
          }
          fileViewOffset += 16;
        }
        break;
      }
    }
  }
  function createShard() {
    const shard = new Uint8Array(
      SHARD_HEADER_SIZE + SHARD_FOOTER_SIZE + xorbViewOffset + XORB_FOOTER_LENGTH + fileViewOffset + FILE_FOOTER_LENGTH
    );
    const shardView = new DataView(shard.buffer);
    let shardOffset = 0;
    shard.set(SHARD_MAGIC_TAG, shardOffset);
    shardOffset += SHARD_MAGIC_TAG.length;
    shardView.setBigUint64(shardOffset, SHARD_HEADER_VERSION, true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, BigInt(SHARD_FOOTER_SIZE), true);
    shardOffset += 8;
    shard.set(fileInfoSection.slice(0, fileViewOffset), shardOffset);
    shardOffset += fileViewOffset;
    for (let i = 0; i < 32; i++) {
      shard[shardOffset + i] = 255;
    }
    shardOffset += 32;
    for (let i = 0; i < 16; i++) {
      shard[shardOffset + i] = 0;
    }
    shardOffset += 16;
    const xorbInfoOffset = shardOffset;
    shard.set(xorbInfoSection.slice(0, xorbViewOffset), shardOffset);
    shardOffset += xorbViewOffset;
    for (let i = 0; i < 32; i++) {
      shard[shardOffset + i] = 255;
    }
    shardOffset += 32;
    for (let i = 0; i < 16; i++) {
      shard[shardOffset + i] = 0;
    }
    shardOffset += 16;
    const footerOffset = shardOffset;
    shardView.setBigUint64(shardOffset, SHARD_FOOTER_VERSION, true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, BigInt(SHARD_HEADER_SIZE), true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, BigInt(xorbInfoOffset), true);
    shardOffset += 8;
    for (let i = 0; i < 48; i++) {
      shardView.setUint8(shardOffset + i, 0);
    }
    shardOffset += 48;
    for (let i = 0; i < 32; i++) {
      shardView.setUint8(shardOffset + i, 0);
    }
    shardOffset += 32;
    shardView.setBigUint64(shardOffset, BigInt(Math.floor(Date.now() / 1e3)), true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, 0n, true);
    shardOffset += 8;
    for (let i = 0; i < 48; i++) {
      shardView.setUint8(shardOffset + i, 0);
    }
    shardOffset += 48;
    shardView.setBigUint64(shardOffset, xorbTotalSize, true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, fileTotalSize, true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, xorbTotalUnpackedSize, true);
    shardOffset += 8;
    shardView.setBigUint64(shardOffset, BigInt(footerOffset), true);
    xorbViewOffset = 0;
    fileViewOffset = 0;
    xorbTotalSize = 0n;
    xorbTotalUnpackedSize = 0n;
    fileTotalSize = 0n;
    return shard;
  }
  if (xorbViewOffset || fileViewOffset) {
    await uploadShard(createShard(), params);
  }
}
function growSection(section, used, needed, maxSize) {
  if (needed > maxSize) {
    throw new Error(`Shard section overflow: needs ${needed} bytes, max is ${maxSize}`);
  }
  const newSize = Math.max(needed, Math.min(maxSize, Math.max(SECTION_INITIAL_SIZE, section.length * 2)));
  const newSection = new Uint8Array(newSize);
  newSection.set(section.subarray(0, used));
  return newSection;
}
function writeHashToArray(hash22, array, offset) {
  for (let i = 0; i < hash22.length; i += 16) {
    array[offset + i / 2] = parseInt(hash22.substring(i + 2 * 7, i + 2 * 8), 16);
    array[offset + i / 2 + 1] = parseInt(hash22.substring(i + 2 * 6, i + 2 * 7), 16);
    array[offset + i / 2 + 2] = parseInt(hash22.substring(i + 2 * 5, i + 2 * 6), 16);
    array[offset + i / 2 + 3] = parseInt(hash22.substring(i + 2 * 4, i + 2 * 5), 16);
    array[offset + i / 2 + 4] = parseInt(hash22.substring(i + 2 * 3, i + 2 * 4), 16);
    array[offset + i / 2 + 5] = parseInt(hash22.substring(i + 2 * 2, i + 2 * 3), 16);
    array[offset + i / 2 + 6] = parseInt(hash22.substring(i + 2 * 1, i + 2 * 2), 16);
    array[offset + i / 2 + 7] = parseInt(hash22.substring(i + 2 * 0, i + 2 * 1), 16);
  }
}
async function uploadXorb(xorb, params) {
  const token = await xetWriteToken(params);
  const resp = await (params.fetch ?? fetch)(`${token.casUrl}/v1/xorbs/default/${xorb.hash}`, {
    method: "POST",
    body: xorb.xorb,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      ...params.xetParams.sessionId ? { "X-Xet-Session-Id": params.xetParams.sessionId } : {}
    },
    ...{
      progressHint: {
        progressCallback: (progress) => {
          for (const file of xorb.files) {
            params.yieldCallback?.({
              event: "fileProgress",
              path: file.path,
              progress: file.lastSentProgress + (file.progress - file.lastSentProgress) * progress
            });
          }
        }
      }
    }
  });
  if (!resp.ok) {
    throw await createApiError(resp);
  }
}
async function uploadShard(shard, params) {
  const token = await xetWriteToken(params);
  const resp = await (params.fetch ?? fetch)(`${token.casUrl}/v1/shards`, {
    method: "POST",
    body: shard,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      ...params.xetParams.sessionId ? { "X-Xet-Session-Id": params.xetParams.sessionId } : {}
    }
  });
  if (!resp.ok) {
    throw await createApiError(resp);
  }
}
function splitAsyncGenerator(source, n) {
  if (n <= 0) {
    return [];
  }
  const sleep2 = (ms) => new Promise((resolve3) => setTimeout(resolve3, ms));
  let takenIndex = null;
  const generators = [];
  let remaining2 = n;
  for (let i = 0; i < n; i++) {
    generators.push({
      next: async () => {
        while (takenIndex !== null) {
          await sleep2(1);
        }
        takenIndex = i;
        return source.next().then((r) => {
          takenIndex = null;
          return r;
        });
      },
      return: async () => {
        remaining2--;
        if (remaining2 === 0) {
          return source.return(void 0);
        }
        return {
          done: true,
          value: void 0
        };
      },
      throw: async (error) => {
        return source.throw(error);
      },
      [Symbol.asyncIterator]: () => generators[i]
    });
  }
  return generators;
}
function randomUUID() {
  if (typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = hexFromBytes(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var CONCURRENT_SHAS = 5;
var CONCURRENT_LFS_UPLOADS = 5;
var MULTIPART_PARALLEL_UPLOAD = 5;
function isFileOperation(op) {
  const ret = op.operation === "addOrUpdate";
  if (ret && !(op.content instanceof Blob)) {
    throw new TypeError("Precondition failed: op.content should be a Blob");
  }
  return ret;
}
async function* commitIter(params) {
  const accessToken = checkCredentials(params);
  const repoId = toRepoId(params.repo);
  if (repoId.type === "bucket") {
    return yield* commitIterBucket(params);
  }
  if (params.operations.some((op) => op.operation === "copy")) {
    throw new Error("'copy' operations are only supported when the destination repo is a bucket");
  }
  yield { event: "phase", phase: "preuploading" };
  let useXet = params.useXet ?? true;
  const lfsShas = /* @__PURE__ */ new Map();
  const abortController = new AbortController();
  const abortSignal = abortController.signal;
  if (!abortSignal.throwIfAborted) {
    abortSignal.throwIfAborted = () => {
      if (abortSignal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
    };
  }
  if (params.abortSignal) {
    params.abortSignal.addEventListener("abort", () => abortController.abort());
  }
  try {
    const allOperations = (await Promise.all(
      params.operations.map(async (operation) => {
        if (operation.operation === "edit") {
          const splicedBlob = SplicedBlob.create(
            operation.originalContent,
            operation.edits.map((splice) => ({ insert: splice.content, start: splice.start, end: splice.end }))
          );
          return {
            operation: "addOrUpdate",
            path: operation.path,
            content: splicedBlob
          };
        }
        if (operation.operation !== "addOrUpdate") {
          return operation;
        }
        if (!(operation.content instanceof URL)) {
          return { ...operation, content: operation.content };
        }
        const lazyBlobs = await createBlobs(operation.content, operation.path, {
          fetch: params.fetch,
          maxFolderDepth: params.maxFolderDepth
        });
        abortSignal?.throwIfAborted();
        return lazyBlobs.map((blob) => ({
          ...operation,
          content: blob.blob,
          path: blob.path
        }));
      })
    )).flat(1);
    const gitAttributes = allOperations.filter(isFileOperation).find((op) => op.path === ".gitattributes")?.content;
    for (const operations of chunk(allOperations.filter(isFileOperation), 100)) {
      const payload = {
        gitAttributes: gitAttributes && await gitAttributes.text(),
        files: await Promise.all(
          operations.map(async (operation) => ({
            path: operation.path,
            size: operation.content.size,
            sample: base64FromBytes(new Uint8Array(await operation.content.slice(0, 512).arrayBuffer()))
          }))
        )
      };
      abortSignal?.throwIfAborted();
      const res = await (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/preupload/${encodeURIComponent(
          params.branch ?? "main"
        )}` + (params.isPullRequest ? "?create_pr=1" : ""),
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          signal: abortSignal
        }
      );
      if (!res.ok) {
        throw await createApiError(res);
      }
      const json = await res.json();
      for (const file of json.files) {
        if (file.uploadMode === "lfs") {
          lfsShas.set(file.path, null);
        }
      }
    }
    yield { event: "phase", phase: "uploadingLargeFiles" };
    for (const operations of chunk(
      allOperations.filter(isFileOperation).filter((op) => lfsShas.has(op.path)),
      100
    )) {
      const shas = yield* eventToGenerator((yieldCallback, returnCallback, rejectCallack) => {
        return promisesQueue(
          operations.map((op) => async () => {
            const iterator = sha256(op.content, { useWebWorker: params.useWebWorkers, abortSignal });
            let res2;
            do {
              res2 = await iterator.next();
              if (!res2.done) {
                yieldCallback({ event: "fileProgress", path: op.path, progress: res2.value, state: "hashing" });
              }
            } while (!res2.done);
            const sha = res2.value;
            lfsShas.set(op.path, res2.value);
            return sha;
          }),
          CONCURRENT_SHAS
        ).then(returnCallback, rejectCallack);
      });
      abortSignal?.throwIfAborted();
      const payload = {
        operation: "upload",
        // multipart is a custom protocol for HF
        transfers: ["basic", "multipart", ...useXet ? ["xet"] : []],
        hash_algo: "sha_256",
        ...!params.isPullRequest && {
          ref: {
            name: params.branch ?? "main"
          }
        },
        objects: operations.map((op, i) => ({
          oid: shas[i],
          size: op.content.size
        }))
      };
      const res = await (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/${repoId.type === "model" ? "" : repoId.type + "s/"}${repoId.name}.git/info/lfs/objects/batch`,
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            Accept: "application/vnd.git-lfs+json",
            "Content-Type": "application/vnd.git-lfs+json"
          },
          body: JSON.stringify(payload),
          signal: abortSignal
        }
      );
      if (!res.ok) {
        throw await createApiError(res);
      }
      const json = await res.json();
      const batchRequestId = res.headers.get("X-Request-Id") || void 0;
      const shaToOperation = new Map(operations.map((op, i) => [shas[i], op]));
      if (useXet && json.transfer !== "xet") {
        useXet = false;
      }
      let xetParams = null;
      if (useXet) {
        for (const obj of json.objects) {
          const op = shaToOperation.get(obj.oid);
          if (!op) {
            throw new InvalidApiResponseFormatError("Unrequested object ID in response");
          }
          if (obj.error) {
            const errorMessage = `Error while doing LFS batch call for ${operations[shas.indexOf(obj.oid)].path}: ${obj.error.message}${batchRequestId ? ` - Request ID: ${batchRequestId}` : ""}`;
            throw new HubApiError(res.url, obj.error.code, batchRequestId, errorMessage);
          }
          if (!obj.actions?.upload) {
            yield {
              event: "fileProgress",
              path: op.path,
              progress: 1,
              state: "uploading"
            };
          } else {
            const headers = new Headers(obj.actions.upload.header);
            xetParams = {
              sessionId: headers.get("X-Xet-Session-Id") ?? void 0,
              casUrl: headers.get("X-Xet-Cas-Url") ?? void 0,
              accessToken: headers.get("X-Xet-Access-Token") ?? void 0,
              expiresAt: headers.get("X-Xet-Token-Expiration") ? new Date(parseInt(headers.get("X-Xet-Token-Expiration") ?? "0") * 1e3) : void 0,
              refreshWriteTokenUrl: obj.actions.upload.href
            };
          }
        }
        const source = async function* () {
          for (const obj of json.objects) {
            const op = shaToOperation.get(obj.oid);
            if (!op || !obj.actions?.upload) {
              continue;
            }
            abortSignal?.throwIfAborted();
            yield { content: op.content, path: op.path, sha256: obj.oid };
          }
        }();
        if (xetParams) {
          const fixedXetParams = xetParams;
          const sources = splitAsyncGenerator(source, 5);
          yield* eventToGenerator(
            (yieldCallback, returnCallback, rejectCallback) => Promise.all(
              sources.map(async function(source2) {
                for await (const event of uploadShards(source2, {
                  fetch: params.fetch,
                  accessToken,
                  hubUrl: params.hubUrl ?? HUB_URL,
                  repo: repoId,
                  xetParams: fixedXetParams,
                  // todo: maybe leave empty if PR?
                  rev: params.branch ?? "main",
                  isPullRequest: params.isPullRequest,
                  rangeEditCache: params.rangeEditCache,
                  yieldCallback: (event2) => yieldCallback({ ...event2, state: "uploading" })
                })) {
                  if (event.event === "file") {
                    yieldCallback({
                      event: "fileProgress",
                      path: event.path,
                      progress: 1,
                      state: "uploading"
                    });
                  } else if (event.event === "fileProgress") {
                    yieldCallback({
                      event: "fileProgress",
                      path: event.path,
                      progress: event.progress,
                      state: "uploading"
                    });
                  }
                }
              })
            ).then(() => returnCallback(void 0), rejectCallback)
          );
        } else {
        }
      } else {
        yield* eventToGenerator((yieldCallback, returnCallback, rejectCallback) => {
          return promisesQueueStreaming(
            json.objects.map((obj) => async () => {
              const op = shaToOperation.get(obj.oid);
              if (!op) {
                throw new InvalidApiResponseFormatError("Unrequested object ID in response");
              }
              abortSignal?.throwIfAborted();
              if (obj.error) {
                const errorMessage = `Error while doing LFS batch call for ${operations[shas.indexOf(obj.oid)].path}: ${obj.error.message}${batchRequestId ? ` - Request ID: ${batchRequestId}` : ""}`;
                throw new HubApiError(res.url, obj.error.code, batchRequestId, errorMessage);
              }
              if (!obj.actions?.upload) {
                yieldCallback({
                  event: "fileProgress",
                  path: op.path,
                  progress: 1,
                  state: "uploading"
                });
                return;
              }
              yieldCallback({
                event: "fileProgress",
                path: op.path,
                progress: 0,
                state: "uploading"
              });
              const content = op.content;
              const header = obj.actions.upload.header;
              if (header?.chunk_size) {
                const chunkSize = parseInt(header.chunk_size);
                const completionUrl = obj.actions.upload.href;
                const parts = Object.keys(header).filter((key) => /^[0-9]+$/.test(key));
                if (parts.length !== Math.ceil(content.size / chunkSize)) {
                  throw new Error("Invalid server response to upload large LFS file, wrong number of parts");
                }
                const completeReq = {
                  oid: obj.oid,
                  parts: parts.map((part) => ({
                    partNumber: +part,
                    etag: ""
                  }))
                };
                const progressCallback = (progress) => yieldCallback({ event: "fileProgress", path: op.path, progress, state: "uploading" });
                await promisesQueueStreaming(
                  parts.map((part) => async () => {
                    abortSignal?.throwIfAborted();
                    const index = parseInt(part) - 1;
                    const slice = content.slice(index * chunkSize, (index + 1) * chunkSize);
                    const res3 = await (params.fetch ?? fetch)(header[part], {
                      method: "PUT",
                      /** Unfortunately, browsers don't support our inherited version of Blob in fetch calls */
                      body: slice instanceof WebBlob && isFrontend ? await slice.arrayBuffer() : slice,
                      signal: abortSignal,
                      ...{
                        progressHint: {
                          path: op.path,
                          part: index,
                          numParts: parts.length,
                          progressCallback
                        }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      }
                    });
                    if (!res3.ok) {
                      throw await createApiError(res3, {
                        requestId: batchRequestId,
                        message: `Error while uploading part ${part} of ${operations[shas.indexOf(obj.oid)].path} to LFS storage`
                      });
                    }
                    const eTag = res3.headers.get("ETag");
                    if (!eTag) {
                      throw new Error("Cannot get ETag of part during multipart upload");
                    }
                    completeReq.parts[Number(part) - 1].etag = eTag;
                  }),
                  MULTIPART_PARALLEL_UPLOAD
                );
                abortSignal?.throwIfAborted();
                const res2 = await (params.fetch ?? fetch)(completionUrl, {
                  method: "POST",
                  body: JSON.stringify(completeReq),
                  headers: {
                    Accept: "application/vnd.git-lfs+json",
                    "Content-Type": "application/vnd.git-lfs+json"
                  },
                  signal: abortSignal
                });
                if (!res2.ok) {
                  throw await createApiError(res2, {
                    requestId: batchRequestId,
                    message: `Error completing multipart upload of ${operations[shas.indexOf(obj.oid)].path} to LFS storage`
                  });
                }
                yieldCallback({
                  event: "fileProgress",
                  path: op.path,
                  progress: 1,
                  state: "uploading"
                });
              } else {
                const res2 = await (params.fetch ?? fetch)(obj.actions.upload.href, {
                  method: "PUT",
                  headers: {
                    ...batchRequestId ? { "X-Request-Id": batchRequestId } : void 0
                  },
                  /** Unfortunately, browsers don't support our inherited version of Blob in fetch calls */
                  body: content instanceof WebBlob && isFrontend ? await content.arrayBuffer() : content,
                  signal: abortSignal,
                  ...{
                    progressHint: {
                      path: op.path,
                      progressCallback: (progress) => yieldCallback({
                        event: "fileProgress",
                        path: op.path,
                        progress,
                        state: "uploading"
                      })
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  }
                });
                if (!res2.ok) {
                  throw await createApiError(res2, {
                    requestId: batchRequestId,
                    message: `Error while uploading ${operations[shas.indexOf(obj.oid)].path} to LFS storage`
                  });
                }
                yieldCallback({
                  event: "fileProgress",
                  path: op.path,
                  progress: 1,
                  state: "uploading"
                });
              }
            }),
            CONCURRENT_LFS_UPLOADS
          ).then(returnCallback, rejectCallback);
        });
      }
    }
    abortSignal?.throwIfAborted();
    yield { event: "phase", phase: "committing" };
    return yield* eventToGenerator(
      async (yieldCallback, returnCallback, rejectCallback) => (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/commit/${encodeURIComponent(
          params.branch ?? "main"
        )}` + (params.isPullRequest ? "?create_pr=1" : ""),
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            "Content-Type": "application/x-ndjson"
          },
          body: [
            {
              key: "header",
              value: {
                summary: params.title,
                description: params.description,
                parentCommit: params.parentCommit
              }
            },
            ...await Promise.all(
              allOperations.map((operation) => {
                if (isFileOperation(operation)) {
                  const sha = lfsShas.get(operation.path);
                  if (sha) {
                    return {
                      key: "lfsFile",
                      value: {
                        path: operation.path,
                        algo: "sha256",
                        size: operation.content.size,
                        oid: sha
                      }
                    };
                  }
                }
                return convertOperationToNdJson(operation);
              })
            )
          ].map((x) => JSON.stringify(x)).join("\n"),
          signal: abortSignal,
          ...{
            progressHint: {
              progressCallback: (progress) => {
                for (const op of allOperations) {
                  if (isFileOperation(op) && !lfsShas.has(op.path)) {
                    yieldCallback({
                      event: "fileProgress",
                      path: op.path,
                      progress,
                      state: "uploading"
                    });
                  }
                }
              }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }
        }
      ).then(async (res) => {
        if (!res.ok) {
          throw await createApiError(res);
        }
        const json = await res.json();
        returnCallback({
          pullRequestUrl: json.pullRequestUrl,
          commit: {
            oid: json.commitOid,
            url: json.commitUrl
          },
          hookOutput: json.hookOutput
        });
      }).catch(rejectCallback)
    );
  } catch (err) {
    abortController.abort();
    throw err;
  }
}
async function* commitIterBucket(params) {
  const accessToken = checkCredentials(params);
  const repoId = toRepoId(params.repo);
  if (params.useXet === false) {
    throw new Error("useXet must be true or undefined for buckets");
  }
  const abortController = new AbortController();
  const abortSignal = abortController.signal;
  if (!abortSignal.throwIfAborted) {
    abortSignal.throwIfAborted = () => {
      if (abortSignal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
    };
  }
  if (params.abortSignal) {
    params.abortSignal.addEventListener("abort", () => abortController.abort());
  }
  try {
    const allOperations = (await Promise.all(
      params.operations.map(async (operation) => {
        if (operation.operation === "edit") {
          const splicedBlob = SplicedBlob.create(
            operation.originalContent,
            operation.edits.map((splice) => ({ insert: splice.content, start: splice.start, end: splice.end }))
          );
          return {
            operation: "addOrUpdate",
            path: operation.path,
            content: splicedBlob
          };
        }
        if (operation.operation !== "addOrUpdate") {
          return operation;
        }
        if (!(operation.content instanceof URL)) {
          return { ...operation, content: operation.content };
        }
        const lazyBlobs = await createBlobs(operation.content, operation.path, {
          fetch: params.fetch,
          maxFolderDepth: params.maxFolderDepth
        });
        abortSignal?.throwIfAborted();
        return lazyBlobs.map((blob) => ({
          ...operation,
          content: blob.blob,
          path: blob.path
        }));
      })
    )).flat(1);
    yield { event: "phase", phase: "uploadingLargeFiles" };
    for (const operations of chunk(allOperations.filter(isFileOperation), 100)) {
      const xetHashes = /* @__PURE__ */ new Map();
      abortSignal?.throwIfAborted();
      const source = async function* () {
        for (const operation of operations) {
          abortSignal?.throwIfAborted();
          yield { content: operation.content, path: operation.path };
        }
      }();
      const xetParams = {
        sessionId: randomUUID(),
        refreshWriteTokenUrl: `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/xet-write-token`
      };
      const sources = splitAsyncGenerator(source, 5);
      yield* eventToGenerator(
        (yieldCallback, returnCallback, rejectCallback) => Promise.all(
          sources.map(async function(source2) {
            for await (const event of uploadShards(source2, {
              fetch: params.fetch,
              accessToken,
              hubUrl: params.hubUrl ?? HUB_URL,
              repo: repoId,
              xetParams,
              rev: params.branch ?? "main",
              rangeEditCache: params.rangeEditCache,
              yieldCallback: (event2) => yieldCallback({ ...event2, state: "uploading" })
            })) {
              if (event.event === "file") {
                yieldCallback({
                  event: "fileProgress",
                  path: event.path,
                  progress: 1,
                  state: "uploading"
                });
                xetHashes.set(event.path, event.xetHash);
              } else if (event.event === "fileProgress") {
                yieldCallback({
                  event: "fileProgress",
                  path: event.path,
                  progress: event.progress,
                  state: "uploading"
                });
              }
            }
          })
        ).then(() => returnCallback(void 0), rejectCallback)
      );
      const resp = await (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/batch`,
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            "Content-Type": "application/x-ndjson"
          },
          body: [...xetHashes.entries()].map(
            ([path22, xetHash]) => JSON.stringify({
              type: "addFile",
              path: path22,
              xetHash
            })
          ).join("\n"),
          signal: abortSignal
        }
      );
      if (!resp.ok && resp.status !== 422) {
        throw await createApiError(resp);
      }
      const json = await resp.json();
      for (const failed of json.failed) {
        yield {
          event: "fileProgress",
          path: failed.path,
          progress: 0,
          state: "error"
        };
      }
    }
    abortSignal?.throwIfAborted();
    const copyOperations = allOperations.filter(
      (operation) => operation.operation === "copy"
    );
    for (const copyChunk of chunk(copyOperations, 100)) {
      abortSignal?.throwIfAborted();
      const resp = await (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/batch`,
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            "Content-Type": "application/x-ndjson"
          },
          body: copyChunk.map((op) => {
            const sourceRepoId = toRepoId(op.sourceRepo);
            return JSON.stringify({
              type: "copyFile",
              path: op.path,
              xetHash: op.sourceXetHash,
              sourceRepoType: sourceRepoId.type,
              sourceRepoId: sourceRepoId.name
            });
          }).join("\n"),
          signal: abortSignal
        }
      );
      if (!resp.ok && resp.status !== 422) {
        throw await createApiError(resp);
      }
      const json = await resp.json();
      for (const failed of json.failed) {
        yield {
          event: "fileProgress",
          path: failed.path,
          progress: 0,
          state: "error"
        };
      }
    }
    abortSignal?.throwIfAborted();
    const deletedOperations = allOperations.filter((operation) => operation.operation === "delete");
    if (deletedOperations.length > 0) {
      const resp = await (params.fetch ?? fetch)(
        `${params.hubUrl ?? HUB_URL}/api/${repoId.type}s/${repoId.name}/batch`,
        {
          method: "POST",
          headers: {
            ...accessToken && { Authorization: `Bearer ${accessToken}` },
            "Content-Type": "application/x-ndjson"
          },
          body: deletedOperations.map(
            (operation) => JSON.stringify({
              type: "deleteFile",
              path: operation.path
            })
          ).join("\n"),
          signal: abortSignal
        }
      );
      if (!resp.ok) {
        throw await createApiError(resp);
      }
      const json = await resp.json();
      if (json.failed.length > 0) {
        const failedPaths = json.failed.slice(0, 5).map((f) => f.path);
        throw new Error(
          `Failed to delete ${json.failed.length} file(s): ${failedPaths.join(", ")}${json.failed.length > 5 ? "..." : ""}, request ID: ${resp.headers.get("X-Request-Id")}`
        );
      }
    }
    abortSignal?.throwIfAborted();
  } catch (err) {
    abortController.abort();
    throw err;
  }
}
async function commit(params) {
  const iterator = commitIter(params);
  const failedPaths = [];
  let failedCount = 0;
  let res = await iterator.next();
  while (!res.done) {
    if (res.value.event === "fileProgress" && res.value.state === "error") {
      failedCount++;
      if (failedPaths.length < 5) {
        failedPaths.push(res.value.path);
      }
    }
    res = await iterator.next();
  }
  if (failedCount > 0) {
    throw new Error(
      `Failed to upload ${failedCount} file(s): ${failedPaths.join(", ")}${failedCount > 5 ? "..." : ""}`
    );
  }
  return res.value;
}
async function convertOperationToNdJson(operation) {
  switch (operation.operation) {
    case "addOrUpdate": {
      return {
        key: "file",
        value: {
          content: base64FromBytes(new Uint8Array(await operation.content.arrayBuffer())),
          path: operation.path,
          encoding: "base64"
        }
      };
    }
    case "delete": {
      return {
        key: "deletedFile",
        value: {
          path: operation.path
        }
      };
    }
    case "edit": {
      throw new Error(
        "Edit operations should be converted to addOrUpdate operations before reaching convertOperationToNdJson"
      );
    }
    default:
      throw new TypeError("Unknown operation: " + operation.operation);
  }
}
async function pathsInfo(params) {
  const accessToken = checkCredentials(params);
  const repoId = toRepoId(params.repo);
  const hubUrl = params.hubUrl ?? HUB_URL;
  const revision = repoId.type === "bucket" ? void 0 : params.revision ?? "main";
  const url = `${hubUrl}/api/${repoId.type}s/${repoId.name}/paths-info${revision ? `/${encodeURIComponent(revision)}` : ""}`;
  const resp = await (params.fetch ?? fetch)(url, {
    method: "POST",
    headers: {
      ...accessToken && {
        Authorization: `Bearer ${accessToken}`
      },
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      paths: params.paths,
      expand: params.expand
    })
  });
  if (!resp.ok) {
    throw await createApiError(resp);
  }
  const json = await resp.json();
  if (!Array.isArray(json)) {
    throw new Error("malformed response: expected array");
  }
  return json.map((item) => ({
    path: item.path,
    lfs: item.lfs,
    type: item.type,
    oid: item.oid,
    size: item.size,
    xetHash: item.xetHash,
    uploadedAt: item.uploadedAt,
    securityFileStatus: item.securityFileStatus,
    lastCommit: item.lastCommit ? {
      date: new Date(item.lastCommit.date),
      title: item.lastCommit.title,
      id: item.lastCommit.id
    } : void 0
  }));
}
async function createRepo(params) {
  const accessToken = checkCredentials(params);
  const repoId = toRepoId(params.repo);
  const [namespace, repoName] = repoId.name.split("/");
  const visibility = params.visibility ?? (params.private !== void 0 ? params.private ? "private" : "public" : void 0);
  if (!namespace || !repoName) {
    throw new TypeError(
      `"${repoId.name}" is not a fully qualified repo name. It should be of the form "{namespace}/{repoName}".`
    );
  }
  const res = repoId.type === "bucket" ? await (params.fetch ?? fetch)(`${params.hubUrl ?? HUB_URL}/api/buckets/${namespace}/${repoName}`, {
    method: "POST",
    body: JSON.stringify({
      visibility,
      resourceGroupId: params.resourceGroupId
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }) : await (params.fetch ?? fetch)(`${params.hubUrl ?? HUB_URL}/api/repos/create`, {
    method: "POST",
    body: JSON.stringify({
      name: repoName,
      visibility,
      organization: namespace,
      resourceGroupId: params.resourceGroupId,
      license: params.license,
      ...repoId.type === "space" ? {
        type: "space",
        sdk: params.sdk ?? "static",
        hardware: params.hardware
      } : {
        type: repoId.type
      },
      files: params.files ? await Promise.all(
        params.files.map(async (file) => ({
          encoding: "base64",
          path: file.path,
          content: base64FromBytes(
            new Uint8Array(file.content instanceof Blob ? await file.content.arrayBuffer() : file.content)
          )
        }))
      ) : void 0
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    throw await createApiError(res);
  }
  const output = await res.json();
  return { repoUrl: output.url, id: output.id };
}
var REGEX_COMMIT_HASH = new RegExp("^[0-9a-f]{40}$");
function typedInclude(arr, v) {
  return arr.includes(v);
}
var DIFFUSERS_SAFETENSORS_FILE = "diffusion_pytorch_model.safetensors";
var DIFFUSERS_SAFETENSORS_INDEX_FILE = "diffusion_pytorch_model.safetensors.index.json";
var DIFFUSERS_WEIGHTS_SUBFOLDERS = ["transformer", "unet"];
var MAX_TENSOR_DIM = 2 ** 32;
var LIBRARY_WEIGHT_CANDIDATES = {
  // diffusers keeps the main module (the diffusion transformer / U-Net) under a subfolder,
  // or at the repo root for single-component repos (ControlNets, standalone VAEs). This matches
  // how a diffusion model's size is conventionally reported: the diffusion transformer / U-Net,
  // not the sum of VAE + text encoders.
  diffusers: [
    ...DIFFUSERS_WEIGHTS_SUBFOLDERS.map((folder) => ({
      single: `${folder}/${DIFFUSERS_SAFETENSORS_FILE}`,
      index: `${folder}/${DIFFUSERS_SAFETENSORS_INDEX_FILE}`
    })),
    { single: DIFFUSERS_SAFETENSORS_FILE, index: DIFFUSERS_SAFETENSORS_INDEX_FILE }
  ]
};
function uploadFile(params) {
  const path22 = params.file instanceof URL ? params.file.pathname.split("/").at(-1) ?? "file" : "path" in params.file ? params.file.path : params.file.name;
  const operation = typeof params.file === "object" && "edits" in params.file ? {
    operation: "edit",
    path: path22,
    originalContent: params.file.originalContent,
    edits: params.file.edits
  } : {
    operation: "addOrUpdate",
    path: path22,
    content: "content" in params.file ? params.file.content : params.file
  };
  return commit({
    ...params.accessToken ? { accessToken: params.accessToken } : { credentials: params.credentials },
    repo: params.repo,
    operations: [operation],
    title: params.commitTitle ?? `${operation.operation === "edit" ? "Edit" : "Add"} ${path22}`,
    description: params.commitDescription,
    hubUrl: params.hubUrl,
    branch: params.branch,
    isPullRequest: params.isPullRequest,
    parentCommit: params.parentCommit,
    fetch: params.fetch,
    useWebWorkers: params.useWebWorkers,
    abortSignal: params.abortSignal,
    useXet: params.useXet,
    rangeEditCache: params.rangeEditCache
  });
}
var multipartUploadTracking = /* @__PURE__ */ new WeakMap();
async function* uploadFilesWithProgress(params) {
  const operations = params.files.map((file) => {
    const path22 = file instanceof URL ? file.pathname.split("/").at(-1) ?? "file" : "path" in file ? file.path : file.name;
    if (typeof file === "object" && "edits" in file) {
      return {
        operation: "edit",
        path: path22,
        originalContent: file.originalContent,
        edits: file.edits
      };
    }
    return {
      operation: "addOrUpdate",
      path: path22,
      content: "content" in file ? file.content : file
    };
  });
  return yield* commitIter({
    ...params.accessToken ? { accessToken: params.accessToken } : { credentials: params.credentials },
    repo: params.repo,
    operations,
    title: params.commitTitle ?? `Add ${params.files.length} files`,
    description: params.commitDescription,
    hubUrl: params.hubUrl,
    branch: params.branch,
    isPullRequest: params.isPullRequest,
    parentCommit: params.parentCommit,
    useWebWorkers: params.useWebWorkers,
    abortSignal: params.abortSignal,
    useXet: params.useXet,
    rangeEditCache: params.rangeEditCache,
    fetch: async (input, init) => {
      if (!init) {
        return fetch(input);
      }
      if (!typedInclude(["PUT", "POST"], init.method) || !("progressHint" in init) || !init.progressHint || typeof XMLHttpRequest === "undefined" || typeof input !== "string" || !(init.body instanceof ArrayBuffer) && !(init.body instanceof Blob) && !(init.body instanceof File) && typeof init.body !== "string") {
        return fetch(input, init);
      }
      const progressHint = init.progressHint;
      const progressCallback = progressHint.progressCallback;
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          if (progressHint.part !== void 0) {
            let tracking = multipartUploadTracking.get(progressCallback);
            if (!tracking) {
              tracking = { numParts: progressHint.numParts, partsProgress: {} };
              multipartUploadTracking.set(progressCallback, tracking);
            }
            tracking.partsProgress[progressHint.part] = event.loaded / event.total;
            let totalProgress = 0;
            for (const partProgress of Object.values(tracking.partsProgress)) {
              totalProgress += partProgress;
            }
            if (totalProgress === tracking.numParts) {
              progressCallback(0.9999999999);
            } else {
              progressCallback(totalProgress / tracking.numParts);
            }
          } else {
            if (event.loaded === event.total) {
              progressCallback(0.9999999999);
            } else {
              progressCallback(event.loaded / event.total);
            }
          }
        }
      });
      xhr.open(init.method, input, true);
      if (init.headers) {
        const headers = new Headers(init.headers);
        headers.forEach((value, key) => {
          xhr.setRequestHeader(key, value);
        });
      }
      init.signal?.throwIfAborted();
      xhr.send(init.body);
      return new Promise((resolve3, reject) => {
        xhr.addEventListener("load", () => {
          resolve3(
            new Response(xhr.responseText, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: Object.fromEntries(
                xhr.getAllResponseHeaders().trim().split("\n").map((header) => [
                  header.slice(0, header.indexOf(":")),
                  header.slice(header.indexOf(":") + 1).trim()
                ])
              )
            })
          );
        });
        xhr.addEventListener("error", () => {
          reject(new Error(xhr.statusText));
        });
        if (init.signal) {
          init.signal.addEventListener("abort", () => {
            xhr.abort();
            try {
              init.signal?.throwIfAborted();
            } catch (err) {
              reject(err);
            }
          });
        }
      });
    }
  });
}
async function whoAmI(params) {
  const accessToken = checkCredentials(params);
  const res = await (params.fetch ?? fetch)(`${params.hubUrl ?? HUB_URL}/api/whoami-v2`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!res.ok) {
    throw await createApiError(res);
  }
  const response = await res.json();
  if (typeof response.auth.accessToken?.createdAt === "string") {
    response.auth.accessToken.createdAt = new Date(response.auth.accessToken.createdAt);
  }
  return response;
}

// node_modules/@huggingface/hub/dist/index.mjs
init_chunk_FFYIGW52();

// server/fetcher.mjs
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
var KIWIX_MIRRORS = [
  "https://ftp.fau.de/kiwix/zim",
  "https://ftp.nluug.nl/pub/kiwix/zim",
  "https://mirrors.dotsrc.org/kiwix/zim",
  "https://mirror.accum.se/mirror/kiwix.org/zim",
  "https://dumps.wikimedia.org/kiwix/zim",
  "https://wi.mirror.driftle.ss/kiwix/zim",
  "https://mirror.download.kiwix.org/zim",
  "https://download.kiwix.org/zim"
];
var PART_DIR = "_indiriliyor";
var SEGMENTS = 4;
var MIN_SEGMENT = 16 * 1024 * 1024;
var PROBE_BYTES = 3 * 1024 * 1024;
var PROBE_MS = 7e3;
var STALL_MS = 25e3;
var SAVE_MS = 2e3;
function expandMirrors(urls) {
  const out = [];
  const add = (u) => {
    if (u && /^https?:\/\//.test(u) && !out.includes(u)) out.push(u);
  };
  for (const u of urls ?? []) {
    const m = /^https?:\/\/[^/]*kiwix\.org\/zim\/(.+)$/.exec(u) ?? /^https?:\/\/[^/]+\/(?:.*\/)?kiwix(?:\.org)?(?:-md)?\/zim\/(.+)$/.exec(u);
    if (m) for (const b of KIWIX_MIRRORS) add(`${b}/${m[1]}`);
    add(u);
  }
  return out;
}
function planSegments(total, n = SEGMENTS, min = MIN_SEGMENT) {
  if (!total) return [{ start: 0, end: -1, pos: 0 }];
  const count = Math.max(1, Math.min(n, Math.floor(total / min) || 1));
  const size = Math.ceil(total / count);
  const out = [];
  for (let i = 0; i < count; i++) {
    const start = i * size;
    const end = Math.min(total, start + size) - 1;
    if (start <= end) out.push({ start, end, pos: start });
  }
  return out;
}
function remaining(segs) {
  return segs.reduce((a, s) => a + (s.end < 0 ? 1 : Math.max(0, s.end - s.pos + 1)), 0);
}
function safeName(name) {
  return typeof name === "string" && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) && !name.includes("..");
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function createFetcher(o) {
  const f = o.fetch ?? fetch;
  const partDir = path.join(o.dataDir, PART_DIR);
  const jobs = /* @__PURE__ */ new Map();
  const expand = o.mirrors ?? expandMirrors;
  const stallMs = o.stallMs ?? STALL_MS;
  const pub = (j) => ({
    file: j.file,
    id: j.id,
    status: j.status,
    received: j.received,
    total: j.total,
    speed: Math.round(j.speed),
    mirror: j.mirrorHost ?? null,
    error: j.error ?? null
  });
  async function findEntry(fileOrId) {
    const m = await o.loadManifest().catch(() => null);
    return (m?.packs ?? []).find((p) => p.file === fileOrId || p.id === fileOrId) ?? null;
  }
  async function probe(urls) {
    const ctls = [];
    let graceSet = false;
    const grace = () => {
      if (graceSet) return;
      graceSet = true;
      setTimeout(() => ctls.forEach((c) => c.abort()), 1500).unref?.();
    };
    const results = await Promise.all(
      urls.map(async (url) => {
        const ctl = new AbortController();
        ctls.push(ctl);
        const t = setTimeout(() => ctl.abort(), o.probeMs ?? PROBE_MS);
        const t0 = Date.now();
        let got = 0;
        let total = 0;
        try {
          const r = await f(url, { headers: { Range: `bytes=0-${PROBE_BYTES - 1}` }, signal: ctl.signal, redirect: "follow" });
          if (r.status !== 206 && r.status !== 200) {
            r.body?.cancel?.().catch(() => {
            });
            return null;
          }
          const cr = /\/(\d+)$/.exec(r.headers.get("content-range") ?? "");
          total = cr ? Number(cr[1]) : r.status === 200 ? Number(r.headers.get("content-length")) || 0 : 0;
          const ranges = r.status === 206;
          const reader = r.body.getReader();
          for (; ; ) {
            const { done, value } = await reader.read();
            if (done) break;
            got += value.length;
            if (got >= PROBE_BYTES) {
              reader.cancel().catch(() => {
              });
              break;
            }
          }
          const sec = Math.max(0.05, (Date.now() - t0) / 1e3);
          grace();
          return { url, speed: got / sec, total, ranges };
        } catch {
          const sec = Math.max(0.05, (Date.now() - t0) / 1e3);
          return got > 256 * 1024 ? { url, speed: got / sec, total, ranges: true } : null;
        } finally {
          clearTimeout(t);
        }
      })
    );
    return results.filter(Boolean).sort((a, b) => b.speed - a.speed);
  }
  async function saveState(j) {
    const st = { file: j.file, id: j.id, total: j.total, sha256: j.sha256 ?? "", segments: j.segments };
    await fsp.writeFile(j.statePath, JSON.stringify(st)).catch(() => {
    });
  }
  async function run(j) {
    j.status = "checking";
    j.error = null;
    o.onChange?.();
    const ctl = new AbortController();
    j.ctl = ctl;
    let fh;
    try {
      await fsp.mkdir(partDir, { recursive: true });
      const ranked = await probe(j.urls);
      if (ctl.signal.aborted) throw Object.assign(new Error("durduruldu"), { aborted: true });
      if (!ranked.length) throw new Error("Hi\xE7bir kayna\u011Fa ula\u015F\u0131lamad\u0131. \u0130nternet ba\u011Flant\u0131s\u0131n\u0131 kontrol edin.");
      const total = j.expectedSize || ranked.find((r) => r.total)?.total || 0;
      if (j.expectedSize && ranked[0].total && ranked[0].total !== j.expectedSize) {
        const ok = ranked.filter((r) => !r.total || r.total === j.expectedSize);
        if (!ok.length) throw new Error("Sunucudaki dosya boyutu katalogla uyu\u015Fmuyor.");
        ranked.splice(0, ranked.length, ...ok);
      }
      const mirrors = ranked.map((r) => r.url);
      const good = Math.max(1, ranked.filter((r) => r.speed >= ranked[0].speed * 0.5).length);
      const canRange = ranked[0].ranges && total > 0;
      let segs = null;
      try {
        const prev = JSON.parse(await fsp.readFile(j.statePath, "utf8"));
        if (prev.total === total && Array.isArray(prev.segments) && fs.existsSync(j.partPath)) segs = prev.segments;
      } catch {
      }
      if (!segs || !canRange) {
        segs = canRange ? planSegments(total, o.segments ?? SEGMENTS, o.minSegment ?? MIN_SEGMENT) : [{ start: 0, end: -1, pos: 0 }];
        await fsp.rm(j.partPath, { force: true });
      }
      j.total = total;
      j.segments = segs;
      j.received = total ? total - remaining(segs) : 0;
      fh = await fsp.open(j.partPath, fs.existsSync(j.partPath) ? "r+" : "w+");
      j.status = "downloading";
      o.onChange?.();
      const samples = [];
      const tick = setInterval(() => {
        samples.push([Date.now(), j.received]);
        while (samples.length > 6) samples.shift();
        if (samples.length > 1) {
          const [t0, b0] = samples[0];
          const [t1, b1] = samples[samples.length - 1];
          j.speed = t1 > t0 ? (b1 - b0) * 1e3 / (t1 - t0) : 0;
        }
        o.onChange?.();
      }, 1e3);
      const saver = setInterval(() => void saveState(j), SAVE_MS);
      const worker = async (seg, k) => {
        let mi = k % Math.min(good, 3);
        let fails = 0;
        while ((seg.end < 0 || seg.pos <= seg.end) && !ctl.signal.aborted) {
          const url = mirrors[mi % mirrors.length];
          const local = new AbortController();
          const onAbort = () => local.abort();
          ctl.signal.addEventListener("abort", onAbort);
          let stallTimer = setTimeout(() => local.abort(), stallMs);
          const before = seg.pos;
          try {
            const headers = canRange ? { Range: `bytes=${seg.pos}-${seg.end}` } : {};
            const r = await f(url, { headers, signal: local.signal, redirect: "follow" });
            if (canRange && r.status !== 206) throw new Error("aral\u0131k desteklenmiyor (HTTP " + r.status + ")");
            if (!canRange && r.status !== 200) throw new Error("HTTP " + r.status);
            j.mirrorHost ??= new URL(r.url || url).host;
            const reader = r.body.getReader();
            for (; ; ) {
              const { done, value } = await reader.read();
              if (done) break;
              clearTimeout(stallTimer);
              stallTimer = setTimeout(() => local.abort(), stallMs);
              let buf = value;
              if (seg.end >= 0 && seg.pos + buf.length > seg.end + 1) buf = buf.subarray(0, seg.end + 1 - seg.pos);
              await fh.write(buf, 0, buf.length, seg.pos);
              seg.pos += buf.length;
              j.received += buf.length;
              if (seg.end >= 0 && seg.pos > seg.end) {
                reader.cancel().catch(() => {
                });
                break;
              }
            }
            if (seg.end < 0) seg.end = seg.pos - 1;
          } catch (e) {
            if (ctl.signal.aborted) break;
            if (seg.pos === before) {
              fails++;
              mi++;
              if (fails > mirrors.length * 3) throw new Error("Ba\u011Flant\u0131 tekrar tekrar koptu: " + (e?.message ?? e));
              await sleep(Math.min(8e3, 500 * fails));
            }
          } finally {
            clearTimeout(stallTimer);
            ctl.signal.removeEventListener("abort", onAbort);
          }
        }
      };
      try {
        await Promise.all(segs.map((s, k) => worker(s, k)));
      } finally {
        clearInterval(tick);
        clearInterval(saver);
        await saveState(j);
      }
      if (ctl.signal.aborted) throw Object.assign(new Error("durduruldu"), { aborted: true });
      await fh.sync().catch(() => {
      });
      const size = (await fh.stat()).size;
      await fh.close();
      fh = null;
      if (j.total && size !== j.total) throw new Error(`Boyut uyu\u015Fmuyor (${size} / ${j.total}).`);
      j.total = size;
      j.received = size;
      if (j.sha256) {
        j.status = "verifying";
        o.onChange?.();
        const h = crypto.createHash("sha256");
        await new Promise((res, rej) => fs.createReadStream(j.partPath).on("data", (d) => h.update(d)).on("end", res).on("error", rej));
        if (h.digest("hex") !== j.sha256.toLowerCase()) {
          await fsp.rm(j.partPath, { force: true });
          await fsp.rm(j.statePath, { force: true });
          throw new Error("SHA-256 do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z; dosya silindi, yeniden indirin.");
        }
      }
      await fsp.rename(j.partPath, j.finalPath);
      await fsp.rm(j.statePath, { force: true });
      j.status = "done";
      j.speed = 0;
      o.onChange?.();
      setTimeout(() => {
        if (jobs.get(j.file) === j && j.status === "done") jobs.delete(j.file);
        o.onChange?.();
      }, 3e4).unref?.();
    } catch (e) {
      await fh?.close().catch(() => {
      });
      j.speed = 0;
      if (e?.aborted || ctl.signal.aborted) {
        if (j.removeOnAbort) {
          await fsp.rm(j.partPath, { force: true });
          await fsp.rm(j.statePath, { force: true });
          jobs.delete(j.file);
        } else j.status = "paused";
      } else {
        j.status = "error";
        j.error = e?.message ?? String(e);
      }
      o.onChange?.();
    } finally {
      j.ctl = null;
    }
  }
  return {
    /** Katalogdaki paketi indirmeye başlar (ya da sürdürür). */
    async start(fileOrId) {
      const e = await findEntry(fileOrId);
      if (!e) return { ok: false, status: 404, error: "Paket katalogda yok" };
      if (!safeName(e.file)) return { ok: false, status: 400, error: "Ge\xE7ersiz dosya ad\u0131" };
      if (!(e.urls ?? []).some((u) => /^https?:\/\//.test(u))) return { ok: false, status: 400, error: "Bu paket sunucuda indirilemez" };
      const finalPath = path.join(o.dataDir, e.file);
      if (fs.existsSync(finalPath)) return { ok: true, job: { file: e.file, id: e.id, status: "done", received: 0, total: 0, speed: 0 } };
      let j = jobs.get(e.file);
      if (j && (j.status === "downloading" || j.status === "checking" || j.status === "verifying")) return { ok: true, job: pub(j) };
      j ??= {
        file: e.file,
        id: e.id,
        received: 0,
        total: e.sizeApprox ? 0 : e.size || 0,
        speed: 0,
        status: "paused"
      };
      Object.assign(j, {
        urls: expand(e.urls),
        expectedSize: e.sizeApprox ? 0 : e.size || 0,
        sha256: e.sha256 || "",
        partPath: path.join(partDir, e.file + ".part"),
        statePath: path.join(partDir, e.file + ".durum"),
        finalPath,
        removeOnAbort: false,
        mirrorHost: null
      });
      jobs.set(e.file, j);
      void run(j);
      return { ok: true, job: pub(j) };
    },
    pause(file) {
      const j = jobs.get(file);
      if (!j) return false;
      j.ctl?.abort();
      if (!j.ctl) j.status = "paused";
      o.onChange?.();
      return true;
    },
    async cancel(file) {
      const j = jobs.get(file);
      if (j?.ctl) {
        j.removeOnAbort = true;
        j.ctl.abort();
      } else {
        jobs.delete(file);
        if (safeName(file)) {
          await fsp.rm(path.join(partDir, file + ".part"), { force: true });
          await fsp.rm(path.join(partDir, file + ".durum"), { force: true });
        }
      }
      o.onChange?.();
      return true;
    },
    /** Önceki oturumdan kalan yarım indirmeleri "duraklatıldı" olarak listeler. */
    async restore() {
      let names = [];
      try {
        names = await fsp.readdir(partDir);
      } catch {
        return;
      }
      for (const n of names) {
        if (!n.endsWith(".durum")) continue;
        try {
          const st = JSON.parse(await fsp.readFile(path.join(partDir, n), "utf8"));
          if (!safeName(st.file) || jobs.has(st.file)) continue;
          const segs = Array.isArray(st.segments) ? st.segments : [];
          jobs.set(st.file, { file: st.file, id: st.id, status: "paused", total: st.total || 0, received: st.total ? st.total - remaining(segs) : 0, speed: 0 });
        } catch {
        }
      }
    },
    list() {
      return [...jobs.values()].map(pub);
    },
    stopAll() {
      for (const j of jobs.values()) j.ctl?.abort();
    }
  };
}

// tools/hf/_src/hf-yukle.ts
var args = process.argv.slice(2);
var arg = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : void 0;
};
var ROOT2 = path2.resolve(arg("--kok") ?? process.cwd());
var DATA = path2.resolve(arg("--data") ?? path2.join(ROOT2, "data"));
var DRY = args.includes("--deneme");
var ONLY = (arg("--sadece") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
var cfg = JSON.parse(fs2.readFileSync(path2.join(ROOT2, "tools", "hf", "paketler.json"), "utf8"));
var ORG = arg("--org") ?? cfg.org;
var REPO_NAME = arg("--repo") ?? cfg.repo;
var REPO = { type: "dataset", name: `${ORG}/${REPO_NAME}` };
var HF_BASE = `https://huggingface.co/datasets/${ORG}/${REPO_NAME}/resolve/main/`;
var log = (s) => console.log("  " + s);
var gb = (n) => (n / 1024 ** 3).toFixed(2).replace(".", ",") + " GB";
function manifestPaths() {
  return [path2.join(ROOT2, "public", "packs-manifest.json"), path2.join(ROOT2, "dist", "packs-manifest.json")].filter((p) => fs2.existsSync(p));
}
function findLocal(file) {
  const direct = path2.join(DATA, file);
  if (fs2.existsSync(direct)) return direct;
  for (const d of fs2.existsSync(DATA) ? fs2.readdirSync(DATA, { withFileTypes: true }) : []) {
    if (!d.isDirectory() || d.name.startsWith("_")) continue;
    const p = path2.join(DATA, d.name, file);
    if (fs2.existsSync(p)) return p;
  }
  return null;
}
async function sha256File(p) {
  const h = crypto2.createHash("sha256");
  await new Promise((res, rej) => fs2.createReadStream(p).on("data", (d) => h.update(d)).on("end", () => res()).on("error", rej));
  return h.digest("hex");
}
async function fetchFromMirrors(e, manifest) {
  const fetcher = createFetcher({ dataDir: DATA, loadManifest: async () => manifest });
  const r = await fetcher.start(e.id);
  if (!r.ok) {
    log(`  ! indirilemedi: ${r.error}`);
    return null;
  }
  let last = 0;
  for (; ; ) {
    const j = fetcher.list().find((x) => x.file === e.file);
    if (!j || j.status === "done") break;
    if (j.status === "error") {
      log(`  ! indirme hatas\u0131: ${j.error}`);
      return null;
    }
    if (Date.now() - last > 3e3) {
      last = Date.now();
      const pct = j.total ? Math.floor(j.received / j.total * 100) : 0;
      process.stdout.write(`\r    indiriliyor %${pct} \xB7 ${(j.speed / 1e6).toFixed(1)} MB/sn${j.mirror ? " \xB7 " + j.mirror : ""}        `);
    }
    await new Promise((r2) => setTimeout(r2, 500));
  }
  process.stdout.write("\n");
  return findLocal(e.file);
}
async function remoteSize(p, token) {
  try {
    const r = await pathsInfo({ repo: REPO, paths: [p], accessToken: token });
    return r[0]?.size ?? null;
  } catch {
    return null;
  }
}
function card(entries, dirOf) {
  const rows = entries.map((e) => `| \`${dirOf(e)}/${e.file}\` | ${e.name} | ${e.license} | ${e.source.replace(/\|/g, "/")} |`).join("\n");
  return `---
license: other
license_name: karisik-acik-lisanslar
pretty_name: Ak\u0131l \xC7antas\u0131 i\xE7erik paketleri
language:
- tr
- en
tags:
- offline
- disaster-preparedness
- kiwix
- zim
- pmtiles
---

# Ak\u0131l \xC7antas\u0131 i\xE7erik paketleri

[Ak\u0131l \xC7antas\u0131](https://huggingface.co/${ORG}) a\xE7\u0131k kaynakl\u0131, internetsiz \xE7al\u0131\u015Fan bir afet bilgi uygulamas\u0131d\u0131r.
Bu depo, uygulaman\u0131n her cihazdan h\u0131zl\u0131 ve kesintisiz indirebilmesi i\xE7in i\xE7erik paketlerinin kopyalar\u0131n\u0131 bar\u0131nd\u0131r\u0131r.

- **zim/**: Kiwix taraf\u0131ndan yay\u0131mlanan \xE7evrimd\u0131\u015F\u0131 ar\u015Fivlerin de\u011Fi\u015Ftirilmemi\u015F kopyalar\u0131 (https://download.kiwix.org).
- **harita/**: OpenStreetMap verisinden Protomaps \u015Femas\u0131yla \xFCretilmi\u015F PMTiles haritalar\u0131.
- **noktalar/**: OpenStreetMap'ten toplanm\u0131\u015F toplanma alan\u0131, sa\u011Fl\u0131k, eczane, su ve bar\u0131nma noktalar\u0131 (GeoJSON).

Her dosya kendi \xF6zg\xFCn lisans\u0131na tabidir; a\u015Fa\u011F\u0131daki tabloya bak\u0131n. Kullan\u0131rken kayna\u011F\u0131 ve lisans\u0131 belirtin.

| Dosya | \u0130\xE7erik | Lisans | Kaynak |
|---|---|---|---|
${rows}

Harita ve nokta verileri \xA9 OpenStreetMap katk\u0131c\u0131lar\u0131, ODbL 1.0 (https://www.openstreetmap.org/copyright).
`;
}
async function main() {
  console.log("\n  Ak\u0131l \xC7antas\u0131 \u2014 Hugging Face yans\u0131s\u0131");
  console.log("  " + "\u2500".repeat(52));
  const mpaths = manifestPaths();
  if (!mpaths.length) throw new Error("packs-manifest.json bulunamad\u0131 (public/ ya da dist/).");
  const manifest = JSON.parse(await fsp2.readFile(mpaths[0], "utf8"));
  const byId = new Map(manifest.packs.map((p) => [p.id, p]));
  const ids = (ONLY.length ? ONLY : cfg.paketler).filter((id) => {
    if (byId.has(id)) return true;
    log(`! katalogda yok, atland\u0131: ${id}`);
    return false;
  });
  const dirOf = (e) => cfg.dizin[e.kind] ?? e.kind;
  const token = process.env.HF_TOKEN ?? "";
  if (!DRY) {
    if (!token) throw new Error("HF_TOKEN yok. hf-yukle.cmd ile \xE7al\u0131\u015Ft\u0131r\u0131n; token sorulur.");
    const me = await whoAmI({ accessToken: token });
    const orgs = (me.orgs ?? []).map((o) => o.name);
    log(`Hesap: ${me.name}${orgs.length ? " \xB7 organizasyonlar: " + orgs.join(", ") : ""}`);
    if (ORG !== me.name && !orgs.includes(ORG)) throw new Error(`"${ORG}" organizasyonunda \xFCyeli\u011Finiz g\xF6r\xFCnm\xFCyor. Organizasyonu a\xE7t\u0131\u011F\u0131n\u0131z hesab\u0131n token'\u0131n\u0131 kullan\u0131n.`);
    try {
      await createRepo({ repo: REPO, accessToken: token, visibility: "public", license: "other" });
      log(`Depo olu\u015Fturuldu: huggingface.co/datasets/${REPO.name}`);
    } catch (e) {
      if (!/already|exist|409|conflict/i.test(String(e?.message ?? e))) throw e;
      log(`Depo: huggingface.co/datasets/${REPO.name}`);
    }
  }
  const done = [];
  const updates = /* @__PURE__ */ new Map();
  let i = 0;
  for (const id of ids) {
    const e = byId.get(id);
    i++;
    const rpath = `${dirOf(e)}/${e.file}`;
    console.log(`
  [${i}/${ids.length}] ${e.name}`);
    let local = findLocal(e.file);
    if (!local) {
      if (e.kind === "zim" && e.urls.some((u) => /^https?:\/\//.test(u))) {
        if (DRY) {
          log(`  yerelde yok; ger\xE7ek \xE7al\u0131\u015Ft\u0131rmada Kiwix aynas\u0131ndan indirilecek (${gb(e.size)})`);
          continue;
        }
        log("  yerelde yok, en h\u0131zl\u0131 Kiwix aynas\u0131ndan indiriliyor\u2026");
        local = await fetchFromMirrors(e, manifest);
      }
      if (!local) {
        log(`  ! dosya yok, atland\u0131: ${e.file}${e.kind === "map" || e.kind === "poi" ? " (hf-yukle.cmd haritay\u0131 ve noktalar\u0131 \xF6nce \xFCretir)" : ""}`);
        continue;
      }
    }
    const size = (await fsp2.stat(local)).size;
    if (!e.sizeApprox && e.size && size !== e.size) log(`  ! uyar\u0131: yereldeki boyut (${size}) katalogdakinden (${e.size}) farkl\u0131`);
    if (DRY) {
      log(`  y\xFCklenecek: ${rpath} (${gb(size)})`);
      continue;
    }
    const rs = await remoteSize(rpath, token);
    if (rs === size) log(`  zaten y\xFCkl\xFC (${gb(size)}), atland\u0131`);
    else {
      log(`  y\xFCkleniyor: ${rpath} (${gb(size)})`);
      let lastLog = 0;
      const it = uploadFilesWithProgress({
        repo: REPO,
        accessToken: token,
        files: [{ path: rpath, content: pathToFileURL2(local) }],
        commitTitle: `${e.name} (${e.file})`
      });
      for (; ; ) {
        const n = await it.next();
        if (n.done) break;
        const ev = n.value;
        if (ev.event === "fileProgress" && Date.now() - lastLog > 2e3) {
          lastLog = Date.now();
          process.stdout.write(`\r    ${ev.state === "hashing" ? "haz\u0131rlan\u0131yor" : "y\xFCkleniyor"} %${Math.floor(ev.progress * 100)}        `);
        }
      }
      process.stdout.write("\r    tamam                         \n");
    }
    const patch = {};
    if (e.kind === "map" || e.kind === "poi") {
      patch.size = size;
      patch.sizeApprox = false;
      patch.sha256 = await sha256File(local);
    }
    updates.set(e.id, patch);
    done.push(e);
  }
  if (DRY) {
    console.log("\n  Deneme bitti; hi\xE7bir \u015Fey y\xFCklenmedi ve katalog de\u011Fi\u015Fmedi.\n");
    return;
  }
  if (done.length) {
    await uploadFile({
      repo: REPO,
      accessToken: token,
      file: { path: "README.md", content: new Blob([card(done, dirOf)]) },
      commitTitle: "Veri kart\u0131"
    });
    for (const mp of mpaths) {
      const m = JSON.parse(await fsp2.readFile(mp, "utf8"));
      for (const p of m.packs) {
        const u = updates.get(p.id);
        if (!u) continue;
        const hf = HF_BASE + `${dirOf(p)}/${p.file}`;
        p.urls = [hf, ...p.urls.filter((x) => x !== hf && !x.includes("akilcantasi.com"))];
        Object.assign(p, u);
        if (p.kind === "poi") p.desc = p.desc.replace(/İnternet varken OpenStreetMap'ten doğrudan bu cihazda oluşturulur \(birkaç dakika sürer\)\./, "Haz\u0131r paket olarak h\u0131zl\u0131ca iner; gerekirse cihazda OpenStreetMap'ten yeniden olu\u015Fturulur.");
      }
      m.updated = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      await fsp2.writeFile(mp, JSON.stringify(m, null, 2) + "\n");
      log(`Katalog g\xFCncellendi: ${path2.relative(ROOT2, mp)}`);
    }
    await uploadFile({
      repo: REPO,
      accessToken: token,
      file: { path: "packs-manifest.json", content: new Blob([await fsp2.readFile(mpaths[0])], { type: "application/json" }) },
      commitTitle: "Katalog"
    });
    log("Merkezi katalog y\xFCklendi: packs-manifest.json");
  }
  console.log(`
  Bitti: ${done.length}/${ids.length} paket Hugging Face'te.
  https://huggingface.co/datasets/${REPO.name}
`);
}
main().catch((e) => {
  console.error("\n  HATA: " + (e?.message ?? e) + "\n");
  process.exit(1);
});
