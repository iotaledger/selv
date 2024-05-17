'use strict';

var require$$0 = require('crypto');
var crypto$1 = require('node:crypto');
var node_util = require('node:util');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var require$$0__namespace = /*#__PURE__*/_interopNamespaceDefault(require$$0);
var crypto__namespace = /*#__PURE__*/_interopNamespaceDefault(crypto$1);

/*!
 * Copyright (c) 2021 Digital Bazaar. All rights reserved.
 */
/**
 * A verification relationship expresses the relationship between the DID
 * subject and a verification method (such as a cryptographic public key).
 * Different verification relationships enable the associated verification
 * methods to be used for different purposes.
 *
 * @see https://w3c.github.io/did-core/#verification-relationships
 * @type {Set<string>}
 */
const VERIFICATION_RELATIONSHIPS = new Set([
  'assertionMethod',
  'authentication',
  'capabilityDelegation',
  'capabilityInvocation',
  'keyAgreement'
]);

/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Finds a verification method for a given methodId or purpose.
 *
 * If a method id is given, returns the object for that method (for example,
 * returns the public key definition for that id).
 *
 * If a purpose (verification relationship) is given, returns the first
 * available verification method for that purpose.
 *
 * If no method is found (for the given id or purpose), returns undefined.
 *
 * @example
 * findVerificationMethod({doc, methodId: 'did:ex:123#abcd'});
 * // ->
 * {
 *   id: 'did:ex:123#abcd',
 *   controller: 'did:ex:123',
 *   type: 'Ed25519VerificationKey2020',
 *   publicKeyMultibase: '...'
 * }
 * @example
 * didDocument.findVerificationMethod({doc, purpose: 'authentication'});
 * // ->
 * {
 *   id: 'did:ex:123#abcd',
 *   controller: 'did:ex:123',
 *   type: 'Ed25519VerificationKey2020',
 *   publicKeyMultibase: '...'
 * }
 * @param {object} options - Options hashmap.
 * @param {object} options.doc - DID Document.
 *
 * One of the following is required.
 * @param {string} [options.methodId] - Verification method id.
 * @param {string} [options.purpose] - Method purpose (verification
 *   relationship).
 *
 * @returns {object} Returns the verification method, or undefined if not found.
 */
function findVerificationMethod({doc, methodId, purpose} = {}) {
  if(!doc) {
    throw new TypeError('A DID Document is required.');
  }
  if(!(methodId || purpose)) {
    throw new TypeError('A method id or purpose is required.');
  }

  if(methodId) {
    return _methodById({doc, methodId});
  }

  // Id not given, find the first method by purpose
  const [method] = doc[purpose] || [];
  if(method && typeof method === 'string') {
    // This is a reference, not the full method, attempt to find it
    return _methodById({doc, methodId: method});
  }

  return method;
}

/**
 * Finds a verification method for a given id and returns it.
 *
 * @param {object} options - Options hashmap.
 * @param {object} options.doc - DID Document.
 * @param {string} options.methodId - Verification method id.
 *
 * @returns {object} Returns the verification method.
 */
function _methodById({doc, methodId}) {
  let result;

  // First, check the 'verificationMethod' bucket, see if it's listed there
  if(doc.verificationMethod) {
    result = doc.verificationMethod.find(method => method.id === methodId);
  }

  for(const purpose of VERIFICATION_RELATIONSHIPS) {
    const methods = doc[purpose] || [];
    // Iterate through each verification method in 'authentication', etc.
    for(const method of methods) {
      // Only return it if the method is defined, not referenced
      if(typeof method === 'object' && method.id === methodId) {
        result = method;
        break;
      }
    }
    if(result) {
      return result;
    }
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var iterator;
var hasRequiredIterator;

function requireIterator () {
	if (hasRequiredIterator) return iterator;
	hasRequiredIterator = 1;
	iterator = function (Yallist) {
	  Yallist.prototype[Symbol.iterator] = function* () {
	    for (let walker = this.head; walker; walker = walker.next) {
	      yield walker.value;
	    }
	  };
	};
	return iterator;
}

Yallist.Node = Node;
Yallist.create = Yallist;

function Yallist (list) {
  var self = this;
  if (!(self instanceof Yallist)) {
    self = new Yallist();
  }

  self.tail = null;
  self.head = null;
  self.length = 0;

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item);
    });
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i]);
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next;
  var prev = node.prev;

  if (next) {
    next.prev = prev;
  }

  if (prev) {
    prev.next = next;
  }

  if (node === this.head) {
    this.head = next;
  }
  if (node === this.tail) {
    this.tail = prev;
  }

  node.list.length--;
  node.next = null;
  node.prev = null;
  node.list = null;

  return next
};

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var head = this.head;
  node.list = this;
  node.next = head;
  if (head) {
    head.prev = node;
  }

  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
  this.length++;
};

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node);
  }

  var tail = this.tail;
  node.list = this;
  node.prev = tail;
  if (tail) {
    tail.next = node;
  }

  this.tail = node;
  if (!this.head) {
    this.head = node;
  }
  this.length++;
};

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i]);
  }
  return this.length
};

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value;
  this.tail = this.tail.prev;
  if (this.tail) {
    this.tail.next = null;
  } else {
    this.head = null;
  }
  this.length--;
  return res
};

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value;
  this.head = this.head.next;
  if (this.head) {
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  this.length--;
  return res
};

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.next;
  }
};

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this;
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this);
    walker = walker.prev;
  }
};

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev;
  }
  if (i === n && walker !== null) {
    return walker.value
  }
};

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.next;
  }
  return res
};

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this;
  var res = new Yallist();
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this));
    walker = walker.prev;
  }
  return res
};

Yallist.prototype.reduce = function (fn, initial) {
  var acc;
  var walker = this.head;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.head) {
    walker = this.head.next;
    acc = this.head.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i);
    walker = walker.next;
  }

  return acc
};

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc;
  var walker = this.tail;
  if (arguments.length > 1) {
    acc = initial;
  } else if (this.tail) {
    walker = this.tail.prev;
    acc = this.tail.value;
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i);
    walker = walker.prev;
  }

  return acc
};

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.next;
  }
  return arr
};

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length);
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value;
    walker = walker.prev;
  }
  return arr
};

Yallist.prototype.slice = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next;
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length;
  if (to < 0) {
    to += this.length;
  }
  from = from || 0;
  if (from < 0) {
    from += this.length;
  }
  var ret = new Yallist();
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0;
  }
  if (to > this.length) {
    to = this.length;
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev;
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value);
  }
  return ret
};

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1;
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next;
  }

  var ret = [];
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value);
    walker = this.removeNode(walker);
  }
  if (walker === null) {
    walker = this.tail;
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev;
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i]);
  }
  return ret;
};

Yallist.prototype.reverse = function () {
  var head = this.head;
  var tail = this.tail;
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev;
    walker.prev = walker.next;
    walker.next = p;
  }
  this.head = tail;
  this.tail = head;
  return this
};

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self);

  if (inserted.next === null) {
    self.tail = inserted;
  }
  if (inserted.prev === null) {
    self.head = inserted;
  }

  self.length++;

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list;
  this.value = value;

  if (prev) {
    prev.next = this;
    this.prev = prev;
  } else {
    this.prev = null;
  }

  if (next) {
    next.prev = this;
    this.next = next;
  } else {
    this.next = null;
  }
}

try {
  // add if support for Symbol.iterator is present
  requireIterator()(Yallist);
} catch (er) {}

/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * When adding support for a new suite type for `crypto-ld`, developers should
 * do the following:
 *
 * 1. Create their own npm package / github repo, such as `example-key-pair`.
 * 2. Subclass LDKeyPair.
 * 3. Override relevant methods (such as `export()` and `fingerprint()`).
 * 4. Add to the key type table in the `crypto-ld` README.md (that's this repo).
 */
class LDKeyPair {
  /* eslint-disable jsdoc/require-description-complete-sentence */
  /**
   * Creates a public/private key pair instance. This is an abstract base class,
   * actual key material and suite-specific methods are handled in the subclass.
   *
   * To generate or import a key pair, use the `cryptoLd` instance.
   *
   * @see CryptoLD.js
   *
   * @param {object} options - The options to use.
   * @param {string} options.id - The key id, typically composed of controller
   *   URL and key fingerprint as hash fragment.
   * @param {string} options.controller - DID/URL of the person/entity
   *   controlling this key.
   * @param {string} [options.revoked] - Timestamp of when the key has been
   *   revoked, in RFC3339 format. If not present, the key itself is
   *   considered not revoked. (Note that this mechanism is slightly different
   *   than DID Document key revocation, where a DID controller can revoke a
   *   key from that DID by removing it from the DID Document.)
   */
  /* eslint-enable */
  constructor({id, controller, revoked} = {}) {
    this.id = id;
    this.controller = controller;
    this.revoked = revoked;
    // this.type is set in subclass constructor
  }

  /* eslint-disable jsdoc/check-param-names */
  /**
   * Generates a new public/private key pair instance.
   * Note that this method is not typically called directly by client code,
   * but instead is used through a `cryptoLd` instance.
   *
   * @param {object} options - Suite-specific options for the KeyPair. For
   *   common options, see the `LDKeyPair.constructor()` docstring.
   *
   * @returns {Promise<LDKeyPair>} An LDKeyPair instance.
   */
  /* eslint-enable */
  static async generate(/* options */) {
    throw new Error('Abstract method, must be implemented in subclass.');
  }

  /**
   * Imports a key pair instance from a provided externally fetched key
   * document (fetched via a secure JSON-LD `documentLoader` or via
   * `cryptoLd.fromKeyId()`), optionally checking it for revocation and required
   * context.
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.document - Externally fetched key document.
   * @param {boolean} [options.checkContext=true] - Whether to check that the
   *   fetched key document contains the context required by the key's crypto
   *   suite.
   * @param {boolean} [options.checkRevoked=true] - Whether to check the key
   *   object for the presence of the `revoked` timestamp.
   *
   * @returns {Promise<LDKeyPair>} Resolves with the resulting key pair
   *   instance.
   */
  static async fromKeyDocument({
    document, checkContext = true, checkRevoked = true
  } = {}) {
    if(!document) {
      throw new TypeError('The "document" parameter is required.');
    }

    if(checkContext) {
      const fetchedDocContexts = [].concat(document['@context']);
      if(!fetchedDocContexts.includes(this.SUITE_CONTEXT)) {
        throw new Error('Key document does not contain required context "' +
          this.SUITE_CONTEXT + '".');
      }
    }
    if(checkRevoked && document.revoked) {
      throw new Error(`Key has been revoked since: "${document.revoked}".`);
    }
    return this.from(document);
  }

  /* eslint-disable jsdoc/check-param-names */
  /**
   * Generates a KeyPair from some options.
   *
   * @param {object} options  - Will generate a key pair in multiple different
   *   formats.
   * @example
   * > const options = {
   *    type: 'Ed25519VerificationKey2020'
   *   };
   * > const edKeyPair = await LDKeyPair.from(options);
   *
   * @returns {Promise<LDKeyPair>} A LDKeyPair.
   * @throws Unsupported Key Type.
   */
  /* eslint-enable */
  static async from(/* options */) {
    throw new Error('Abstract method from() must be implemented in subclass.');
  }

  /**
   * Exports the serialized representation of the KeyPair
   * and other information that json-ld Signatures can use to form a proof.
   *
   * NOTE: Subclasses MUST override this method (and add the exporting of
   * their public and private key material).
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Export public key material?
   * @param {boolean} [options.privateKey] - Export private key material?
   *
   * @returns {object} A public key object
   *   information used in verification methods by signatures.
   */
  export({publicKey = false, privateKey = false} = {}) {
    if(!publicKey && !privateKey) {
      throw new Error(
        'Export requires specifying either "publicKey" or "privateKey".');
    }
    const key = {
      id: this.id,
      type: this.type,
      controller: this.controller
    };
    if(this.revoked) {
      key.revoked = this.revoked;
    }

    return key;
  }

  /**
   * Returns the public key fingerprint, multibase+multicodec encoded. The
   * specific fingerprint method is determined by the key suite, and is often
   * either a hash of the public key material (such as with RSA), or the
   * full encoded public key (for key types with sufficiently short
   * representations, such as ed25519).
   * This is frequently used in initializing the key id, or generating some
   * types of cryptonym DIDs.
   *
   * @returns {string} The fingerprint.
   */
  fingerprint() {
    throw new Error('Abstract method, must be implemented in subclass.');
  }

  /* eslint-disable jsdoc/check-param-names */
  /**
   * Verifies that a given key fingerprint matches the public key material
   * belonging to this key pair.
   *
   * @param {string} fingerprint - Public key fingerprint.
   *
   * @returns {{verified: boolean}} An object with verified flag.
   */
  /* eslint-enable */
  verifyFingerprint(/* {fingerprint} */) {
    throw new Error('Abstract method, must be implemented in subclass.');
  }

  /* eslint-disable max-len */
  /**
   * Returns a signer object for use with
   * [jsonld-signatures]{@link https://github.com/digitalbazaar/jsonld-signatures}.
   * NOTE: Applies only to verifier type keys (like ed25519).
   *
   * @example
   * > const signer = keyPair.signer();
   * > signer
   * { sign: [AsyncFunction: sign] }
   * > signer.sign({data});
   *
   * @returns {{sign: Function}} A signer for json-ld usage.
   */
  /* eslint-enable */
  signer() {
    return {
      async sign({/* data */}) {
        throw new Error('Abstract method, must be implemented in subclass.');
      }
    };
  }

  /* eslint-disable max-len */
  /**
   * Returns a verifier object for use with
   * [jsonld-signatures]{@link https://github.com/digitalbazaar/jsonld-signatures}.
   * NOTE: Applies only to verifier type keys (like ed25519).
   *
   * @example
   * > const verifier = keyPair.verifier();
   * > verifier
   * { verify: [AsyncFunction: verify] }
   * > verifier.verify(key);
   *
   * @returns {{verify: Function}} Used to verify jsonld-signatures.
   */
  /* eslint-enable */
  verifier() {
    return {
      async verify({/* data, signature */}) {
        throw new Error('Abstract method, must be implemented in subclass.');
      }
    };
  }
}

// Implementers must override this in subclasses
LDKeyPair.SUITE_CONTEXT = 'INVALID LDKeyPair CONTEXT';

var ed2curve$1 = {exports: {}};

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var naclFast = {exports: {}};

var hasRequiredNaclFast;

function requireNaclFast () {
	if (hasRequiredNaclFast) return naclFast.exports;
	hasRequiredNaclFast = 1;
	(function (module) {
		(function(nacl) {

		// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
		// Public domain.
		//
		// Implementation derived from TweetNaCl version 20140427.
		// See for details: http://tweetnacl.cr.yp.to/

		var gf = function(init) {
		  var i, r = new Float64Array(16);
		  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
		  return r;
		};

		//  Pluggable, initialized in high-level API below.
		var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

		var _0 = new Uint8Array(16);
		var _9 = new Uint8Array(32); _9[0] = 9;

		var gf0 = gf(),
		    gf1 = gf([1]),
		    _121665 = gf([0xdb41, 1]),
		    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
		    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
		    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
		    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
		    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

		function ts64(x, i, h, l) {
		  x[i]   = (h >> 24) & 0xff;
		  x[i+1] = (h >> 16) & 0xff;
		  x[i+2] = (h >>  8) & 0xff;
		  x[i+3] = h & 0xff;
		  x[i+4] = (l >> 24)  & 0xff;
		  x[i+5] = (l >> 16)  & 0xff;
		  x[i+6] = (l >>  8)  & 0xff;
		  x[i+7] = l & 0xff;
		}

		function vn(x, xi, y, yi, n) {
		  var i,d = 0;
		  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
		  return (1 & ((d - 1) >>> 8)) - 1;
		}

		function crypto_verify_16(x, xi, y, yi) {
		  return vn(x,xi,y,yi,16);
		}

		function crypto_verify_32(x, xi, y, yi) {
		  return vn(x,xi,y,yi,32);
		}

		function core_salsa20(o, p, k, c) {
		  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
		      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
		      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
		      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
		      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
		      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
		      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
		      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
		      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
		      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
		      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
		      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
		      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
		      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
		      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
		      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

		  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
		      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
		      x15 = j15, u;

		  for (var i = 0; i < 20; i += 2) {
		    u = x0 + x12 | 0;
		    x4 ^= u<<7 | u>>>(32-7);
		    u = x4 + x0 | 0;
		    x8 ^= u<<9 | u>>>(32-9);
		    u = x8 + x4 | 0;
		    x12 ^= u<<13 | u>>>(32-13);
		    u = x12 + x8 | 0;
		    x0 ^= u<<18 | u>>>(32-18);

		    u = x5 + x1 | 0;
		    x9 ^= u<<7 | u>>>(32-7);
		    u = x9 + x5 | 0;
		    x13 ^= u<<9 | u>>>(32-9);
		    u = x13 + x9 | 0;
		    x1 ^= u<<13 | u>>>(32-13);
		    u = x1 + x13 | 0;
		    x5 ^= u<<18 | u>>>(32-18);

		    u = x10 + x6 | 0;
		    x14 ^= u<<7 | u>>>(32-7);
		    u = x14 + x10 | 0;
		    x2 ^= u<<9 | u>>>(32-9);
		    u = x2 + x14 | 0;
		    x6 ^= u<<13 | u>>>(32-13);
		    u = x6 + x2 | 0;
		    x10 ^= u<<18 | u>>>(32-18);

		    u = x15 + x11 | 0;
		    x3 ^= u<<7 | u>>>(32-7);
		    u = x3 + x15 | 0;
		    x7 ^= u<<9 | u>>>(32-9);
		    u = x7 + x3 | 0;
		    x11 ^= u<<13 | u>>>(32-13);
		    u = x11 + x7 | 0;
		    x15 ^= u<<18 | u>>>(32-18);

		    u = x0 + x3 | 0;
		    x1 ^= u<<7 | u>>>(32-7);
		    u = x1 + x0 | 0;
		    x2 ^= u<<9 | u>>>(32-9);
		    u = x2 + x1 | 0;
		    x3 ^= u<<13 | u>>>(32-13);
		    u = x3 + x2 | 0;
		    x0 ^= u<<18 | u>>>(32-18);

		    u = x5 + x4 | 0;
		    x6 ^= u<<7 | u>>>(32-7);
		    u = x6 + x5 | 0;
		    x7 ^= u<<9 | u>>>(32-9);
		    u = x7 + x6 | 0;
		    x4 ^= u<<13 | u>>>(32-13);
		    u = x4 + x7 | 0;
		    x5 ^= u<<18 | u>>>(32-18);

		    u = x10 + x9 | 0;
		    x11 ^= u<<7 | u>>>(32-7);
		    u = x11 + x10 | 0;
		    x8 ^= u<<9 | u>>>(32-9);
		    u = x8 + x11 | 0;
		    x9 ^= u<<13 | u>>>(32-13);
		    u = x9 + x8 | 0;
		    x10 ^= u<<18 | u>>>(32-18);

		    u = x15 + x14 | 0;
		    x12 ^= u<<7 | u>>>(32-7);
		    u = x12 + x15 | 0;
		    x13 ^= u<<9 | u>>>(32-9);
		    u = x13 + x12 | 0;
		    x14 ^= u<<13 | u>>>(32-13);
		    u = x14 + x13 | 0;
		    x15 ^= u<<18 | u>>>(32-18);
		  }
		   x0 =  x0 +  j0 | 0;
		   x1 =  x1 +  j1 | 0;
		   x2 =  x2 +  j2 | 0;
		   x3 =  x3 +  j3 | 0;
		   x4 =  x4 +  j4 | 0;
		   x5 =  x5 +  j5 | 0;
		   x6 =  x6 +  j6 | 0;
		   x7 =  x7 +  j7 | 0;
		   x8 =  x8 +  j8 | 0;
		   x9 =  x9 +  j9 | 0;
		  x10 = x10 + j10 | 0;
		  x11 = x11 + j11 | 0;
		  x12 = x12 + j12 | 0;
		  x13 = x13 + j13 | 0;
		  x14 = x14 + j14 | 0;
		  x15 = x15 + j15 | 0;

		  o[ 0] = x0 >>>  0 & 0xff;
		  o[ 1] = x0 >>>  8 & 0xff;
		  o[ 2] = x0 >>> 16 & 0xff;
		  o[ 3] = x0 >>> 24 & 0xff;

		  o[ 4] = x1 >>>  0 & 0xff;
		  o[ 5] = x1 >>>  8 & 0xff;
		  o[ 6] = x1 >>> 16 & 0xff;
		  o[ 7] = x1 >>> 24 & 0xff;

		  o[ 8] = x2 >>>  0 & 0xff;
		  o[ 9] = x2 >>>  8 & 0xff;
		  o[10] = x2 >>> 16 & 0xff;
		  o[11] = x2 >>> 24 & 0xff;

		  o[12] = x3 >>>  0 & 0xff;
		  o[13] = x3 >>>  8 & 0xff;
		  o[14] = x3 >>> 16 & 0xff;
		  o[15] = x3 >>> 24 & 0xff;

		  o[16] = x4 >>>  0 & 0xff;
		  o[17] = x4 >>>  8 & 0xff;
		  o[18] = x4 >>> 16 & 0xff;
		  o[19] = x4 >>> 24 & 0xff;

		  o[20] = x5 >>>  0 & 0xff;
		  o[21] = x5 >>>  8 & 0xff;
		  o[22] = x5 >>> 16 & 0xff;
		  o[23] = x5 >>> 24 & 0xff;

		  o[24] = x6 >>>  0 & 0xff;
		  o[25] = x6 >>>  8 & 0xff;
		  o[26] = x6 >>> 16 & 0xff;
		  o[27] = x6 >>> 24 & 0xff;

		  o[28] = x7 >>>  0 & 0xff;
		  o[29] = x7 >>>  8 & 0xff;
		  o[30] = x7 >>> 16 & 0xff;
		  o[31] = x7 >>> 24 & 0xff;

		  o[32] = x8 >>>  0 & 0xff;
		  o[33] = x8 >>>  8 & 0xff;
		  o[34] = x8 >>> 16 & 0xff;
		  o[35] = x8 >>> 24 & 0xff;

		  o[36] = x9 >>>  0 & 0xff;
		  o[37] = x9 >>>  8 & 0xff;
		  o[38] = x9 >>> 16 & 0xff;
		  o[39] = x9 >>> 24 & 0xff;

		  o[40] = x10 >>>  0 & 0xff;
		  o[41] = x10 >>>  8 & 0xff;
		  o[42] = x10 >>> 16 & 0xff;
		  o[43] = x10 >>> 24 & 0xff;

		  o[44] = x11 >>>  0 & 0xff;
		  o[45] = x11 >>>  8 & 0xff;
		  o[46] = x11 >>> 16 & 0xff;
		  o[47] = x11 >>> 24 & 0xff;

		  o[48] = x12 >>>  0 & 0xff;
		  o[49] = x12 >>>  8 & 0xff;
		  o[50] = x12 >>> 16 & 0xff;
		  o[51] = x12 >>> 24 & 0xff;

		  o[52] = x13 >>>  0 & 0xff;
		  o[53] = x13 >>>  8 & 0xff;
		  o[54] = x13 >>> 16 & 0xff;
		  o[55] = x13 >>> 24 & 0xff;

		  o[56] = x14 >>>  0 & 0xff;
		  o[57] = x14 >>>  8 & 0xff;
		  o[58] = x14 >>> 16 & 0xff;
		  o[59] = x14 >>> 24 & 0xff;

		  o[60] = x15 >>>  0 & 0xff;
		  o[61] = x15 >>>  8 & 0xff;
		  o[62] = x15 >>> 16 & 0xff;
		  o[63] = x15 >>> 24 & 0xff;
		}

		function core_hsalsa20(o,p,k,c) {
		  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
		      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
		      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
		      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
		      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
		      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
		      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
		      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
		      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
		      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
		      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
		      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
		      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
		      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
		      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
		      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

		  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
		      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
		      x15 = j15, u;

		  for (var i = 0; i < 20; i += 2) {
		    u = x0 + x12 | 0;
		    x4 ^= u<<7 | u>>>(32-7);
		    u = x4 + x0 | 0;
		    x8 ^= u<<9 | u>>>(32-9);
		    u = x8 + x4 | 0;
		    x12 ^= u<<13 | u>>>(32-13);
		    u = x12 + x8 | 0;
		    x0 ^= u<<18 | u>>>(32-18);

		    u = x5 + x1 | 0;
		    x9 ^= u<<7 | u>>>(32-7);
		    u = x9 + x5 | 0;
		    x13 ^= u<<9 | u>>>(32-9);
		    u = x13 + x9 | 0;
		    x1 ^= u<<13 | u>>>(32-13);
		    u = x1 + x13 | 0;
		    x5 ^= u<<18 | u>>>(32-18);

		    u = x10 + x6 | 0;
		    x14 ^= u<<7 | u>>>(32-7);
		    u = x14 + x10 | 0;
		    x2 ^= u<<9 | u>>>(32-9);
		    u = x2 + x14 | 0;
		    x6 ^= u<<13 | u>>>(32-13);
		    u = x6 + x2 | 0;
		    x10 ^= u<<18 | u>>>(32-18);

		    u = x15 + x11 | 0;
		    x3 ^= u<<7 | u>>>(32-7);
		    u = x3 + x15 | 0;
		    x7 ^= u<<9 | u>>>(32-9);
		    u = x7 + x3 | 0;
		    x11 ^= u<<13 | u>>>(32-13);
		    u = x11 + x7 | 0;
		    x15 ^= u<<18 | u>>>(32-18);

		    u = x0 + x3 | 0;
		    x1 ^= u<<7 | u>>>(32-7);
		    u = x1 + x0 | 0;
		    x2 ^= u<<9 | u>>>(32-9);
		    u = x2 + x1 | 0;
		    x3 ^= u<<13 | u>>>(32-13);
		    u = x3 + x2 | 0;
		    x0 ^= u<<18 | u>>>(32-18);

		    u = x5 + x4 | 0;
		    x6 ^= u<<7 | u>>>(32-7);
		    u = x6 + x5 | 0;
		    x7 ^= u<<9 | u>>>(32-9);
		    u = x7 + x6 | 0;
		    x4 ^= u<<13 | u>>>(32-13);
		    u = x4 + x7 | 0;
		    x5 ^= u<<18 | u>>>(32-18);

		    u = x10 + x9 | 0;
		    x11 ^= u<<7 | u>>>(32-7);
		    u = x11 + x10 | 0;
		    x8 ^= u<<9 | u>>>(32-9);
		    u = x8 + x11 | 0;
		    x9 ^= u<<13 | u>>>(32-13);
		    u = x9 + x8 | 0;
		    x10 ^= u<<18 | u>>>(32-18);

		    u = x15 + x14 | 0;
		    x12 ^= u<<7 | u>>>(32-7);
		    u = x12 + x15 | 0;
		    x13 ^= u<<9 | u>>>(32-9);
		    u = x13 + x12 | 0;
		    x14 ^= u<<13 | u>>>(32-13);
		    u = x14 + x13 | 0;
		    x15 ^= u<<18 | u>>>(32-18);
		  }

		  o[ 0] = x0 >>>  0 & 0xff;
		  o[ 1] = x0 >>>  8 & 0xff;
		  o[ 2] = x0 >>> 16 & 0xff;
		  o[ 3] = x0 >>> 24 & 0xff;

		  o[ 4] = x5 >>>  0 & 0xff;
		  o[ 5] = x5 >>>  8 & 0xff;
		  o[ 6] = x5 >>> 16 & 0xff;
		  o[ 7] = x5 >>> 24 & 0xff;

		  o[ 8] = x10 >>>  0 & 0xff;
		  o[ 9] = x10 >>>  8 & 0xff;
		  o[10] = x10 >>> 16 & 0xff;
		  o[11] = x10 >>> 24 & 0xff;

		  o[12] = x15 >>>  0 & 0xff;
		  o[13] = x15 >>>  8 & 0xff;
		  o[14] = x15 >>> 16 & 0xff;
		  o[15] = x15 >>> 24 & 0xff;

		  o[16] = x6 >>>  0 & 0xff;
		  o[17] = x6 >>>  8 & 0xff;
		  o[18] = x6 >>> 16 & 0xff;
		  o[19] = x6 >>> 24 & 0xff;

		  o[20] = x7 >>>  0 & 0xff;
		  o[21] = x7 >>>  8 & 0xff;
		  o[22] = x7 >>> 16 & 0xff;
		  o[23] = x7 >>> 24 & 0xff;

		  o[24] = x8 >>>  0 & 0xff;
		  o[25] = x8 >>>  8 & 0xff;
		  o[26] = x8 >>> 16 & 0xff;
		  o[27] = x8 >>> 24 & 0xff;

		  o[28] = x9 >>>  0 & 0xff;
		  o[29] = x9 >>>  8 & 0xff;
		  o[30] = x9 >>> 16 & 0xff;
		  o[31] = x9 >>> 24 & 0xff;
		}

		function crypto_core_salsa20(out,inp,k,c) {
		  core_salsa20(out,inp,k,c);
		}

		function crypto_core_hsalsa20(out,inp,k,c) {
		  core_hsalsa20(out,inp,k,c);
		}

		var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
		            // "expand 32-byte k"

		function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
		  var z = new Uint8Array(16), x = new Uint8Array(64);
		  var u, i;
		  for (i = 0; i < 16; i++) z[i] = 0;
		  for (i = 0; i < 8; i++) z[i] = n[i];
		  while (b >= 64) {
		    crypto_core_salsa20(x,z,k,sigma);
		    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
		    u = 1;
		    for (i = 8; i < 16; i++) {
		      u = u + (z[i] & 0xff) | 0;
		      z[i] = u & 0xff;
		      u >>>= 8;
		    }
		    b -= 64;
		    cpos += 64;
		    mpos += 64;
		  }
		  if (b > 0) {
		    crypto_core_salsa20(x,z,k,sigma);
		    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
		  }
		  return 0;
		}

		function crypto_stream_salsa20(c,cpos,b,n,k) {
		  var z = new Uint8Array(16), x = new Uint8Array(64);
		  var u, i;
		  for (i = 0; i < 16; i++) z[i] = 0;
		  for (i = 0; i < 8; i++) z[i] = n[i];
		  while (b >= 64) {
		    crypto_core_salsa20(x,z,k,sigma);
		    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
		    u = 1;
		    for (i = 8; i < 16; i++) {
		      u = u + (z[i] & 0xff) | 0;
		      z[i] = u & 0xff;
		      u >>>= 8;
		    }
		    b -= 64;
		    cpos += 64;
		  }
		  if (b > 0) {
		    crypto_core_salsa20(x,z,k,sigma);
		    for (i = 0; i < b; i++) c[cpos+i] = x[i];
		  }
		  return 0;
		}

		function crypto_stream(c,cpos,d,n,k) {
		  var s = new Uint8Array(32);
		  crypto_core_hsalsa20(s,n,k,sigma);
		  var sn = new Uint8Array(8);
		  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
		  return crypto_stream_salsa20(c,cpos,d,sn,s);
		}

		function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
		  var s = new Uint8Array(32);
		  crypto_core_hsalsa20(s,n,k,sigma);
		  var sn = new Uint8Array(8);
		  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
		  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
		}

		/*
		* Port of Andrew Moon's Poly1305-donna-16. Public domain.
		* https://github.com/floodyberry/poly1305-donna
		*/

		var poly1305 = function(key) {
		  this.buffer = new Uint8Array(16);
		  this.r = new Uint16Array(10);
		  this.h = new Uint16Array(10);
		  this.pad = new Uint16Array(8);
		  this.leftover = 0;
		  this.fin = 0;

		  var t0, t1, t2, t3, t4, t5, t6, t7;

		  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
		  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
		  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
		  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
		  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
		  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
		  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
		  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
		  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
		  this.r[9] = ((t7 >>>  5)) & 0x007f;

		  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
		  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
		  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
		  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
		  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
		  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
		  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
		  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
		};

		poly1305.prototype.blocks = function(m, mpos, bytes) {
		  var hibit = this.fin ? 0 : (1 << 11);
		  var t0, t1, t2, t3, t4, t5, t6, t7, c;
		  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

		  var h0 = this.h[0],
		      h1 = this.h[1],
		      h2 = this.h[2],
		      h3 = this.h[3],
		      h4 = this.h[4],
		      h5 = this.h[5],
		      h6 = this.h[6],
		      h7 = this.h[7],
		      h8 = this.h[8],
		      h9 = this.h[9];

		  var r0 = this.r[0],
		      r1 = this.r[1],
		      r2 = this.r[2],
		      r3 = this.r[3],
		      r4 = this.r[4],
		      r5 = this.r[5],
		      r6 = this.r[6],
		      r7 = this.r[7],
		      r8 = this.r[8],
		      r9 = this.r[9];

		  while (bytes >= 16) {
		    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
		    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
		    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
		    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
		    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
		    h5 += ((t4 >>>  1)) & 0x1fff;
		    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
		    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
		    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
		    h9 += ((t7 >>> 5)) | hibit;

		    c = 0;

		    d0 = c;
		    d0 += h0 * r0;
		    d0 += h1 * (5 * r9);
		    d0 += h2 * (5 * r8);
		    d0 += h3 * (5 * r7);
		    d0 += h4 * (5 * r6);
		    c = (d0 >>> 13); d0 &= 0x1fff;
		    d0 += h5 * (5 * r5);
		    d0 += h6 * (5 * r4);
		    d0 += h7 * (5 * r3);
		    d0 += h8 * (5 * r2);
		    d0 += h9 * (5 * r1);
		    c += (d0 >>> 13); d0 &= 0x1fff;

		    d1 = c;
		    d1 += h0 * r1;
		    d1 += h1 * r0;
		    d1 += h2 * (5 * r9);
		    d1 += h3 * (5 * r8);
		    d1 += h4 * (5 * r7);
		    c = (d1 >>> 13); d1 &= 0x1fff;
		    d1 += h5 * (5 * r6);
		    d1 += h6 * (5 * r5);
		    d1 += h7 * (5 * r4);
		    d1 += h8 * (5 * r3);
		    d1 += h9 * (5 * r2);
		    c += (d1 >>> 13); d1 &= 0x1fff;

		    d2 = c;
		    d2 += h0 * r2;
		    d2 += h1 * r1;
		    d2 += h2 * r0;
		    d2 += h3 * (5 * r9);
		    d2 += h4 * (5 * r8);
		    c = (d2 >>> 13); d2 &= 0x1fff;
		    d2 += h5 * (5 * r7);
		    d2 += h6 * (5 * r6);
		    d2 += h7 * (5 * r5);
		    d2 += h8 * (5 * r4);
		    d2 += h9 * (5 * r3);
		    c += (d2 >>> 13); d2 &= 0x1fff;

		    d3 = c;
		    d3 += h0 * r3;
		    d3 += h1 * r2;
		    d3 += h2 * r1;
		    d3 += h3 * r0;
		    d3 += h4 * (5 * r9);
		    c = (d3 >>> 13); d3 &= 0x1fff;
		    d3 += h5 * (5 * r8);
		    d3 += h6 * (5 * r7);
		    d3 += h7 * (5 * r6);
		    d3 += h8 * (5 * r5);
		    d3 += h9 * (5 * r4);
		    c += (d3 >>> 13); d3 &= 0x1fff;

		    d4 = c;
		    d4 += h0 * r4;
		    d4 += h1 * r3;
		    d4 += h2 * r2;
		    d4 += h3 * r1;
		    d4 += h4 * r0;
		    c = (d4 >>> 13); d4 &= 0x1fff;
		    d4 += h5 * (5 * r9);
		    d4 += h6 * (5 * r8);
		    d4 += h7 * (5 * r7);
		    d4 += h8 * (5 * r6);
		    d4 += h9 * (5 * r5);
		    c += (d4 >>> 13); d4 &= 0x1fff;

		    d5 = c;
		    d5 += h0 * r5;
		    d5 += h1 * r4;
		    d5 += h2 * r3;
		    d5 += h3 * r2;
		    d5 += h4 * r1;
		    c = (d5 >>> 13); d5 &= 0x1fff;
		    d5 += h5 * r0;
		    d5 += h6 * (5 * r9);
		    d5 += h7 * (5 * r8);
		    d5 += h8 * (5 * r7);
		    d5 += h9 * (5 * r6);
		    c += (d5 >>> 13); d5 &= 0x1fff;

		    d6 = c;
		    d6 += h0 * r6;
		    d6 += h1 * r5;
		    d6 += h2 * r4;
		    d6 += h3 * r3;
		    d6 += h4 * r2;
		    c = (d6 >>> 13); d6 &= 0x1fff;
		    d6 += h5 * r1;
		    d6 += h6 * r0;
		    d6 += h7 * (5 * r9);
		    d6 += h8 * (5 * r8);
		    d6 += h9 * (5 * r7);
		    c += (d6 >>> 13); d6 &= 0x1fff;

		    d7 = c;
		    d7 += h0 * r7;
		    d7 += h1 * r6;
		    d7 += h2 * r5;
		    d7 += h3 * r4;
		    d7 += h4 * r3;
		    c = (d7 >>> 13); d7 &= 0x1fff;
		    d7 += h5 * r2;
		    d7 += h6 * r1;
		    d7 += h7 * r0;
		    d7 += h8 * (5 * r9);
		    d7 += h9 * (5 * r8);
		    c += (d7 >>> 13); d7 &= 0x1fff;

		    d8 = c;
		    d8 += h0 * r8;
		    d8 += h1 * r7;
		    d8 += h2 * r6;
		    d8 += h3 * r5;
		    d8 += h4 * r4;
		    c = (d8 >>> 13); d8 &= 0x1fff;
		    d8 += h5 * r3;
		    d8 += h6 * r2;
		    d8 += h7 * r1;
		    d8 += h8 * r0;
		    d8 += h9 * (5 * r9);
		    c += (d8 >>> 13); d8 &= 0x1fff;

		    d9 = c;
		    d9 += h0 * r9;
		    d9 += h1 * r8;
		    d9 += h2 * r7;
		    d9 += h3 * r6;
		    d9 += h4 * r5;
		    c = (d9 >>> 13); d9 &= 0x1fff;
		    d9 += h5 * r4;
		    d9 += h6 * r3;
		    d9 += h7 * r2;
		    d9 += h8 * r1;
		    d9 += h9 * r0;
		    c += (d9 >>> 13); d9 &= 0x1fff;

		    c = (((c << 2) + c)) | 0;
		    c = (c + d0) | 0;
		    d0 = c & 0x1fff;
		    c = (c >>> 13);
		    d1 += c;

		    h0 = d0;
		    h1 = d1;
		    h2 = d2;
		    h3 = d3;
		    h4 = d4;
		    h5 = d5;
		    h6 = d6;
		    h7 = d7;
		    h8 = d8;
		    h9 = d9;

		    mpos += 16;
		    bytes -= 16;
		  }
		  this.h[0] = h0;
		  this.h[1] = h1;
		  this.h[2] = h2;
		  this.h[3] = h3;
		  this.h[4] = h4;
		  this.h[5] = h5;
		  this.h[6] = h6;
		  this.h[7] = h7;
		  this.h[8] = h8;
		  this.h[9] = h9;
		};

		poly1305.prototype.finish = function(mac, macpos) {
		  var g = new Uint16Array(10);
		  var c, mask, f, i;

		  if (this.leftover) {
		    i = this.leftover;
		    this.buffer[i++] = 1;
		    for (; i < 16; i++) this.buffer[i] = 0;
		    this.fin = 1;
		    this.blocks(this.buffer, 0, 16);
		  }

		  c = this.h[1] >>> 13;
		  this.h[1] &= 0x1fff;
		  for (i = 2; i < 10; i++) {
		    this.h[i] += c;
		    c = this.h[i] >>> 13;
		    this.h[i] &= 0x1fff;
		  }
		  this.h[0] += (c * 5);
		  c = this.h[0] >>> 13;
		  this.h[0] &= 0x1fff;
		  this.h[1] += c;
		  c = this.h[1] >>> 13;
		  this.h[1] &= 0x1fff;
		  this.h[2] += c;

		  g[0] = this.h[0] + 5;
		  c = g[0] >>> 13;
		  g[0] &= 0x1fff;
		  for (i = 1; i < 10; i++) {
		    g[i] = this.h[i] + c;
		    c = g[i] >>> 13;
		    g[i] &= 0x1fff;
		  }
		  g[9] -= (1 << 13);

		  mask = (c ^ 1) - 1;
		  for (i = 0; i < 10; i++) g[i] &= mask;
		  mask = ~mask;
		  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

		  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
		  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
		  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
		  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
		  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
		  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
		  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
		  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

		  f = this.h[0] + this.pad[0];
		  this.h[0] = f & 0xffff;
		  for (i = 1; i < 8; i++) {
		    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
		    this.h[i] = f & 0xffff;
		  }

		  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
		  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
		  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
		  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
		  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
		  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
		  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
		  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
		  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
		  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
		  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
		  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
		  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
		  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
		  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
		  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
		};

		poly1305.prototype.update = function(m, mpos, bytes) {
		  var i, want;

		  if (this.leftover) {
		    want = (16 - this.leftover);
		    if (want > bytes)
		      want = bytes;
		    for (i = 0; i < want; i++)
		      this.buffer[this.leftover + i] = m[mpos+i];
		    bytes -= want;
		    mpos += want;
		    this.leftover += want;
		    if (this.leftover < 16)
		      return;
		    this.blocks(this.buffer, 0, 16);
		    this.leftover = 0;
		  }

		  if (bytes >= 16) {
		    want = bytes - (bytes % 16);
		    this.blocks(m, mpos, want);
		    mpos += want;
		    bytes -= want;
		  }

		  if (bytes) {
		    for (i = 0; i < bytes; i++)
		      this.buffer[this.leftover + i] = m[mpos+i];
		    this.leftover += bytes;
		  }
		};

		function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
		  var s = new poly1305(k);
		  s.update(m, mpos, n);
		  s.finish(out, outpos);
		  return 0;
		}

		function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
		  var x = new Uint8Array(16);
		  crypto_onetimeauth(x,0,m,mpos,n,k);
		  return crypto_verify_16(h,hpos,x,0);
		}

		function crypto_secretbox(c,m,d,n,k) {
		  var i;
		  if (d < 32) return -1;
		  crypto_stream_xor(c,0,m,0,d,n,k);
		  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
		  for (i = 0; i < 16; i++) c[i] = 0;
		  return 0;
		}

		function crypto_secretbox_open(m,c,d,n,k) {
		  var i;
		  var x = new Uint8Array(32);
		  if (d < 32) return -1;
		  crypto_stream(x,0,32,n,k);
		  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
		  crypto_stream_xor(m,0,c,0,d,n,k);
		  for (i = 0; i < 32; i++) m[i] = 0;
		  return 0;
		}

		function set25519(r, a) {
		  var i;
		  for (i = 0; i < 16; i++) r[i] = a[i]|0;
		}

		function car25519(o) {
		  var i, v, c = 1;
		  for (i = 0; i < 16; i++) {
		    v = o[i] + c + 65535;
		    c = Math.floor(v / 65536);
		    o[i] = v - c * 65536;
		  }
		  o[0] += c-1 + 37 * (c-1);
		}

		function sel25519(p, q, b) {
		  var t, c = ~(b-1);
		  for (var i = 0; i < 16; i++) {
		    t = c & (p[i] ^ q[i]);
		    p[i] ^= t;
		    q[i] ^= t;
		  }
		}

		function pack25519(o, n) {
		  var i, j, b;
		  var m = gf(), t = gf();
		  for (i = 0; i < 16; i++) t[i] = n[i];
		  car25519(t);
		  car25519(t);
		  car25519(t);
		  for (j = 0; j < 2; j++) {
		    m[0] = t[0] - 0xffed;
		    for (i = 1; i < 15; i++) {
		      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
		      m[i-1] &= 0xffff;
		    }
		    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
		    b = (m[15]>>16) & 1;
		    m[14] &= 0xffff;
		    sel25519(t, m, 1-b);
		  }
		  for (i = 0; i < 16; i++) {
		    o[2*i] = t[i] & 0xff;
		    o[2*i+1] = t[i]>>8;
		  }
		}

		function neq25519(a, b) {
		  var c = new Uint8Array(32), d = new Uint8Array(32);
		  pack25519(c, a);
		  pack25519(d, b);
		  return crypto_verify_32(c, 0, d, 0);
		}

		function par25519(a) {
		  var d = new Uint8Array(32);
		  pack25519(d, a);
		  return d[0] & 1;
		}

		function unpack25519(o, n) {
		  var i;
		  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
		  o[15] &= 0x7fff;
		}

		function A(o, a, b) {
		  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
		}

		function Z(o, a, b) {
		  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
		}

		function M(o, a, b) {
		  var v, c,
		     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
		     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
		    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
		    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
		    b0 = b[0],
		    b1 = b[1],
		    b2 = b[2],
		    b3 = b[3],
		    b4 = b[4],
		    b5 = b[5],
		    b6 = b[6],
		    b7 = b[7],
		    b8 = b[8],
		    b9 = b[9],
		    b10 = b[10],
		    b11 = b[11],
		    b12 = b[12],
		    b13 = b[13],
		    b14 = b[14],
		    b15 = b[15];

		  v = a[0];
		  t0 += v * b0;
		  t1 += v * b1;
		  t2 += v * b2;
		  t3 += v * b3;
		  t4 += v * b4;
		  t5 += v * b5;
		  t6 += v * b6;
		  t7 += v * b7;
		  t8 += v * b8;
		  t9 += v * b9;
		  t10 += v * b10;
		  t11 += v * b11;
		  t12 += v * b12;
		  t13 += v * b13;
		  t14 += v * b14;
		  t15 += v * b15;
		  v = a[1];
		  t1 += v * b0;
		  t2 += v * b1;
		  t3 += v * b2;
		  t4 += v * b3;
		  t5 += v * b4;
		  t6 += v * b5;
		  t7 += v * b6;
		  t8 += v * b7;
		  t9 += v * b8;
		  t10 += v * b9;
		  t11 += v * b10;
		  t12 += v * b11;
		  t13 += v * b12;
		  t14 += v * b13;
		  t15 += v * b14;
		  t16 += v * b15;
		  v = a[2];
		  t2 += v * b0;
		  t3 += v * b1;
		  t4 += v * b2;
		  t5 += v * b3;
		  t6 += v * b4;
		  t7 += v * b5;
		  t8 += v * b6;
		  t9 += v * b7;
		  t10 += v * b8;
		  t11 += v * b9;
		  t12 += v * b10;
		  t13 += v * b11;
		  t14 += v * b12;
		  t15 += v * b13;
		  t16 += v * b14;
		  t17 += v * b15;
		  v = a[3];
		  t3 += v * b0;
		  t4 += v * b1;
		  t5 += v * b2;
		  t6 += v * b3;
		  t7 += v * b4;
		  t8 += v * b5;
		  t9 += v * b6;
		  t10 += v * b7;
		  t11 += v * b8;
		  t12 += v * b9;
		  t13 += v * b10;
		  t14 += v * b11;
		  t15 += v * b12;
		  t16 += v * b13;
		  t17 += v * b14;
		  t18 += v * b15;
		  v = a[4];
		  t4 += v * b0;
		  t5 += v * b1;
		  t6 += v * b2;
		  t7 += v * b3;
		  t8 += v * b4;
		  t9 += v * b5;
		  t10 += v * b6;
		  t11 += v * b7;
		  t12 += v * b8;
		  t13 += v * b9;
		  t14 += v * b10;
		  t15 += v * b11;
		  t16 += v * b12;
		  t17 += v * b13;
		  t18 += v * b14;
		  t19 += v * b15;
		  v = a[5];
		  t5 += v * b0;
		  t6 += v * b1;
		  t7 += v * b2;
		  t8 += v * b3;
		  t9 += v * b4;
		  t10 += v * b5;
		  t11 += v * b6;
		  t12 += v * b7;
		  t13 += v * b8;
		  t14 += v * b9;
		  t15 += v * b10;
		  t16 += v * b11;
		  t17 += v * b12;
		  t18 += v * b13;
		  t19 += v * b14;
		  t20 += v * b15;
		  v = a[6];
		  t6 += v * b0;
		  t7 += v * b1;
		  t8 += v * b2;
		  t9 += v * b3;
		  t10 += v * b4;
		  t11 += v * b5;
		  t12 += v * b6;
		  t13 += v * b7;
		  t14 += v * b8;
		  t15 += v * b9;
		  t16 += v * b10;
		  t17 += v * b11;
		  t18 += v * b12;
		  t19 += v * b13;
		  t20 += v * b14;
		  t21 += v * b15;
		  v = a[7];
		  t7 += v * b0;
		  t8 += v * b1;
		  t9 += v * b2;
		  t10 += v * b3;
		  t11 += v * b4;
		  t12 += v * b5;
		  t13 += v * b6;
		  t14 += v * b7;
		  t15 += v * b8;
		  t16 += v * b9;
		  t17 += v * b10;
		  t18 += v * b11;
		  t19 += v * b12;
		  t20 += v * b13;
		  t21 += v * b14;
		  t22 += v * b15;
		  v = a[8];
		  t8 += v * b0;
		  t9 += v * b1;
		  t10 += v * b2;
		  t11 += v * b3;
		  t12 += v * b4;
		  t13 += v * b5;
		  t14 += v * b6;
		  t15 += v * b7;
		  t16 += v * b8;
		  t17 += v * b9;
		  t18 += v * b10;
		  t19 += v * b11;
		  t20 += v * b12;
		  t21 += v * b13;
		  t22 += v * b14;
		  t23 += v * b15;
		  v = a[9];
		  t9 += v * b0;
		  t10 += v * b1;
		  t11 += v * b2;
		  t12 += v * b3;
		  t13 += v * b4;
		  t14 += v * b5;
		  t15 += v * b6;
		  t16 += v * b7;
		  t17 += v * b8;
		  t18 += v * b9;
		  t19 += v * b10;
		  t20 += v * b11;
		  t21 += v * b12;
		  t22 += v * b13;
		  t23 += v * b14;
		  t24 += v * b15;
		  v = a[10];
		  t10 += v * b0;
		  t11 += v * b1;
		  t12 += v * b2;
		  t13 += v * b3;
		  t14 += v * b4;
		  t15 += v * b5;
		  t16 += v * b6;
		  t17 += v * b7;
		  t18 += v * b8;
		  t19 += v * b9;
		  t20 += v * b10;
		  t21 += v * b11;
		  t22 += v * b12;
		  t23 += v * b13;
		  t24 += v * b14;
		  t25 += v * b15;
		  v = a[11];
		  t11 += v * b0;
		  t12 += v * b1;
		  t13 += v * b2;
		  t14 += v * b3;
		  t15 += v * b4;
		  t16 += v * b5;
		  t17 += v * b6;
		  t18 += v * b7;
		  t19 += v * b8;
		  t20 += v * b9;
		  t21 += v * b10;
		  t22 += v * b11;
		  t23 += v * b12;
		  t24 += v * b13;
		  t25 += v * b14;
		  t26 += v * b15;
		  v = a[12];
		  t12 += v * b0;
		  t13 += v * b1;
		  t14 += v * b2;
		  t15 += v * b3;
		  t16 += v * b4;
		  t17 += v * b5;
		  t18 += v * b6;
		  t19 += v * b7;
		  t20 += v * b8;
		  t21 += v * b9;
		  t22 += v * b10;
		  t23 += v * b11;
		  t24 += v * b12;
		  t25 += v * b13;
		  t26 += v * b14;
		  t27 += v * b15;
		  v = a[13];
		  t13 += v * b0;
		  t14 += v * b1;
		  t15 += v * b2;
		  t16 += v * b3;
		  t17 += v * b4;
		  t18 += v * b5;
		  t19 += v * b6;
		  t20 += v * b7;
		  t21 += v * b8;
		  t22 += v * b9;
		  t23 += v * b10;
		  t24 += v * b11;
		  t25 += v * b12;
		  t26 += v * b13;
		  t27 += v * b14;
		  t28 += v * b15;
		  v = a[14];
		  t14 += v * b0;
		  t15 += v * b1;
		  t16 += v * b2;
		  t17 += v * b3;
		  t18 += v * b4;
		  t19 += v * b5;
		  t20 += v * b6;
		  t21 += v * b7;
		  t22 += v * b8;
		  t23 += v * b9;
		  t24 += v * b10;
		  t25 += v * b11;
		  t26 += v * b12;
		  t27 += v * b13;
		  t28 += v * b14;
		  t29 += v * b15;
		  v = a[15];
		  t15 += v * b0;
		  t16 += v * b1;
		  t17 += v * b2;
		  t18 += v * b3;
		  t19 += v * b4;
		  t20 += v * b5;
		  t21 += v * b6;
		  t22 += v * b7;
		  t23 += v * b8;
		  t24 += v * b9;
		  t25 += v * b10;
		  t26 += v * b11;
		  t27 += v * b12;
		  t28 += v * b13;
		  t29 += v * b14;
		  t30 += v * b15;

		  t0  += 38 * t16;
		  t1  += 38 * t17;
		  t2  += 38 * t18;
		  t3  += 38 * t19;
		  t4  += 38 * t20;
		  t5  += 38 * t21;
		  t6  += 38 * t22;
		  t7  += 38 * t23;
		  t8  += 38 * t24;
		  t9  += 38 * t25;
		  t10 += 38 * t26;
		  t11 += 38 * t27;
		  t12 += 38 * t28;
		  t13 += 38 * t29;
		  t14 += 38 * t30;
		  // t15 left as is

		  // first car
		  c = 1;
		  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
		  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
		  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
		  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
		  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
		  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
		  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
		  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
		  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
		  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
		  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
		  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
		  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
		  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
		  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
		  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
		  t0 += c-1 + 37 * (c-1);

		  // second car
		  c = 1;
		  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
		  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
		  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
		  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
		  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
		  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
		  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
		  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
		  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
		  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
		  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
		  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
		  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
		  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
		  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
		  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
		  t0 += c-1 + 37 * (c-1);

		  o[ 0] = t0;
		  o[ 1] = t1;
		  o[ 2] = t2;
		  o[ 3] = t3;
		  o[ 4] = t4;
		  o[ 5] = t5;
		  o[ 6] = t6;
		  o[ 7] = t7;
		  o[ 8] = t8;
		  o[ 9] = t9;
		  o[10] = t10;
		  o[11] = t11;
		  o[12] = t12;
		  o[13] = t13;
		  o[14] = t14;
		  o[15] = t15;
		}

		function S(o, a) {
		  M(o, a, a);
		}

		function inv25519(o, i) {
		  var c = gf();
		  var a;
		  for (a = 0; a < 16; a++) c[a] = i[a];
		  for (a = 253; a >= 0; a--) {
		    S(c, c);
		    if(a !== 2 && a !== 4) M(c, c, i);
		  }
		  for (a = 0; a < 16; a++) o[a] = c[a];
		}

		function pow2523(o, i) {
		  var c = gf();
		  var a;
		  for (a = 0; a < 16; a++) c[a] = i[a];
		  for (a = 250; a >= 0; a--) {
		      S(c, c);
		      if(a !== 1) M(c, c, i);
		  }
		  for (a = 0; a < 16; a++) o[a] = c[a];
		}

		function crypto_scalarmult(q, n, p) {
		  var z = new Uint8Array(32);
		  var x = new Float64Array(80), r, i;
		  var a = gf(), b = gf(), c = gf(),
		      d = gf(), e = gf(), f = gf();
		  for (i = 0; i < 31; i++) z[i] = n[i];
		  z[31]=(n[31]&127)|64;
		  z[0]&=248;
		  unpack25519(x,p);
		  for (i = 0; i < 16; i++) {
		    b[i]=x[i];
		    d[i]=a[i]=c[i]=0;
		  }
		  a[0]=d[0]=1;
		  for (i=254; i>=0; --i) {
		    r=(z[i>>>3]>>>(i&7))&1;
		    sel25519(a,b,r);
		    sel25519(c,d,r);
		    A(e,a,c);
		    Z(a,a,c);
		    A(c,b,d);
		    Z(b,b,d);
		    S(d,e);
		    S(f,a);
		    M(a,c,a);
		    M(c,b,e);
		    A(e,a,c);
		    Z(a,a,c);
		    S(b,a);
		    Z(c,d,f);
		    M(a,c,_121665);
		    A(a,a,d);
		    M(c,c,a);
		    M(a,d,f);
		    M(d,b,x);
		    S(b,e);
		    sel25519(a,b,r);
		    sel25519(c,d,r);
		  }
		  for (i = 0; i < 16; i++) {
		    x[i+16]=a[i];
		    x[i+32]=c[i];
		    x[i+48]=b[i];
		    x[i+64]=d[i];
		  }
		  var x32 = x.subarray(32);
		  var x16 = x.subarray(16);
		  inv25519(x32,x32);
		  M(x16,x16,x32);
		  pack25519(q,x16);
		  return 0;
		}

		function crypto_scalarmult_base(q, n) {
		  return crypto_scalarmult(q, n, _9);
		}

		function crypto_box_keypair(y, x) {
		  randombytes(x, 32);
		  return crypto_scalarmult_base(y, x);
		}

		function crypto_box_beforenm(k, y, x) {
		  var s = new Uint8Array(32);
		  crypto_scalarmult(s, x, y);
		  return crypto_core_hsalsa20(k, _0, s, sigma);
		}

		var crypto_box_afternm = crypto_secretbox;
		var crypto_box_open_afternm = crypto_secretbox_open;

		function crypto_box(c, m, d, n, y, x) {
		  var k = new Uint8Array(32);
		  crypto_box_beforenm(k, y, x);
		  return crypto_box_afternm(c, m, d, n, k);
		}

		function crypto_box_open(m, c, d, n, y, x) {
		  var k = new Uint8Array(32);
		  crypto_box_beforenm(k, y, x);
		  return crypto_box_open_afternm(m, c, d, n, k);
		}

		var K = [
		  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
		  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
		  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
		  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
		  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
		  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
		  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
		  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
		  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
		  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
		  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
		  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
		  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
		  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
		  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
		  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
		  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
		  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
		  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
		  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
		  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
		  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
		  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
		  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
		  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
		  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
		  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
		  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
		  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
		  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
		  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
		  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
		  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
		  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
		  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
		  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
		  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
		  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
		  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
		  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
		];

		function crypto_hashblocks_hl(hh, hl, m, n) {
		  var wh = new Int32Array(16), wl = new Int32Array(16),
		      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
		      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
		      th, tl, i, j, h, l, a, b, c, d;

		  var ah0 = hh[0],
		      ah1 = hh[1],
		      ah2 = hh[2],
		      ah3 = hh[3],
		      ah4 = hh[4],
		      ah5 = hh[5],
		      ah6 = hh[6],
		      ah7 = hh[7],

		      al0 = hl[0],
		      al1 = hl[1],
		      al2 = hl[2],
		      al3 = hl[3],
		      al4 = hl[4],
		      al5 = hl[5],
		      al6 = hl[6],
		      al7 = hl[7];

		  var pos = 0;
		  while (n >= 128) {
		    for (i = 0; i < 16; i++) {
		      j = 8 * i + pos;
		      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
		      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
		    }
		    for (i = 0; i < 80; i++) {
		      bh0 = ah0;
		      bh1 = ah1;
		      bh2 = ah2;
		      bh3 = ah3;
		      bh4 = ah4;
		      bh5 = ah5;
		      bh6 = ah6;
		      bh7 = ah7;

		      bl0 = al0;
		      bl1 = al1;
		      bl2 = al2;
		      bl3 = al3;
		      bl4 = al4;
		      bl5 = al5;
		      bl6 = al6;
		      bl7 = al7;

		      // add
		      h = ah7;
		      l = al7;

		      a = l & 0xffff; b = l >>> 16;
		      c = h & 0xffff; d = h >>> 16;

		      // Sigma1
		      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
		      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      // Ch
		      h = (ah4 & ah5) ^ (~ah4 & ah6);
		      l = (al4 & al5) ^ (~al4 & al6);

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      // K
		      h = K[i*2];
		      l = K[i*2+1];

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      // w
		      h = wh[i%16];
		      l = wl[i%16];

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      b += a >>> 16;
		      c += b >>> 16;
		      d += c >>> 16;

		      th = c & 0xffff | d << 16;
		      tl = a & 0xffff | b << 16;

		      // add
		      h = th;
		      l = tl;

		      a = l & 0xffff; b = l >>> 16;
		      c = h & 0xffff; d = h >>> 16;

		      // Sigma0
		      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
		      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      // Maj
		      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
		      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      b += a >>> 16;
		      c += b >>> 16;
		      d += c >>> 16;

		      bh7 = (c & 0xffff) | (d << 16);
		      bl7 = (a & 0xffff) | (b << 16);

		      // add
		      h = bh3;
		      l = bl3;

		      a = l & 0xffff; b = l >>> 16;
		      c = h & 0xffff; d = h >>> 16;

		      h = th;
		      l = tl;

		      a += l & 0xffff; b += l >>> 16;
		      c += h & 0xffff; d += h >>> 16;

		      b += a >>> 16;
		      c += b >>> 16;
		      d += c >>> 16;

		      bh3 = (c & 0xffff) | (d << 16);
		      bl3 = (a & 0xffff) | (b << 16);

		      ah1 = bh0;
		      ah2 = bh1;
		      ah3 = bh2;
		      ah4 = bh3;
		      ah5 = bh4;
		      ah6 = bh5;
		      ah7 = bh6;
		      ah0 = bh7;

		      al1 = bl0;
		      al2 = bl1;
		      al3 = bl2;
		      al4 = bl3;
		      al5 = bl4;
		      al6 = bl5;
		      al7 = bl6;
		      al0 = bl7;

		      if (i%16 === 15) {
		        for (j = 0; j < 16; j++) {
		          // add
		          h = wh[j];
		          l = wl[j];

		          a = l & 0xffff; b = l >>> 16;
		          c = h & 0xffff; d = h >>> 16;

		          h = wh[(j+9)%16];
		          l = wl[(j+9)%16];

		          a += l & 0xffff; b += l >>> 16;
		          c += h & 0xffff; d += h >>> 16;

		          // sigma0
		          th = wh[(j+1)%16];
		          tl = wl[(j+1)%16];
		          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
		          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

		          a += l & 0xffff; b += l >>> 16;
		          c += h & 0xffff; d += h >>> 16;

		          // sigma1
		          th = wh[(j+14)%16];
		          tl = wl[(j+14)%16];
		          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
		          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

		          a += l & 0xffff; b += l >>> 16;
		          c += h & 0xffff; d += h >>> 16;

		          b += a >>> 16;
		          c += b >>> 16;
		          d += c >>> 16;

		          wh[j] = (c & 0xffff) | (d << 16);
		          wl[j] = (a & 0xffff) | (b << 16);
		        }
		      }
		    }

		    // add
		    h = ah0;
		    l = al0;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[0];
		    l = hl[0];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[0] = ah0 = (c & 0xffff) | (d << 16);
		    hl[0] = al0 = (a & 0xffff) | (b << 16);

		    h = ah1;
		    l = al1;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[1];
		    l = hl[1];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[1] = ah1 = (c & 0xffff) | (d << 16);
		    hl[1] = al1 = (a & 0xffff) | (b << 16);

		    h = ah2;
		    l = al2;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[2];
		    l = hl[2];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[2] = ah2 = (c & 0xffff) | (d << 16);
		    hl[2] = al2 = (a & 0xffff) | (b << 16);

		    h = ah3;
		    l = al3;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[3];
		    l = hl[3];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[3] = ah3 = (c & 0xffff) | (d << 16);
		    hl[3] = al3 = (a & 0xffff) | (b << 16);

		    h = ah4;
		    l = al4;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[4];
		    l = hl[4];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[4] = ah4 = (c & 0xffff) | (d << 16);
		    hl[4] = al4 = (a & 0xffff) | (b << 16);

		    h = ah5;
		    l = al5;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[5];
		    l = hl[5];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[5] = ah5 = (c & 0xffff) | (d << 16);
		    hl[5] = al5 = (a & 0xffff) | (b << 16);

		    h = ah6;
		    l = al6;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[6];
		    l = hl[6];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[6] = ah6 = (c & 0xffff) | (d << 16);
		    hl[6] = al6 = (a & 0xffff) | (b << 16);

		    h = ah7;
		    l = al7;

		    a = l & 0xffff; b = l >>> 16;
		    c = h & 0xffff; d = h >>> 16;

		    h = hh[7];
		    l = hl[7];

		    a += l & 0xffff; b += l >>> 16;
		    c += h & 0xffff; d += h >>> 16;

		    b += a >>> 16;
		    c += b >>> 16;
		    d += c >>> 16;

		    hh[7] = ah7 = (c & 0xffff) | (d << 16);
		    hl[7] = al7 = (a & 0xffff) | (b << 16);

		    pos += 128;
		    n -= 128;
		  }

		  return n;
		}

		function crypto_hash(out, m, n) {
		  var hh = new Int32Array(8),
		      hl = new Int32Array(8),
		      x = new Uint8Array(256),
		      i, b = n;

		  hh[0] = 0x6a09e667;
		  hh[1] = 0xbb67ae85;
		  hh[2] = 0x3c6ef372;
		  hh[3] = 0xa54ff53a;
		  hh[4] = 0x510e527f;
		  hh[5] = 0x9b05688c;
		  hh[6] = 0x1f83d9ab;
		  hh[7] = 0x5be0cd19;

		  hl[0] = 0xf3bcc908;
		  hl[1] = 0x84caa73b;
		  hl[2] = 0xfe94f82b;
		  hl[3] = 0x5f1d36f1;
		  hl[4] = 0xade682d1;
		  hl[5] = 0x2b3e6c1f;
		  hl[6] = 0xfb41bd6b;
		  hl[7] = 0x137e2179;

		  crypto_hashblocks_hl(hh, hl, m, n);
		  n %= 128;

		  for (i = 0; i < n; i++) x[i] = m[b-n+i];
		  x[n] = 128;

		  n = 256-128*(n<112?1:0);
		  x[n-9] = 0;
		  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
		  crypto_hashblocks_hl(hh, hl, x, n);

		  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

		  return 0;
		}

		function add(p, q) {
		  var a = gf(), b = gf(), c = gf(),
		      d = gf(), e = gf(), f = gf(),
		      g = gf(), h = gf(), t = gf();

		  Z(a, p[1], p[0]);
		  Z(t, q[1], q[0]);
		  M(a, a, t);
		  A(b, p[0], p[1]);
		  A(t, q[0], q[1]);
		  M(b, b, t);
		  M(c, p[3], q[3]);
		  M(c, c, D2);
		  M(d, p[2], q[2]);
		  A(d, d, d);
		  Z(e, b, a);
		  Z(f, d, c);
		  A(g, d, c);
		  A(h, b, a);

		  M(p[0], e, f);
		  M(p[1], h, g);
		  M(p[2], g, f);
		  M(p[3], e, h);
		}

		function cswap(p, q, b) {
		  var i;
		  for (i = 0; i < 4; i++) {
		    sel25519(p[i], q[i], b);
		  }
		}

		function pack(r, p) {
		  var tx = gf(), ty = gf(), zi = gf();
		  inv25519(zi, p[2]);
		  M(tx, p[0], zi);
		  M(ty, p[1], zi);
		  pack25519(r, ty);
		  r[31] ^= par25519(tx) << 7;
		}

		function scalarmult(p, q, s) {
		  var b, i;
		  set25519(p[0], gf0);
		  set25519(p[1], gf1);
		  set25519(p[2], gf1);
		  set25519(p[3], gf0);
		  for (i = 255; i >= 0; --i) {
		    b = (s[(i/8)|0] >> (i&7)) & 1;
		    cswap(p, q, b);
		    add(q, p);
		    add(p, p);
		    cswap(p, q, b);
		  }
		}

		function scalarbase(p, s) {
		  var q = [gf(), gf(), gf(), gf()];
		  set25519(q[0], X);
		  set25519(q[1], Y);
		  set25519(q[2], gf1);
		  M(q[3], X, Y);
		  scalarmult(p, q, s);
		}

		function crypto_sign_keypair(pk, sk, seeded) {
		  var d = new Uint8Array(64);
		  var p = [gf(), gf(), gf(), gf()];
		  var i;

		  if (!seeded) randombytes(sk, 32);
		  crypto_hash(d, sk, 32);
		  d[0] &= 248;
		  d[31] &= 127;
		  d[31] |= 64;

		  scalarbase(p, d);
		  pack(pk, p);

		  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
		  return 0;
		}

		var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

		function modL(r, x) {
		  var carry, i, j, k;
		  for (i = 63; i >= 32; --i) {
		    carry = 0;
		    for (j = i - 32, k = i - 12; j < k; ++j) {
		      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
		      carry = Math.floor((x[j] + 128) / 256);
		      x[j] -= carry * 256;
		    }
		    x[j] += carry;
		    x[i] = 0;
		  }
		  carry = 0;
		  for (j = 0; j < 32; j++) {
		    x[j] += carry - (x[31] >> 4) * L[j];
		    carry = x[j] >> 8;
		    x[j] &= 255;
		  }
		  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
		  for (i = 0; i < 32; i++) {
		    x[i+1] += x[i] >> 8;
		    r[i] = x[i] & 255;
		  }
		}

		function reduce(r) {
		  var x = new Float64Array(64), i;
		  for (i = 0; i < 64; i++) x[i] = r[i];
		  for (i = 0; i < 64; i++) r[i] = 0;
		  modL(r, x);
		}

		// Note: difference from C - smlen returned, not passed as argument.
		function crypto_sign(sm, m, n, sk) {
		  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
		  var i, j, x = new Float64Array(64);
		  var p = [gf(), gf(), gf(), gf()];

		  crypto_hash(d, sk, 32);
		  d[0] &= 248;
		  d[31] &= 127;
		  d[31] |= 64;

		  var smlen = n + 64;
		  for (i = 0; i < n; i++) sm[64 + i] = m[i];
		  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

		  crypto_hash(r, sm.subarray(32), n+32);
		  reduce(r);
		  scalarbase(p, r);
		  pack(sm, p);

		  for (i = 32; i < 64; i++) sm[i] = sk[i];
		  crypto_hash(h, sm, n + 64);
		  reduce(h);

		  for (i = 0; i < 64; i++) x[i] = 0;
		  for (i = 0; i < 32; i++) x[i] = r[i];
		  for (i = 0; i < 32; i++) {
		    for (j = 0; j < 32; j++) {
		      x[i+j] += h[i] * d[j];
		    }
		  }

		  modL(sm.subarray(32), x);
		  return smlen;
		}

		function unpackneg(r, p) {
		  var t = gf(), chk = gf(), num = gf(),
		      den = gf(), den2 = gf(), den4 = gf(),
		      den6 = gf();

		  set25519(r[2], gf1);
		  unpack25519(r[1], p);
		  S(num, r[1]);
		  M(den, num, D);
		  Z(num, num, r[2]);
		  A(den, r[2], den);

		  S(den2, den);
		  S(den4, den2);
		  M(den6, den4, den2);
		  M(t, den6, num);
		  M(t, t, den);

		  pow2523(t, t);
		  M(t, t, num);
		  M(t, t, den);
		  M(t, t, den);
		  M(r[0], t, den);

		  S(chk, r[0]);
		  M(chk, chk, den);
		  if (neq25519(chk, num)) M(r[0], r[0], I);

		  S(chk, r[0]);
		  M(chk, chk, den);
		  if (neq25519(chk, num)) return -1;

		  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

		  M(r[3], r[0], r[1]);
		  return 0;
		}

		function crypto_sign_open(m, sm, n, pk) {
		  var i;
		  var t = new Uint8Array(32), h = new Uint8Array(64);
		  var p = [gf(), gf(), gf(), gf()],
		      q = [gf(), gf(), gf(), gf()];

		  if (n < 64) return -1;

		  if (unpackneg(q, pk)) return -1;

		  for (i = 0; i < n; i++) m[i] = sm[i];
		  for (i = 0; i < 32; i++) m[i+32] = pk[i];
		  crypto_hash(h, m, n);
		  reduce(h);
		  scalarmult(p, q, h);

		  scalarbase(q, sm.subarray(32));
		  add(p, q);
		  pack(t, p);

		  n -= 64;
		  if (crypto_verify_32(sm, 0, t, 0)) {
		    for (i = 0; i < n; i++) m[i] = 0;
		    return -1;
		  }

		  for (i = 0; i < n; i++) m[i] = sm[i + 64];
		  return n;
		}

		var crypto_secretbox_KEYBYTES = 32,
		    crypto_secretbox_NONCEBYTES = 24,
		    crypto_secretbox_ZEROBYTES = 32,
		    crypto_secretbox_BOXZEROBYTES = 16,
		    crypto_scalarmult_BYTES = 32,
		    crypto_scalarmult_SCALARBYTES = 32,
		    crypto_box_PUBLICKEYBYTES = 32,
		    crypto_box_SECRETKEYBYTES = 32,
		    crypto_box_BEFORENMBYTES = 32,
		    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
		    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
		    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
		    crypto_sign_BYTES = 64,
		    crypto_sign_PUBLICKEYBYTES = 32,
		    crypto_sign_SECRETKEYBYTES = 64,
		    crypto_sign_SEEDBYTES = 32,
		    crypto_hash_BYTES = 64;

		nacl.lowlevel = {
		  crypto_core_hsalsa20: crypto_core_hsalsa20,
		  crypto_stream_xor: crypto_stream_xor,
		  crypto_stream: crypto_stream,
		  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
		  crypto_stream_salsa20: crypto_stream_salsa20,
		  crypto_onetimeauth: crypto_onetimeauth,
		  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
		  crypto_verify_16: crypto_verify_16,
		  crypto_verify_32: crypto_verify_32,
		  crypto_secretbox: crypto_secretbox,
		  crypto_secretbox_open: crypto_secretbox_open,
		  crypto_scalarmult: crypto_scalarmult,
		  crypto_scalarmult_base: crypto_scalarmult_base,
		  crypto_box_beforenm: crypto_box_beforenm,
		  crypto_box_afternm: crypto_box_afternm,
		  crypto_box: crypto_box,
		  crypto_box_open: crypto_box_open,
		  crypto_box_keypair: crypto_box_keypair,
		  crypto_hash: crypto_hash,
		  crypto_sign: crypto_sign,
		  crypto_sign_keypair: crypto_sign_keypair,
		  crypto_sign_open: crypto_sign_open,

		  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
		  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
		  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
		  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
		  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
		  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
		  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
		  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
		  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
		  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
		  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
		  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
		  crypto_sign_BYTES: crypto_sign_BYTES,
		  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
		  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
		  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
		  crypto_hash_BYTES: crypto_hash_BYTES,

		  gf: gf,
		  D: D,
		  L: L,
		  pack25519: pack25519,
		  unpack25519: unpack25519,
		  M: M,
		  A: A,
		  S: S,
		  Z: Z,
		  pow2523: pow2523,
		  add: add,
		  set25519: set25519,
		  modL: modL,
		  scalarmult: scalarmult,
		  scalarbase: scalarbase,
		};

		/* High-level API */

		function checkLengths(k, n) {
		  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
		  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
		}

		function checkBoxLengths(pk, sk) {
		  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
		  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
		}

		function checkArrayTypes() {
		  for (var i = 0; i < arguments.length; i++) {
		    if (!(arguments[i] instanceof Uint8Array))
		      throw new TypeError('unexpected type, use Uint8Array');
		  }
		}

		function cleanup(arr) {
		  for (var i = 0; i < arr.length; i++) arr[i] = 0;
		}

		nacl.randomBytes = function(n) {
		  var b = new Uint8Array(n);
		  randombytes(b, n);
		  return b;
		};

		nacl.secretbox = function(msg, nonce, key) {
		  checkArrayTypes(msg, nonce, key);
		  checkLengths(key, nonce);
		  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
		  var c = new Uint8Array(m.length);
		  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
		  crypto_secretbox(c, m, m.length, nonce, key);
		  return c.subarray(crypto_secretbox_BOXZEROBYTES);
		};

		nacl.secretbox.open = function(box, nonce, key) {
		  checkArrayTypes(box, nonce, key);
		  checkLengths(key, nonce);
		  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
		  var m = new Uint8Array(c.length);
		  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
		  if (c.length < 32) return null;
		  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
		  return m.subarray(crypto_secretbox_ZEROBYTES);
		};

		nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
		nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
		nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

		nacl.scalarMult = function(n, p) {
		  checkArrayTypes(n, p);
		  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
		  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
		  var q = new Uint8Array(crypto_scalarmult_BYTES);
		  crypto_scalarmult(q, n, p);
		  return q;
		};

		nacl.scalarMult.base = function(n) {
		  checkArrayTypes(n);
		  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
		  var q = new Uint8Array(crypto_scalarmult_BYTES);
		  crypto_scalarmult_base(q, n);
		  return q;
		};

		nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
		nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

		nacl.box = function(msg, nonce, publicKey, secretKey) {
		  var k = nacl.box.before(publicKey, secretKey);
		  return nacl.secretbox(msg, nonce, k);
		};

		nacl.box.before = function(publicKey, secretKey) {
		  checkArrayTypes(publicKey, secretKey);
		  checkBoxLengths(publicKey, secretKey);
		  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
		  crypto_box_beforenm(k, publicKey, secretKey);
		  return k;
		};

		nacl.box.after = nacl.secretbox;

		nacl.box.open = function(msg, nonce, publicKey, secretKey) {
		  var k = nacl.box.before(publicKey, secretKey);
		  return nacl.secretbox.open(msg, nonce, k);
		};

		nacl.box.open.after = nacl.secretbox.open;

		nacl.box.keyPair = function() {
		  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
		  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
		  crypto_box_keypair(pk, sk);
		  return {publicKey: pk, secretKey: sk};
		};

		nacl.box.keyPair.fromSecretKey = function(secretKey) {
		  checkArrayTypes(secretKey);
		  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
		    throw new Error('bad secret key size');
		  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
		  crypto_scalarmult_base(pk, secretKey);
		  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
		};

		nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
		nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
		nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
		nacl.box.nonceLength = crypto_box_NONCEBYTES;
		nacl.box.overheadLength = nacl.secretbox.overheadLength;

		nacl.sign = function(msg, secretKey) {
		  checkArrayTypes(msg, secretKey);
		  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
		    throw new Error('bad secret key size');
		  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
		  crypto_sign(signedMsg, msg, msg.length, secretKey);
		  return signedMsg;
		};

		nacl.sign.open = function(signedMsg, publicKey) {
		  checkArrayTypes(signedMsg, publicKey);
		  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
		    throw new Error('bad public key size');
		  var tmp = new Uint8Array(signedMsg.length);
		  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
		  if (mlen < 0) return null;
		  var m = new Uint8Array(mlen);
		  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
		  return m;
		};

		nacl.sign.detached = function(msg, secretKey) {
		  var signedMsg = nacl.sign(msg, secretKey);
		  var sig = new Uint8Array(crypto_sign_BYTES);
		  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
		  return sig;
		};

		nacl.sign.detached.verify = function(msg, sig, publicKey) {
		  checkArrayTypes(msg, sig, publicKey);
		  if (sig.length !== crypto_sign_BYTES)
		    throw new Error('bad signature size');
		  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
		    throw new Error('bad public key size');
		  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
		  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
		  var i;
		  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
		  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
		  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
		};

		nacl.sign.keyPair = function() {
		  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
		  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
		  crypto_sign_keypair(pk, sk);
		  return {publicKey: pk, secretKey: sk};
		};

		nacl.sign.keyPair.fromSecretKey = function(secretKey) {
		  checkArrayTypes(secretKey);
		  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
		    throw new Error('bad secret key size');
		  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
		  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
		  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
		};

		nacl.sign.keyPair.fromSeed = function(seed) {
		  checkArrayTypes(seed);
		  if (seed.length !== crypto_sign_SEEDBYTES)
		    throw new Error('bad seed size');
		  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
		  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
		  for (var i = 0; i < 32; i++) sk[i] = seed[i];
		  crypto_sign_keypair(pk, sk, true);
		  return {publicKey: pk, secretKey: sk};
		};

		nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
		nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
		nacl.sign.seedLength = crypto_sign_SEEDBYTES;
		nacl.sign.signatureLength = crypto_sign_BYTES;

		nacl.hash = function(msg) {
		  checkArrayTypes(msg);
		  var h = new Uint8Array(crypto_hash_BYTES);
		  crypto_hash(h, msg, msg.length);
		  return h;
		};

		nacl.hash.hashLength = crypto_hash_BYTES;

		nacl.verify = function(x, y) {
		  checkArrayTypes(x, y);
		  // Zero length arguments are considered not equal.
		  if (x.length === 0 || y.length === 0) return false;
		  if (x.length !== y.length) return false;
		  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
		};

		nacl.setPRNG = function(fn) {
		  randombytes = fn;
		};

		(function() {
		  // Initialize PRNG if environment provides CSPRNG.
		  // If not, methods calling randombytes will throw.
		  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
		  if (crypto && crypto.getRandomValues) {
		    // Browsers.
		    var QUOTA = 65536;
		    nacl.setPRNG(function(x, n) {
		      var i, v = new Uint8Array(n);
		      for (i = 0; i < n; i += QUOTA) {
		        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
		      }
		      for (i = 0; i < n; i++) x[i] = v[i];
		      cleanup(v);
		    });
		  } else if (typeof commonjsRequire !== 'undefined') {
		    // Node.js.
		    crypto = require$$0;
		    if (crypto && crypto.randomBytes) {
		      nacl.setPRNG(function(x, n) {
		        var i, v = crypto.randomBytes(n);
		        for (i = 0; i < n; i++) x[i] = v[i];
		        cleanup(v);
		      });
		    }
		  }
		})();

		})(module.exports ? module.exports : (self.nacl = self.nacl || {})); 
	} (naclFast));
	return naclFast.exports;
}

/*
 * ed2curve: convert Ed25519 signing key pair into Curve25519
 * key pair suitable for Diffie-Hellman key exchange.
 *
 * Written by Dmitry Chestnykh in 2014. Public domain.
 */

(function (module) {
	/* jshint newcap: false */
	(function(root, f) {
	  if (module.exports) module.exports = f(requireNaclFast());
	  else root.ed2curve = f(root.nacl);
	}(commonjsGlobal, function(nacl) {
	  if (!nacl) throw new Error('tweetnacl not loaded');

	  // -- Operations copied from TweetNaCl.js. --

	  var gf = function(init) {
	    var i, r = new Float64Array(16);
	    if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
	    return r;
	  };

	  var gf0 = gf(),
	      gf1 = gf([1]),
	      D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
	      I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

	  function car25519(o) {
	    var c;
	    var i;
	    for (i = 0; i < 16; i++) {
	      o[i] += 65536;
	      c = Math.floor(o[i] / 65536);
	      o[(i+1)*(i<15?1:0)] += c - 1 + 37 * (c-1) * (i===15?1:0);
	      o[i] -= (c * 65536);
	    }
	  }

	  function sel25519(p, q, b) {
	    var t, c = ~(b-1);
	    for (var i = 0; i < 16; i++) {
	      t = c & (p[i] ^ q[i]);
	      p[i] ^= t;
	      q[i] ^= t;
	    }
	  }

	  function unpack25519(o, n) {
	    var i;
	    for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
	    o[15] &= 0x7fff;
	  }

	  // addition
	  function A(o, a, b) {
	    var i;
	    for (i = 0; i < 16; i++) o[i] = (a[i] + b[i])|0;
	  }

	  // subtraction
	  function Z(o, a, b) {
	    var i;
	    for (i = 0; i < 16; i++) o[i] = (a[i] - b[i])|0;
	  }

	  // multiplication
	  function M(o, a, b) {
	    var i, j, t = new Float64Array(31);
	    for (i = 0; i < 31; i++) t[i] = 0;
	    for (i = 0; i < 16; i++) {
	      for (j = 0; j < 16; j++) {
	        t[i+j] += a[i] * b[j];
	      }
	    }
	    for (i = 0; i < 15; i++) {
	      t[i] += 38 * t[i+16];
	    }
	    for (i = 0; i < 16; i++) o[i] = t[i];
	    car25519(o);
	    car25519(o);
	  }

	  // squaring
	  function S(o, a) {
	    M(o, a, a);
	  }

	  // inversion
	  function inv25519(o, i) {
	    var c = gf();
	    var a;
	    for (a = 0; a < 16; a++) c[a] = i[a];
	    for (a = 253; a >= 0; a--) {
	      S(c, c);
	      if(a !== 2 && a !== 4) M(c, c, i);
	    }
	    for (a = 0; a < 16; a++) o[a] = c[a];
	  }

	  function pack25519(o, n) {
	    var i, j, b;
	    var m = gf(), t = gf();
	    for (i = 0; i < 16; i++) t[i] = n[i];
	    car25519(t);
	    car25519(t);
	    car25519(t);
	    for (j = 0; j < 2; j++) {
	      m[0] = t[0] - 0xffed;
	      for (i = 1; i < 15; i++) {
	        m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
	        m[i-1] &= 0xffff;
	      }
	      m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
	      b = (m[15]>>16) & 1;
	      m[14] &= 0xffff;
	      sel25519(t, m, 1-b);
	    }
	    for (i = 0; i < 16; i++) {
	      o[2*i] = t[i] & 0xff;
	      o[2*i+1] = t[i] >> 8;
	    }
	  }

	  function par25519(a) {
	    var d = new Uint8Array(32);
	    pack25519(d, a);
	    return d[0] & 1;
	  }

	  function vn(x, xi, y, yi, n) {
	    var i, d = 0;
	    for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
	    return (1 & ((d - 1) >>> 8)) - 1;
	  }

	  function crypto_verify_32(x, xi, y, yi) {
	    return vn(x, xi, y, yi, 32);
	  }

	  function neq25519(a, b) {
	    var c = new Uint8Array(32), d = new Uint8Array(32);
	    pack25519(c, a);
	    pack25519(d, b);
	    return crypto_verify_32(c, 0, d, 0);
	  }

	  function pow2523(o, i) {
	    var c = gf();
	    var a;
	    for (a = 0; a < 16; a++) c[a] = i[a];
	    for (a = 250; a >= 0; a--) {
	      S(c, c);
	      if (a !== 1) M(c, c, i);
	    }
	    for (a = 0; a < 16; a++) o[a] = c[a];
	  }

	  function set25519(r, a) {
	    var i;
	    for (i = 0; i < 16; i++) r[i] = a[i] | 0;
	  }

	  function unpackneg(r, p) {
	    var t = gf(), chk = gf(), num = gf(),
	      den = gf(), den2 = gf(), den4 = gf(),
	      den6 = gf();

	    set25519(r[2], gf1);
	    unpack25519(r[1], p);
	    S(num, r[1]);
	    M(den, num, D);
	    Z(num, num, r[2]);
	    A(den, r[2], den);

	    S(den2, den);
	    S(den4, den2);
	    M(den6, den4, den2);
	    M(t, den6, num);
	    M(t, t, den);

	    pow2523(t, t);
	    M(t, t, num);
	    M(t, t, den);
	    M(t, t, den);
	    M(r[0], t, den);

	    S(chk, r[0]);
	    M(chk, chk, den);
	    if (neq25519(chk, num)) M(r[0], r[0], I);

	    S(chk, r[0]);
	    M(chk, chk, den);
	    if (neq25519(chk, num)) return -1;

	    if (par25519(r[0]) === (p[31] >> 7)) Z(r[0], gf0, r[0]);

	    M(r[3], r[0], r[1]);
	    return 0;
	  }

	  // ----

	  // Converts Ed25519 public key to Curve25519 public key.
	  // montgomeryX = (edwardsY + 1)*inverse(1 - edwardsY) mod p
	  function convertPublicKey(pk) {
	    var z = new Uint8Array(32),
	      q = [gf(), gf(), gf(), gf()],
	      a = gf(), b = gf();

	    if (unpackneg(q, pk)) return null; // reject invalid key

	    var y = q[1];

	    A(a, gf1, y);
	    Z(b, gf1, y);
	    inv25519(b, b);
	    M(a, a, b);

	    pack25519(z, a);
	    return z;
	  }

	  // Converts Ed25519 secret key to Curve25519 secret key.
	  function convertSecretKey(sk) {
	    var d = new Uint8Array(64), o = new Uint8Array(32), i;
	    nacl.lowlevel.crypto_hash(d, sk, 32);
	    d[0] &= 248;
	    d[31] &= 127;
	    d[31] |= 64;
	    for (i = 0; i < 32; i++) o[i] = d[i];
	    for (i = 0; i < 64; i++) d[i] = 0;
	    return o;
	  }

	  function convertKeyPair(edKeyPair) {
	    var publicKey = convertPublicKey(edKeyPair.publicKey);
	    if (!publicKey) return null;
	    return {
	      publicKey: publicKey,
	      secretKey: convertSecretKey(edKeyPair.secretKey)
	    };
	  }

	  return {
	    convertPublicKey: convertPublicKey,
	    convertSecretKey: convertSecretKey,
	    convertKeyPair: convertKeyPair,
	  };

	})); 
} (ed2curve$1));

var ed2curveExports = ed2curve$1.exports;
var ed2curve = /*@__PURE__*/getDefaultExportFromCjs(ed2curveExports);

/**
 * Base-N/Base-X encoding/decoding functions.
 *
 * Original implementation from base-x:
 * https://github.com/cryptocoinjs/base-x
 *
 * Which is MIT licensed:
 *
 * The MIT License (MIT)
 *
 * Copyright base-x contributors (c) 2016
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
// baseN alphabet indexes
const _reverseAlphabets = {};

/**
 * BaseN-encodes a Uint8Array using the given alphabet.
 *
 * @param {Uint8Array} input - The bytes to encode in a Uint8Array.
 * @param {string} alphabet - The alphabet to use for encoding.
 * @param {number} maxline - The maximum number of encoded characters per line
 *          to use, defaults to none.
 *
 * @returns {string} The baseN-encoded output string.
 */
function encode$3(input, alphabet, maxline) {
  if(!(input instanceof Uint8Array)) {
    throw new TypeError('"input" must be a Uint8Array.');
  }
  if(input.length === 0) {
    return '';
  }

  let output = '';

  let i = 0;
  const base = alphabet.length;
  const first = alphabet.charAt(0);
  const digits = [0];
  for(i = 0; i < input.length; ++i) {
    let carry = input[i];
    for(let j = 0; j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % base;
      carry = (carry / base) | 0;
    }

    while(carry > 0) {
      digits.push(carry % base);
      carry = (carry / base) | 0;
    }
  }

  // deal with leading zeros
  for(i = 0; input[i] === 0 && i < input.length - 1; ++i) {
    output += first;
  }
  // convert digits to a string
  for(i = digits.length - 1; i >= 0; --i) {
    output += alphabet[digits[i]];
  }

  return output;
}

/**
 * Decodes a baseN-encoded (using the given alphabet) string to a
 * Uint8Array.
 *
 * @param {string} input - The baseN-encoded input string.
 * @param {string} alphabet - The alphabet to use for decoding.
 *
 * @returns {Uint8Array} The decoded bytes in a Uint8Array.
 */
function decode$3(input, alphabet) {
  if(typeof input !== 'string') {
    throw new TypeError('"input" must be a string.');
  }
  if(input.length === 0) {
    return new Uint8Array();
  }

  let table = _reverseAlphabets[alphabet];
  if(!table) {
    // compute reverse alphabet
    table = _reverseAlphabets[alphabet] = [];
    for(let i = 0; i < alphabet.length; ++i) {
      table[alphabet.charCodeAt(i)] = i;
    }
  }

  // remove whitespace characters
  input = input.replace(/\s/g, '');

  const base = alphabet.length;
  const first = alphabet.charAt(0);
  const bytes = [0];
  for(let i = 0; i < input.length; i++) {
    const value = table[input.charCodeAt(i)];
    if(value === undefined) {
      return;
    }

    let carry = value;
    for(let j = 0; j < bytes.length; ++j) {
      carry += bytes[j] * base;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }

    while(carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  // deal with leading zeros
  for(let k = 0; input[k] === first && k < input.length - 1; ++k) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}

/*!
 * Copyright (c) 2019-2022 Digital Bazaar, Inc. All rights reserved.
 */

// base58 characters (Bitcoin alphabet)
const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function encode$2(input, maxline) {
  return encode$3(input, alphabet);
}

function decode$2(input) {
  return decode$3(input, alphabet);
}

var naclFastExports = requireNaclFast();
var nacl = /*@__PURE__*/getDefaultExportFromCjs(naclFastExports);

/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */

async function deriveSecret$3({privateKey, remotePublicKey}) {
  return nacl.scalarMult(privateKey, remotePublicKey);
}

async function generateKeyPair$3() {
  // Each is a Uint8Array with 32-byte key
  const {publicKey, secretKey: privateKey} = nacl.box.keyPair();
  return {publicKey, privateKey};
}

/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */

const PUBLIC_KEY_DER_PREFIX$1 = new Uint8Array([
  48, 42, 48, 5, 6, 3, 43, 101, 110, 3, 33, 0
]);

const PRIVATE_KEY_DER_PREFIX$1 = new Uint8Array([
  48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 110, 4, 34, 4, 32
]);

async function deriveSecretNative$1({privateKey, remotePublicKey}) {
  const nodePrivateKey = crypto__namespace.createPrivateKey({
    key: Buffer.concat([PRIVATE_KEY_DER_PREFIX$1, privateKey]),
    format: 'der',
    type: 'pkcs8'
  });
  const nodePublicKey = crypto__namespace.createPublicKey({
    key: Buffer.concat([PUBLIC_KEY_DER_PREFIX$1, remotePublicKey]),
    format: 'der',
    type: 'spki'
  });
  return crypto__namespace.diffieHellman({
    privateKey: nodePrivateKey,
    publicKey: nodePublicKey,
  });
}

async function generateKeyPairNative$1() {
  const generateKeyPairAsync = node_util.promisify(crypto__namespace.generateKeyPair);
  const publicKeyEncoding = {format: 'der', type: 'spki'};
  const privateKeyEncoding = {format: 'der', type: 'pkcs8'};
  const {publicKey: publicDerBytes, privateKey: privateDerBytes} =
    await generateKeyPairAsync('x25519', {
      publicKeyEncoding, privateKeyEncoding
    });
  const publicKey = publicDerBytes.slice(12, 12 + 32);
  const privateKey = privateDerBytes.slice(16, 16 + 32);
  return {publicKey, privateKey};
}

let deriveSecret$2;
let generateKeyPair$2;
if(crypto__namespace.diffieHellman) {
  deriveSecret$2 = deriveSecretNative$1;
  generateKeyPair$2 = generateKeyPairNative$1;
} else {
  deriveSecret$2 = deriveSecret$3;
  generateKeyPair$2 = generateKeyPair$3;
}

/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _8n = BigInt(8);
const CU_O = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');
const CURVE = Object.freeze({
    a: BigInt(-1),
    d: BigInt('37095705934669439343138083508754565189542113879843219016388785533085940283555'),
    P: BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819949'),
    l: CU_O,
    n: CU_O,
    h: BigInt(8),
    Gx: BigInt('15112221349535400772501151409588531511454012693041857206046113283949847762202'),
    Gy: BigInt('46316835694926478169428394003475163141307993866256225615783033603165251855960'),
});
const POW_2_256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000');
const SQRT_M1 = BigInt('19681161376707505956807079304988542015446066515923890162744021073123829784752');
BigInt('6853475219497561581579357271197624642482790079785650197046958215289687604742');
const SQRT_AD_MINUS_ONE = BigInt('25063068953384623474111414158702152701244531502492656460079210482610430750235');
const INVSQRT_A_MINUS_D = BigInt('54469307008909316920995813868745141605393597292927456921205312896311721017578');
const ONE_MINUS_D_SQ = BigInt('1159843021668779879193775521855586647937357759715417654439879720876111806838');
const D_MINUS_ONE_SQ = BigInt('40440834346308536858101042469323190826248399146238708352240133220865137265952');
class ExtendedPoint {
    constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
    }
    static fromAffine(p) {
        if (!(p instanceof Point)) {
            throw new TypeError('ExtendedPoint#fromAffine: expected Point');
        }
        if (p.equals(Point.ZERO))
            return ExtendedPoint.ZERO;
        return new ExtendedPoint(p.x, p.y, _1n, mod(p.x * p.y));
    }
    static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p) => p.z));
        return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
        return this.toAffineBatch(points).map(this.fromAffine);
    }
    equals(other) {
        assertExtPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        const X1Z2 = mod(X1 * Z2);
        const X2Z1 = mod(X2 * Z1);
        const Y1Z2 = mod(Y1 * Z2);
        const Y2Z1 = mod(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    negate() {
        return new ExtendedPoint(mod(-this.x), this.y, this.z, mod(-this.t));
    }
    double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const { a } = CURVE;
        const A = mod(X1 * X1);
        const B = mod(Y1 * Y1);
        const C = mod(_2n * mod(Z1 * Z1));
        const D = mod(a * A);
        const x1y1 = X1 + Y1;
        const E = mod(mod(x1y1 * x1y1) - A - B);
        const G = D + B;
        const F = G - C;
        const H = D - B;
        const X3 = mod(E * F);
        const Y3 = mod(G * H);
        const T3 = mod(E * H);
        const Z3 = mod(F * G);
        return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    add(other) {
        assertExtPoint(other);
        const { x: X1, y: Y1, z: Z1, t: T1 } = this;
        const { x: X2, y: Y2, z: Z2, t: T2 } = other;
        const A = mod((Y1 - X1) * (Y2 + X2));
        const B = mod((Y1 + X1) * (Y2 - X2));
        const F = mod(B - A);
        if (F === _0n)
            return this.double();
        const C = mod(Z1 * _2n * T2);
        const D = mod(T1 * _2n * Z2);
        const E = D + C;
        const G = B + A;
        const H = D - C;
        const X3 = mod(E * F);
        const Y3 = mod(G * H);
        const T3 = mod(E * H);
        const Z3 = mod(F * G);
        return new ExtendedPoint(X3, Y3, Z3, T3);
    }
    subtract(other) {
        return this.add(other.negate());
    }
    precomputeWindow(W) {
        const windows = 1 + 256 / W;
        const points = [];
        let p = this;
        let base = p;
        for (let window = 0; window < windows; window++) {
            base = p;
            points.push(base);
            for (let i = 1; i < 2 ** (W - 1); i++) {
                base = base.add(p);
                points.push(base);
            }
            p = base.double();
        }
        return points;
    }
    wNAF(n, affinePoint) {
        if (!affinePoint && this.equals(ExtendedPoint.BASE))
            affinePoint = Point.BASE;
        const W = (affinePoint && affinePoint._WINDOW_SIZE) || 1;
        if (256 % W) {
            throw new Error('Point#wNAF: Invalid precomputation window, must be power of 2');
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
                precomputes = ExtendedPoint.normalizeZ(precomputes);
                pointPrecomputes.set(affinePoint, precomputes);
            }
        }
        let p = ExtendedPoint.ZERO;
        let f = ExtendedPoint.BASE;
        const windows = 1 + 256 / W;
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
            const offset = window * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
                wbits -= maxNumber;
                n += _1n;
            }
            const offset1 = offset;
            const offset2 = offset + Math.abs(wbits) - 1;
            const cond1 = window % 2 !== 0;
            const cond2 = wbits < 0;
            if (wbits === 0) {
                f = f.add(constTimeNegate(cond1, precomputes[offset1]));
            }
            else {
                p = p.add(constTimeNegate(cond2, precomputes[offset2]));
            }
        }
        return ExtendedPoint.normalizeZ([p, f])[0];
    }
    multiply(scalar, affinePoint) {
        return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
    }
    multiplyUnsafe(scalar) {
        let n = normalizeScalar(scalar, CURVE.l, false);
        const G = ExtendedPoint.BASE;
        const P0 = ExtendedPoint.ZERO;
        if (n === _0n)
            return P0;
        if (this.equals(P0) || n === _1n)
            return this;
        if (this.equals(G))
            return this.wNAF(n);
        let p = P0;
        let d = this;
        while (n > _0n) {
            if (n & _1n)
                p = p.add(d);
            d = d.double();
            n >>= _1n;
        }
        return p;
    }
    isSmallOrder() {
        return this.multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
    }
    isTorsionFree() {
        let p = this.multiplyUnsafe(CURVE.l / _2n).double();
        if (CURVE.l % _2n)
            p = p.add(this);
        return p.equals(ExtendedPoint.ZERO);
    }
    toAffine(invZ) {
        const { x, y, z } = this;
        const is0 = this.equals(ExtendedPoint.ZERO);
        if (invZ == null)
            invZ = is0 ? _8n : invert(z);
        const ax = mod(x * invZ);
        const ay = mod(y * invZ);
        const zz = mod(z * invZ);
        if (is0)
            return Point.ZERO;
        if (zz !== _1n)
            throw new Error('invZ was invalid');
        return new Point(ax, ay);
    }
    fromRistrettoBytes() {
        legacyRist();
    }
    toRistrettoBytes() {
        legacyRist();
    }
    fromRistrettoHash() {
        legacyRist();
    }
}
ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod(CURVE.Gx * CURVE.Gy));
ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
}
function assertExtPoint(other) {
    if (!(other instanceof ExtendedPoint))
        throw new TypeError('ExtendedPoint expected');
}
function assertRstPoint(other) {
    if (!(other instanceof RistrettoPoint))
        throw new TypeError('RistrettoPoint expected');
}
function legacyRist() {
    throw new Error('Legacy method: switch to RistrettoPoint');
}
class RistrettoPoint {
    constructor(ep) {
        this.ep = ep;
    }
    static calcElligatorRistrettoMap(r0) {
        const { d } = CURVE;
        const r = mod(SQRT_M1 * r0 * r0);
        const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
        let c = BigInt(-1);
        const D = mod((c - d * r) * mod(r + d));
        let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
        let s_ = mod(s * r0);
        if (!edIsNegative(s_))
            s_ = mod(-s_);
        if (!Ns_D_is_sq)
            s = s_;
        if (!Ns_D_is_sq)
            c = r;
        const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
        const s2 = s * s;
        const W0 = mod((s + s) * D);
        const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
        const W2 = mod(_1n - s2);
        const W3 = mod(_1n + s2);
        return new ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
    }
    static hashToCurve(hex) {
        hex = ensureBytes(hex, 64);
        const r1 = bytes255ToNumberLE(hex.slice(0, 32));
        const R1 = this.calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hex.slice(32, 64));
        const R2 = this.calcElligatorRistrettoMap(r2);
        return new RistrettoPoint(R1.add(R2));
    }
    static fromHex(hex) {
        hex = ensureBytes(hex, 32);
        const { a, d } = CURVE;
        const emsg = 'RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint';
        const s = bytes255ToNumberLE(hex);
        if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s))
            throw new Error(emsg);
        const s2 = mod(s * s);
        const u1 = mod(_1n + a * s2);
        const u2 = mod(_1n - a * s2);
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2);
        const { isValid, value: I } = invertSqrt(mod(v * u2_2));
        const Dx = mod(I * u2);
        const Dy = mod(I * Dx * v);
        let x = mod((s + s) * Dx);
        if (edIsNegative(x))
            x = mod(-x);
        const y = mod(u1 * Dy);
        const t = mod(x * y);
        if (!isValid || edIsNegative(t) || y === _0n)
            throw new Error(emsg);
        return new RistrettoPoint(new ExtendedPoint(x, y, _1n, t));
    }
    toRawBytes() {
        let { x, y, z, t } = this.ep;
        const u1 = mod(mod(z + y) * mod(z - y));
        const u2 = mod(x * y);
        const u2sq = mod(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2sq));
        const D1 = mod(invsqrt * u1);
        const D2 = mod(invsqrt * u2);
        const zInv = mod(D1 * D2 * t);
        let D;
        if (edIsNegative(t * zInv)) {
            let _x = mod(y * SQRT_M1);
            let _y = mod(x * SQRT_M1);
            x = _x;
            y = _y;
            D = mod(D1 * INVSQRT_A_MINUS_D);
        }
        else {
            D = D2;
        }
        if (edIsNegative(x * zInv))
            y = mod(-y);
        let s = mod((z - y) * D);
        if (edIsNegative(s))
            s = mod(-s);
        return numberTo32BytesLE(s);
    }
    toHex() {
        return bytesToHex(this.toRawBytes());
    }
    toString() {
        return this.toHex();
    }
    equals(other) {
        assertRstPoint(other);
        const a = this.ep;
        const b = other.ep;
        const one = mod(a.x * b.y) === mod(a.y * b.x);
        const two = mod(a.y * b.y) === mod(a.x * b.x);
        return one || two;
    }
    add(other) {
        assertRstPoint(other);
        return new RistrettoPoint(this.ep.add(other.ep));
    }
    subtract(other) {
        assertRstPoint(other);
        return new RistrettoPoint(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
        return new RistrettoPoint(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
        return new RistrettoPoint(this.ep.multiplyUnsafe(scalar));
    }
}
RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
const pointPrecomputes = new WeakMap();
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
    }
    static fromHex(hex, strict = true) {
        const { d, P } = CURVE;
        hex = ensureBytes(hex, 32);
        const normed = hex.slice();
        normed[31] = hex[31] & ~0x80;
        const y = bytesToNumberLE(normed);
        if (strict && y >= P)
            throw new Error('Expected 0 < hex < P');
        if (!strict && y >= POW_2_256)
            throw new Error('Expected 0 < hex < 2**256');
        const y2 = mod(y * y);
        const u = mod(y2 - _1n);
        const v = mod(d * y2 + _1n);
        let { isValid, value: x } = uvRatio(u, v);
        if (!isValid)
            throw new Error('Point.fromHex: invalid y coordinate');
        const isXOdd = (x & _1n) === _1n;
        const isLastByteOdd = (hex[31] & 0x80) !== 0;
        if (isLastByteOdd !== isXOdd) {
            x = mod(-x);
        }
        return new Point(x, y);
    }
    static async fromPrivateKey(privateKey) {
        return (await getExtendedPublicKey(privateKey)).point;
    }
    toRawBytes() {
        const bytes = numberTo32BytesLE(this.y);
        bytes[31] |= this.x & _1n ? 0x80 : 0;
        return bytes;
    }
    toHex() {
        return bytesToHex(this.toRawBytes());
    }
    toX25519() {
        const { y } = this;
        const u = mod((_1n + y) * invert(_1n - y));
        return numberTo32BytesLE(u);
    }
    isTorsionFree() {
        return ExtendedPoint.fromAffine(this).isTorsionFree();
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    negate() {
        return new Point(mod(-this.x), this.y);
    }
    add(other) {
        return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiply(scalar) {
        return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
}
Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
Point.ZERO = new Point(_0n, _1n);
function concatBytes(...arrays) {
    if (!arrays.every((a) => a instanceof Uint8Array))
        throw new Error('Expected Uint8Array list');
    if (arrays.length === 1)
        return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
    }
    return result;
}
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Uint8Array expected');
    let hex = '';
    for (let i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
    }
    return hex;
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
    }
    if (hex.length % 2)
        throw new Error('hexToBytes: received invalid unpadded hex');
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
function numberTo32BytesBE(num) {
    const length = 32;
    const hex = num.toString(16).padStart(length * 2, '0');
    return hexToBytes(hex);
}
function numberTo32BytesLE(num) {
    return numberTo32BytesBE(num).reverse();
}
function edIsNegative(num) {
    return (mod(num) & _1n) === _1n;
}
function bytesToNumberLE(uint8a) {
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    return BigInt('0x' + bytesToHex(Uint8Array.from(uint8a).reverse()));
}
const MAX_255B = BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
function bytes255ToNumberLE(bytes) {
    return mod(bytesToNumberLE(bytes) & MAX_255B);
}
function mod(a, b = CURVE.P) {
    const res = a % b;
    return res >= _0n ? res : b + res;
}
function invert(number, modulo = CURVE.P) {
    if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n, u = _1n;
    while (a !== _0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n)
            return acc;
        tmp[i] = acc;
        return mod(acc * num, p);
    }, _1n);
    const inverted = invert(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
        if (num === _0n)
            return acc;
        tmp[i] = mod(acc * tmp[i], p);
        return mod(acc * num, p);
    }, inverted);
    return tmp;
}
function pow2(x, power) {
    const { P } = CURVE;
    let res = x;
    while (power-- > _0n) {
        res *= res;
        res %= P;
    }
    return res;
}
function pow_2_252_3(x) {
    const { P } = CURVE;
    const _5n = BigInt(5);
    const _10n = BigInt(10);
    const _20n = BigInt(20);
    const _40n = BigInt(40);
    const _80n = BigInt(80);
    const x2 = (x * x) % P;
    const b2 = (x2 * x) % P;
    const b4 = (pow2(b2, _2n) * b2) % P;
    const b5 = (pow2(b4, _1n) * x) % P;
    const b10 = (pow2(b5, _5n) * b5) % P;
    const b20 = (pow2(b10, _10n) * b10) % P;
    const b40 = (pow2(b20, _20n) * b20) % P;
    const b80 = (pow2(b40, _40n) * b40) % P;
    const b160 = (pow2(b80, _80n) * b80) % P;
    const b240 = (pow2(b160, _80n) * b80) % P;
    const b250 = (pow2(b240, _10n) * b10) % P;
    const pow_p_5_8 = (pow2(b250, _2n) * x) % P;
    return { pow_p_5_8, b2 };
}
function uvRatio(u, v) {
    const v3 = mod(v * v * v);
    const v7 = mod(v3 * v3 * v);
    const pow = pow_2_252_3(u * v7).pow_p_5_8;
    let x = mod(u * v3 * pow);
    const vx2 = mod(v * x * x);
    const root1 = x;
    const root2 = mod(x * SQRT_M1);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === mod(-u);
    const noRoot = vx2 === mod(-u * SQRT_M1);
    if (useRoot1)
        x = root1;
    if (useRoot2 || noRoot)
        x = root2;
    if (edIsNegative(x))
        x = mod(-x);
    return { isValid: useRoot1 || useRoot2, value: x };
}
function invertSqrt(number) {
    return uvRatio(_1n, number);
}
function modlLE(hash) {
    return mod(bytesToNumberLE(hash), CURVE.l);
}
function equalBytes(b1, b2) {
    if (b1.length !== b2.length) {
        return false;
    }
    for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
}
function ensureBytes(hex, expectedLength) {
    const bytes = hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
    if (typeof expectedLength === 'number' && bytes.length !== expectedLength)
        throw new Error(`Expected ${expectedLength} bytes`);
    return bytes;
}
function normalizeScalar(num, max, strict = true) {
    if (!max)
        throw new TypeError('Specify max value');
    if (typeof num === 'number' && Number.isSafeInteger(num))
        num = BigInt(num);
    if (typeof num === 'bigint' && num < max) {
        if (strict) {
            if (_0n < num)
                return num;
        }
        else {
            if (_0n <= num)
                return num;
        }
    }
    throw new TypeError('Expected valid scalar: 0 < scalar < max');
}
function adjustBytes25519(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
}
function checkPrivateKey(key) {
    key =
        typeof key === 'bigint' || typeof key === 'number'
            ? numberTo32BytesBE(normalizeScalar(key, POW_2_256))
            : ensureBytes(key);
    if (key.length !== 32)
        throw new Error(`Expected 32 bytes`);
    return key;
}
function getKeyFromHash(hashed) {
    const head = adjustBytes25519(hashed.slice(0, 32));
    const prefix = hashed.slice(32, 64);
    const scalar = modlLE(head);
    const point = Point.BASE.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
}
let _sha512Sync;
async function getExtendedPublicKey(key) {
    return getKeyFromHash(await utils.sha512(checkPrivateKey(key)));
}
Point.BASE._setWindowSize(8);
const crypto = {
    node: require$$0__namespace,
    web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined,
};
const utils = {
    bytesToHex,
    hexToBytes,
    concatBytes,
    getExtendedPublicKey,
    mod,
    invert,
    TORSION_SUBGROUP: [
        '0100000000000000000000000000000000000000000000000000000000000000',
        'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a',
        '0000000000000000000000000000000000000000000000000000000000000080',
        '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
        'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
        '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85',
        '0000000000000000000000000000000000000000000000000000000000000000',
        'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa',
    ],
    hashToPrivateScalar: (hash) => {
        hash = ensureBytes(hash);
        if (hash.length < 40 || hash.length > 1024)
            throw new Error('Expected 40-1024 bytes of private key as per FIPS 186');
        return mod(bytesToNumberLE(hash), CURVE.l - _1n) + _1n;
    },
    randomBytes: (bytesLength = 32) => {
        if (crypto.web) {
            return crypto.web.getRandomValues(new Uint8Array(bytesLength));
        }
        else if (crypto.node) {
            const { randomBytes } = crypto.node;
            return new Uint8Array(randomBytes(bytesLength).buffer);
        }
        else {
            throw new Error("The environment doesn't have randomBytes function");
        }
    },
    randomPrivateKey: () => {
        return utils.randomBytes(32);
    },
    sha512: async (...messages) => {
        const message = concatBytes(...messages);
        if (crypto.web) {
            const buffer = await crypto.web.subtle.digest('SHA-512', message.buffer);
            return new Uint8Array(buffer);
        }
        else if (crypto.node) {
            return Uint8Array.from(crypto.node.createHash('sha512').update(message).digest());
        }
        else {
            throw new Error("The environment doesn't have sha512 function");
        }
    },
    precompute(windowSize = 8, point = Point.BASE) {
        const cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_2n);
        return cached;
    },
    sha512Sync: undefined,
};
Object.defineProperties(utils, {
    sha512Sync: {
        configurable: false,
        get() {
            return _sha512Sync;
        },
        set(val) {
            if (!_sha512Sync)
                _sha512Sync = val;
        },
    },
});

/*!
 * Copyright (c) 2019-2021 Digital Bazaar, Inc. All rights reserved.
 */

const SUITE_ID$2 = 'X25519KeyAgreementKey2019';

// multicodec ed25519-pub header as varint
const MULTICODEC_ED25519_PUB_HEADER$2 = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER$2 = new Uint8Array([0x80, 0x26]);

class X25519KeyAgreementKey2019 extends LDKeyPair {
  /**
   * An implementation of x25519
   * [X25519 Key Agreement 2019]{@link https://w3c-dvcg.github.io/}
   * representation.
   *
   * @example
   * > const privateKeyBase58 =
   *   '...';
   * > const options = {
   *   publicKeyBase58: '...',
   *   privateKeyBase58
   * };
   * > const DHKey = new X25519KeyAgreementKey2019(options);
   * > DHKey
   * X25519KeyAgreementKey2019 { ...
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.controller - Controller DID or document url.
   * @param {string} [options.id] - Key ID, typically composed of controller
   *   URL and key fingerprint as hash fragment.
   * @param {string} options.publicKeyBase58 - Base58 encoded public key.
   * @param {string} [options.privateKeyBase58] - Base58 private key.
   * @param {string} [options.revoked] - Timestamp of when the key has been
   *   revoked, in RFC3339 format. If not present, the key itself is considered
   *   not revoked. Note that this mechanism is slightly different than DID
   *   Document key revocation, where a DID controller can revoke a key from
   *   that DID by removing it from the DID Document.
   */
  constructor(options = {}) {
    super(options);
    this.type = SUITE_ID$2;
    this.publicKeyBase58 = options.publicKeyBase58;
    if(!this.publicKeyBase58) {
      throw TypeError('The "publicKeyBase58" property is required.');
    }
    this.privateKeyBase58 = options.privateKeyBase58;
    if(this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
  }

  /**
   * Generates a new public/private X25519 Key Pair.
   *
   * @example
   * > const keyPair = await X25519KeyAgreementKey2019.generate();
   * > keyPair
   * X25519KeyAgreementKey2019 { ...
   *
   * @param {object} [options={}] - The options.
   * @param {string} [options.controller] - A controller.
   * @param {string} [options.id] - An id.
   *
   * @returns {Promise<X25519KeyAgreementKey2019>} Generates a key pair.
   */
  static async generate(options = {}) {
    const {publicKey, privateKey} = await generateKeyPair$2();

    return new X25519KeyAgreementKey2019({
      publicKeyBase58: encode$2(publicKey),
      privateKeyBase58: encode$2(privateKey),
      ...options
    });
  }

  /**
   * Creates an X25519KeyAgreementKey2019 Key Pair from an existing key
   * (constructor method).
   *
   * @example
   * > const options = {
   *   id,
   *   controller,
   *   publicKeyBase58,
   *   privateKeyBase58: privateKey
   * };
   * > const key = await X25519KeyAgreementKey2019.from(options);
   * > key
   * X25519KeyAgreementKey2019 { ...
   *
   * @param {object} options - The options.
   * @param {string} [options.privateKeyBase58] - A Base58 encoded Private key.
   *
   * @returns {X25519KeyAgreementKey2019} An X25519 Key Pair.
   */
  static async from(options) {
    return new X25519KeyAgreementKey2019(options);
  }

  /**
   * Converts a keypair instance of type Ed25519VerificationKey2018 to an
   * instance of this class.
   *
   * @see https://github.com/digitalbazaar/ed25519-verification-key-2018
   *
   * @typedef {object} Ed25519VerificationKey2018
   *
   * @param {Ed25519VerificationKey2018} keyPair - The source key pair.
   *
   * @returns {X25519KeyAgreementKey2019} The converted output.
   */
  static fromEd25519VerificationKey2018({keyPair}) {
    const xKey = new X25519KeyAgreementKey2019({
      controller: keyPair.controller,
      publicKeyBase58: X25519KeyAgreementKey2019
        .convertFromEdPublicKey(keyPair)
    });

    if(keyPair.privateKeyBase58) {
      xKey.privateKeyBase58 = X25519KeyAgreementKey2019
        .convertFromEdPrivateKey(keyPair);
    }

    return xKey;
  }

  /**
   * Converts a keypair instance of type Ed25519VerificationKey2020 to an
   * instance of this class.
   *
   * @see https://github.com/digitalbazaar/ed25519-verification-key-2020
   *
   * @typedef {object} Ed25519VerificationKey2020
   *
   * @param {Ed25519VerificationKey2020} keyPair - The source key pair.
   *
   * @returns {X25519KeyAgreementKey2019} - The converted output.
   */
  static fromEd25519VerificationKey2020({keyPair}) {
    if(!keyPair.publicKeyMultibase) {
      throw new Error('Source public key is required to convert.');
    }

    if(!keyPair.publicKeyMultibase.startsWith('z')) {
      throw new TypeError(
        'Expecting source public Ed25519 2020 key to have base58btc encoding.'
      );
    }

    const publicKeyBase58 = encode$2(_multibaseDecode$1(
      MULTICODEC_ED25519_PUB_HEADER$2,
      keyPair.publicKeyMultibase));

    const xKey = new X25519KeyAgreementKey2019({
      controller: keyPair.controller,
      publicKeyBase58: X25519KeyAgreementKey2019
        .convertFromEdPublicKey({publicKeyBase58})
    });

    if(keyPair.privateKeyMultibase) {
      if(!keyPair.privateKeyMultibase.startsWith('z')) {
        throw new TypeError(
          // eslint-disable-next-line max-len
          'Expecting source private Ed25519 2020 key to have base58btc encoding.'
        );
      }

      const privateKeyBase58 = encode$2(_multibaseDecode$1(
        MULTICODEC_ED25519_PRIV_HEADER$2, keyPair.privateKeyMultibase));

      xKey.privateKeyBase58 = X25519KeyAgreementKey2019
        .convertFromEdPrivateKey({privateKeyBase58});
    }

    return xKey;
  }

  /**
   * @deprecated
   * NOTE: This is now an alias of `fromEd25519VerificationKey2018()`, to
   * maintain backwards compatibility. Going forward, code should be using
   * the conversion method specific to the Ed25519 suite it's using.
   *
   * Converts a keypair instance of type Ed25519VerificationKey2018 to an
   * instance of this class.
   *
   * @param {Ed25519VerificationKey2018} keyPair - The source key pair.
   *
   * @returns {X25519KeyAgreementKey2019} - The converted output.
   */
  static fromEdKeyPair({keyPair}) {
    return this.fromEd25519VerificationKey2018({keyPair});
  }

  /**
   * @param {string} publicKeyBase58 - The base58 encoded Ed25519 Public key.
   *
   * @returns {string} The base58 encoded X25519 Public key.
   */
  static convertFromEdPublicKey({publicKeyBase58}) {
    const edPubkeyBytes = decode$2(publicKeyBase58);

    // Converts a 32-byte Ed25519 public key into a 32-byte Curve25519 key
    // Returns null if the given public key in not a valid Ed25519 public key.
    const dhPubkeyBytes = Point.fromHex(edPubkeyBytes).toX25519();
    if(!dhPubkeyBytes) {
      throw new Error(
        'Error converting to X25519; Invalid Ed25519 public key.');
    }
    const dhPublicKeyBase58 = encode$2(dhPubkeyBytes);
    return dhPublicKeyBase58;
  }

  /**
   * @param {string} privateKeyBase58 - The base58 encoded Ed25519 Private key.
   *
   * @returns {string} The base58 encoded X25519 Private key.
   */
  static convertFromEdPrivateKey({privateKeyBase58}) {
    const edPrivkeyBytes = decode$2(privateKeyBase58);
    // Converts a 64-byte Ed25519 secret key (or just the first 32-byte part of
    // it, which is the secret value) into a 32-byte Curve25519 secret key
    const dhPrivkeyBytes = ed2curve.convertSecretKey(edPrivkeyBytes);
    // note: a future version should make this method async to allow use of
    // noble to convert private keys -- but `ed2curve` is much faster x100:
    // const {head: dhPrivkeyBytes} = await utils.getExtendedPublicKey(
    //   edPrivkeyBytes.slice(0, 32));
    if(!dhPrivkeyBytes) {
      throw new Error(
        'Error converting to X25519; Invalid Ed25519 private key.');
    }
    const dhPrivateKeyBase58 = encode$2(dhPrivkeyBytes);
    return dhPrivateKeyBase58;
  }

  /**
   * Exports the serialized representation of the KeyPair.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Export public key material?
   * @param {boolean} [options.privateKey] - Export private key material?
   * @param {boolean} [options.includeContext] - Include JSON-LD context?
   *
   * @returns {object} A plain js object that's ready for serialization
   *   (to JSON, etc), for use in DIDs etc.
   */
  export({publicKey = false, privateKey = false, includeContext = false} = {}) {
    if(!(publicKey || privateKey)) {
      throw new TypeError(
        'Export requires specifying either "publicKey" or "privateKey".');
    }
    const exportedKey = {
      id: this.id,
      type: this.type
    };
    if(includeContext) {
      exportedKey['@context'] = X25519KeyAgreementKey2019.SUITE_CONTEXT;
    }
    if(this.controller) {
      exportedKey.controller = this.controller;
    }
    if(publicKey) {
      exportedKey.publicKeyBase58 = this.publicKeyBase58;
    }
    if(privateKey) {
      exportedKey.privateKeyBase58 = this.privateKeyBase58;
    }
    if(this.revoked) {
      exportedKey.revoked = this.revoked;
    }
    return exportedKey;
  }

  /**
   * Generates and returns a multiformats encoded X25519 public key
   * fingerprint (for use with cryptonyms, for example).
   *
   * @see https://github.com/multiformats/multicodec
   *
   * @param {string} publicKeyBase58 - The base58 encoded public key material.
   *
   * @returns {string} The fingerprint.
   */
  static fingerprintFromPublicKey({publicKeyBase58}) {
    // X25519 cryptonyms are multicodec encoded values, specifically:
    // (multicodec('x25519-pub') + key bytes)
    const pubkeyBytes = decode$2(publicKeyBase58);
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    // See https://github.com/multiformats/multicodec/blob/master/table.csv
    // 0xec is the value for X25519 public key
    // 0x01 is from varint.encode(0xec) -> [0xec, 0x01]
    // See https://github.com/multiformats/unsigned-varint
    buffer[0] = 0xec; //
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${encode$2(buffer)}`;
  }

  /**
   * Creates an instance of X25519KeyAgreementKey2019 from a key fingerprint.
   *
   * @param {string} fingerprint - The fingerprint.
   *
   * @throws Unsupported Fingerprint Type.
   * @returns {X25519KeyAgreementKey2019} The key.
   */
  static fromFingerprint({fingerprint} = {}) {
    if(!fingerprint ||
      !(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      throw new Error('`fingerprint` must be a multibase encoded string.');
    }
    // skip leading `z` that indicates base58 encoding
    const buffer = decode$2(fingerprint.substr(1));

    // buffer is: 0xec 0x01 <public key bytes>
    if(buffer[0] !== 0xec || buffer[1] !== 0x01) {
      throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
    }

    return new X25519KeyAgreementKey2019({
      publicKeyBase58: encode$2(buffer.slice(2))
    });
  }

  /**
   * Derives a shared secret via a given public key, typically for use
   * as one parameter for computing a shared key. It should not be used as
   * a shared key itself, but rather input into a key derivation function (KDF)
   * to produce a shared key.
   *
   * @param {LDKeyPair} publicKey - Remote key pair.
   *
   * @throws {TypeError} On invalid base58 encoding of public or private keys.
   * @returns {Promise<Uint8Array>} The derived secret.
   */
  async deriveSecret({publicKey}) {
    const remotePublicKey = decode$2(publicKey.publicKeyBase58);
    const privateKey = decode$2(this.privateKeyBase58);

    return deriveSecret$2({privateKey, remotePublicKey});
  }

  /**
   * Generates and returns a multiformats encoded X25519 public key
   * fingerprint (for use with cryptonyms, for example).
   *
   * @see https://github.com/multiformats/multicodec
   *
   * @returns {string} The fingerprint.
   */
  fingerprint() {
    const {publicKeyBase58} = this;
    return X25519KeyAgreementKey2019
      .fingerprintFromPublicKey({publicKeyBase58});
  }

  /**
   * Tests whether the fingerprint was generated from a given key pair.
   *
   * @example
   * > xKeyPair.verifyFingerprint('...');
   * {valid: true};
   *
   * @param {string} fingerprint - A Base58 public key.
   *
   * @returns {object} An object indicating valid is true or false.
   */
  verifyFingerprint({fingerprint} = {}) {
    // fingerprint should have `z` prefix indicating
    // that it's multi-base encoded
    if(!(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      return {
        error: new Error('`fingerprint` must be a multibase encoded string.'),
        valid: false
      };
    }
    let fingerprintBuffer;
    try {
      fingerprintBuffer = decode$2(fingerprint.slice(1));
    } catch(e) {
      return {error: e, valid: false};
    }
    let publicKeyBuffer;
    try {
      publicKeyBuffer = decode$2(this.publicKeyBase58);
    } catch(e) {
      return {error: e, valid: false};
    }
    // validate the first buffer multicodec bytes 0xec 0x01
    const valid = fingerprintBuffer[0] === 0xec &&
      fingerprintBuffer[1] === 0x01 &&
      publicKeyBuffer.toString() === fingerprintBuffer.slice(2).toString();
    if(!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false
      };
    }
    return {valid};
  }
}

// Used by CryptoLD harness for dispatching.
X25519KeyAgreementKey2019.suite = SUITE_ID$2;
X25519KeyAgreementKey2019.SUITE_CONTEXT =
  'https://w3id.org/security/suites/x25519-2019/v1';

/**
 * Decodes a given string as a multibase-encoded multicodec value.
 *
 * @param {Uint8Array} header - Expected header bytes for the multicodec value.
 * @param {string} text - Multibase encoded string to decode.
 * @returns {Uint8Array} Decoded bytes.
 */
function _multibaseDecode$1(header, text) {
  const mcValue = decode$2(text.slice(1));

  if(!header.every((val, i) => mcValue[i] === val)) {
    throw new Error('Multibase value does not have expected header.');
  }

  return mcValue.slice(header.length);
}

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Note: The following two functions are async to match the signature of
 * their native Node.js counterparts (see './crypto.js').
 */

async function deriveSecret$1({privateKey, remotePublicKey}) {
  return nacl.scalarMult(privateKey, remotePublicKey);
}

async function generateKeyPair$1() {
  // Each is a Uint8Array with 32-byte key
  const {publicKey, secretKey: privateKey} = nacl.box.keyPair();
  return {publicKey, privateKey};
}

function ed25519SecretKeyToX25519$1(secretKey) {
  const hash = new Uint8Array(64);
  // X25519 secret key is the first 32 bytes of the hash with clamped values
  nacl.lowlevel.crypto_hash(hash, secretKey, 32);
  hash[0] &= 248;
  hash[31] &= 127;
  hash[31] |= 64;
  const x25519SecretKey = hash.slice(0, 32);
  // zero-fill remainder of hash before returning
  hash.fill(0, 32);
  return x25519SecretKey;
}

var cryptoNacl = /*#__PURE__*/Object.freeze({
  __proto__: null,
  deriveSecret: deriveSecret$1,
  ed25519SecretKeyToX25519: ed25519SecretKeyToX25519$1,
  generateKeyPair: generateKeyPair$1
});

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

const PUBLIC_KEY_DER_PREFIX = new Uint8Array([
  48, 42, 48, 5, 6, 3, 43, 101, 110, 3, 33, 0
]);

const PRIVATE_KEY_DER_PREFIX = new Uint8Array([
  48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 110, 4, 34, 4, 32
]);

async function deriveSecretNative({privateKey, remotePublicKey}) {
  const nodePrivateKey = crypto__namespace.createPrivateKey({
    key: Buffer.concat([PRIVATE_KEY_DER_PREFIX, privateKey]),
    format: 'der',
    type: 'pkcs8'
  });
  const nodePublicKey = crypto__namespace.createPublicKey({
    key: Buffer.concat([PUBLIC_KEY_DER_PREFIX, remotePublicKey]),
    format: 'der',
    type: 'spki'
  });
  return crypto__namespace.diffieHellman({
    privateKey: nodePrivateKey,
    publicKey: nodePublicKey,
  });
}

async function generateKeyPairNative() {
  const generateKeyPairAsync = node_util.promisify(crypto__namespace.generateKeyPair);
  const publicKeyEncoding = {format: 'der', type: 'spki'};
  const privateKeyEncoding = {format: 'der', type: 'pkcs8'};
  const {publicKey: publicDerBytes, privateKey: privateDerBytes} =
    await generateKeyPairAsync('x25519', {
      publicKeyEncoding, privateKeyEncoding
    });
  const publicKey = publicDerBytes.slice(12, 12 + 32);
  const privateKey = privateDerBytes.slice(16, 16 + 32);
  return {publicKey, privateKey};
}

let deriveSecret;
let generateKeyPair;
if(crypto__namespace.diffieHellman) {
  deriveSecret = deriveSecretNative;
  generateKeyPair = generateKeyPairNative;
} else {
  deriveSecret = deriveSecret$1;
  generateKeyPair = generateKeyPair$1;
}

const {ed25519SecretKeyToX25519} = cryptoNacl;

/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

const SUITE_ID$1 = 'X25519KeyAgreementKey2020';
// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER$1 = 'z';
// multicodec ed25519-pub header as varint
const MULTICODEC_ED25519_PUB_HEADER$1 = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER$1 = new Uint8Array([0x80, 0x26]);
// multicodec x25519-pub header as varint
const MULTICODEC_X25519_PUB_HEADER = new Uint8Array([0xec, 0x01]);
// multicodec x25519-priv header as varint
const MULTICODEC_X25519_PRIV_HEADER = new Uint8Array([0x82, 0x26]);

class X25519KeyAgreementKey2020 extends LDKeyPair {
  /**
   * @param {object} options - Options hashmap.
   * @param {string} options.controller - Controller DID or document url.
   * @param {string} [options.id] - Key ID, typically composed of controller
   *   URL and key fingerprint as hash fragment.
   * @param {string} options.publicKeyMultibase - Multibase encoded public key.
   * @param {string} [options.privateKeyMultibase] - Multibase private key.
   * @param {string} [options.revoked] - Timestamp of when the key has been
   *   revoked, in RFC3339 format. If not present, the key itself is considered
   *   not revoked. Note that this mechanism is slightly different than DID
   *   Document key revocation, where a DID controller can revoke a key from
   *   that DID by removing it from the DID Document.
   */
  constructor(options = {}) {
    super(options);
    this.type = SUITE_ID$1;
    const {publicKeyMultibase, privateKeyMultibase} = options;

    if(!publicKeyMultibase) {
      throw new TypeError('The "publicKeyMultibase" property is required.');
    }

    if(!publicKeyMultibase || !_isValidKeyHeader$1(
      publicKeyMultibase, MULTICODEC_X25519_PUB_HEADER)) {
      throw new Error(
        '"publicKeyMultibase" has invalid header bytes: ' +
        `"${publicKeyMultibase}".`);
    }

    if(privateKeyMultibase && !_isValidKeyHeader$1(
      privateKeyMultibase, MULTICODEC_X25519_PRIV_HEADER)) {
      throw new Error('"privateKeyMultibase" has invalid header bytes.');
    }

    // assign valid key values
    this.publicKeyMultibase = publicKeyMultibase;
    this.privateKeyMultibase = privateKeyMultibase;

    if(this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
  }

  /**
   * Generates a new public/private X25519 Key Pair.
   *
   * @param {object} [options={}] - Keypair options (see controller docstring).
   *
   * @returns {Promise<X25519KeyAgreementKey2020>} Generated key pair.
   */
  static async generate(options = {}) {
    const {publicKey, privateKey} = await generateKeyPair();

    return new X25519KeyAgreementKey2020({
      publicKeyMultibase:
        _multibaseEncode(MULTICODEC_X25519_PUB_HEADER, publicKey),
      privateKeyMultibase:
        _multibaseEncode(MULTICODEC_X25519_PRIV_HEADER, privateKey),
      ...options
    });
  }

  /**
   * Creates an X25519KeyAgreementKey2020 Key Pair from an existing key
   * (constructor method).
   *
   * @param {object} [options={}] - Keypair options (see controller docstring).
   *
   * @returns {X25519KeyAgreementKey2020} An X25519 Key Pair.
   */
  static async from(options = {}) {
    // Check to see if this is an X25519KeyAgreementKey2019
    if(options.publicKeyBase58) {
      // Convert it to a 2020 key pair instance
      return this.fromX25519KeyAgreementKey2019(options);
    }
    return new X25519KeyAgreementKey2020(options);
  }

  /**
   * Creates an X25519KeyAgreementKey2020 Key Pair from an existing 2019 key
   * (backwards compatibility method).
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.publicKeyBase58 - Base58btc encoded public key.
   * @param {string} [options.privateKeyBase58] - Base58btc encoded private key.
   * @param {object} [options.keyPairOptions] - Other options.
   *
   * @returns {Promise<X25519KeyAgreementKey2020>} 2020 Crypto suite key pair.
   */
  static async fromX25519KeyAgreementKey2019({
    publicKeyBase58, privateKeyBase58, ...keyPairOptions
  } = {}) {
    let publicKeyMultibase;
    let privateKeyMultibase;

    if(publicKeyBase58) {
      // prefix with `z` to indicate multi-base base58btc encoding
      publicKeyMultibase = _multibaseEncode(
        MULTICODEC_X25519_PUB_HEADER, decode$2(publicKeyBase58));
    }
    if(privateKeyBase58) {
      // prefix with `z` to indicate multi-base base58btc encoding
      privateKeyMultibase = _multibaseEncode(
        MULTICODEC_X25519_PRIV_HEADER, decode$2(privateKeyBase58));
    }
    return new X25519KeyAgreementKey2020({
      publicKeyMultibase, privateKeyMultibase, ...keyPairOptions
    });
  }

  /**
   * Converts a keypair instance of type Ed25519VerificationKey2020 to an
   * instance of this class.
   *
   * @see https://github.com/digitalbazaar/ed25519-verification-key-2020
   *
   * @param {object} [options={}] - Options hashmap.
   *
   * @typedef {object} Ed25519VerificationKey2020
   * @param {Ed25519VerificationKey2020} options.keyPair - Source key pair.
   *
   * @returns {X25519KeyAgreementKey2020} A derived/converted key agreement
   *   key pair.
   */
  static fromEd25519VerificationKey2020({keyPair} = {}) {
    if(!keyPair.publicKeyMultibase) {
      throw new Error('Source public key is required to convert.');
    }

    if(!keyPair.publicKeyMultibase.startsWith(MULTIBASE_BASE58BTC_HEADER$1)) {
      throw new TypeError(
        'Expecting "publicKeyMultibase" value to be multibase base58btc ' +
        'encoded (must start with "z").'
      );
    }

    const xKey = new X25519KeyAgreementKey2020({
      controller: keyPair.controller,
      publicKeyMultibase: X25519KeyAgreementKey2020
        .convertFromEdPublicKey(keyPair)
    });

    if(keyPair.privateKeyMultibase) {
      if(!keyPair.privateKeyMultibase.startsWith(MULTIBASE_BASE58BTC_HEADER$1)) {
        throw new TypeError(
          'Expecting "privateKeyMultibase" value to be multibase base58btc ' +
          'encoded (must start with "z").'
        );
      }

      xKey.privateKeyMultibase = X25519KeyAgreementKey2020
        .convertFromEdPrivateKey(keyPair);
    }

    return xKey;
  }

  /**
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.publicKeyMultibase - Multibase encoded Ed25519
   *   public key.
   *
   * @returns {string} Multibase encoded converted X25519 Public key.
   */
  static convertFromEdPublicKey({publicKeyMultibase} = {}) {
    if(!publicKeyMultibase) {
      throw new Error('Source public key is required to convert.');
    }

    const edPubkeyBytes =
      _multibaseDecode(MULTICODEC_ED25519_PUB_HEADER$1, publicKeyMultibase);

    // Converts a 32-byte Ed25519 public key into a 32-byte Curve25519 key
    // Returns null if the given public key in not a valid Ed25519 public key.
    const dhPubkeyBytes = Point.fromHex(edPubkeyBytes).toX25519();
    if(!dhPubkeyBytes) {
      throw new Error(
        'Error converting to X25519; Invalid Ed25519 public key.');
    }
    return _multibaseEncode(MULTICODEC_X25519_PUB_HEADER, dhPubkeyBytes);
  }

  /**
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.privateKeyMultibase - Multibase encoded Ed25519
   *   private key.
   *
   * @returns {string} Multibase encoded converted X25519 Private key.
   */
  static convertFromEdPrivateKey({privateKeyMultibase} = {}) {
    if(!privateKeyMultibase) {
      throw new Error('Source private key is required to convert.');
    }

    const edPrivkeyBytes =
      _multibaseDecode(MULTICODEC_ED25519_PRIV_HEADER$1, privateKeyMultibase);
    // Converts a 64-byte Ed25519 secret key (or just the first 32-byte part of
    // it, which is the secret value) into a 32-byte Curve25519 secret key
    const dhPrivkeyBytes = ed25519SecretKeyToX25519(edPrivkeyBytes);
    // note: a future version should make this method async to allow use of
    // noble to convert private keys -- but the tweetnacl version used
    // internally is much faster (~ x100):
    // const {head: dhPrivkeyBytes} = await utils.getExtendedPublicKey(
    //   edPrivkeyBytes.slice(0, 32));
    if(!dhPrivkeyBytes) {
      throw new Error(
        'Error converting to X25519; Invalid Ed25519 private key.');
    }
    return _multibaseEncode(MULTICODEC_X25519_PRIV_HEADER, dhPrivkeyBytes);
  }

  /**
   * Exports the serialized representation of the KeyPair.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Export public key material?
   * @param {boolean} [options.privateKey] - Export private key material?
   * @param {boolean} [options.includeContext] - Include JSON-LD context?
   *
   * @returns {object} A plain js object that's ready for serialization
   *   (to JSON, etc), for use in DIDs etc.
   */
  export({publicKey = false, privateKey = false, includeContext = false} = {}) {
    if(!(publicKey || privateKey)) {
      throw new TypeError(
        'Export requires specifying either "publicKey" or "privateKey".');
    }
    const exportedKey = {
      id: this.id,
      type: this.type
    };
    if(includeContext) {
      exportedKey['@context'] = X25519KeyAgreementKey2020.SUITE_CONTEXT;
    }
    if(this.controller) {
      exportedKey.controller = this.controller;
    }
    if(publicKey) {
      exportedKey.publicKeyMultibase = this.publicKeyMultibase;
    }
    if(privateKey) {
      exportedKey.privateKeyMultibase = this.privateKeyMultibase;
    }
    if(this.revoked) {
      exportedKey.revoked = this.revoked;
    }
    return exportedKey;
  }

  /**
   * Generates and returns a base58btc multibase encoded value of a multicodec
   * X25519 public key fingerprint (for use with cryptonyms, for example).
   *
   * @see https://github.com/multiformats/multicodec
   * @see https://github.com/multiformats/multibase
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.publicKeyMultibase - Multibase encoded public key.
   *
   * @returns {string} The fingerprint.
   */
  static fingerprintFromPublicKey({publicKeyMultibase} = {}) {
    if(!publicKeyMultibase) {
      throw new Error('Source public key is required.');
    }

    return publicKeyMultibase;
  }

  /**
   * Creates an instance of X25519KeyAgreementKey2020 from a key fingerprint.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.fingerprint - Public key fingerprint.
   *
   * @returns {X25519KeyAgreementKey2020} Key pair instance (public key material
   *   only) created from the fingerprint.
   */
  static fromFingerprint({fingerprint} = {}) {
    return new X25519KeyAgreementKey2020({
      publicKeyMultibase: fingerprint
    });
  }

  /**
   * Derives a shared secret via a given public key, typically for use
   * as one parameter for computing a shared key. It should not be used as
   * a shared key itself, but rather as an input into a key derivation function
   * (KDF) to produce a shared key.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {LDKeyPair} options.publicKey - Remote key pair.
   *
   * @returns {Promise<Uint8Array>} Derived secret.
   */
  async deriveSecret({publicKey}) {
    const remotePublicKey = _multibaseDecode(
      MULTICODEC_X25519_PUB_HEADER, publicKey.publicKeyMultibase);
    const privateKey = _multibaseDecode(
      MULTICODEC_X25519_PRIV_HEADER, this.privateKeyMultibase);

    return deriveSecret({privateKey, remotePublicKey});
  }

  /**
   * Generates and returns a multiformats encoded
   * X25519 public key fingerprint (for use with cryptonyms, for example).
   *
   * @see https://github.com/multiformats/multicodec
   *
   * @returns {string} The fingerprint.
   */
  fingerprint() {
    return this.publicKeyMultibase;
  }

  /**
   * Tests whether the fingerprint was generated from a given key pair.
   *
   * @example
   * xKeyPair.verifyFingerprint('...');
   * // {valid: true};
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {string} options.fingerprint - An x25519 key fingerprint (typically
   *   from a key id).
   *
   * @returns {object} An object indicating valid is true or false.
   */
  verifyFingerprint({fingerprint} = {}) {
    // fingerprint should have `z` prefix indicating
    // that it's base58btc multibase encoded
    if(!_isValidKeyHeader$1(fingerprint, MULTICODEC_X25519_PUB_HEADER)) {
      throw new Error(
        `"fingerprint" has invalid header bytes: "${fingerprint}".`);
    }

    return {valid: true};
  }
}

// Used by CryptoLD harness for dispatching.
X25519KeyAgreementKey2020.suite = SUITE_ID$1;
// Used by CryptoLD harness's fromKeyId() method.
X25519KeyAgreementKey2020.SUITE_CONTEXT =
  'https://w3id.org/security/suites/x25519-2020/v1';

/**
 * Checks to see if the given value is a valid multibase encoded key.
 *
 * @param {Uint8Array} multibaseKey - The multibase-encoded key value.
 * @param {Uint8Array} expectedHeader - The expected header for the key value.
 * @returns {boolean} Returns true if the header is valid, false otherwise.
 */
function _isValidKeyHeader$1(multibaseKey, expectedHeader) {
  if(!(typeof multibaseKey === 'string' &&
    multibaseKey[0] === MULTIBASE_BASE58BTC_HEADER$1)) {
    return false;
  }

  const keyBytes = decode$2(multibaseKey.slice(1));
  return expectedHeader.every((val, i) => keyBytes[i] === val);
}

/**
 * Encodes a given Uint8Array to multibase-encoded string.
 *
 * @param {Uint8Array} header - Multicodec header to prepend to the bytes.
 * @param {Uint8Array} bytes - Bytes to encode.
 * @returns {string} Multibase-encoded string.
 */
function _multibaseEncode(header, bytes) {
  const mcBytes = new Uint8Array(header.length + bytes.length);

  mcBytes.set(header);
  mcBytes.set(bytes, header.length);

  return MULTIBASE_BASE58BTC_HEADER$1 + encode$2(mcBytes);
}

/**
 * Decodes a given string as a multibase-encoded multicodec value.
 *
 * @param {Uint8Array} header - Expected header bytes for the multicodec value.
 * @param {string} text - Multibase encoded string to decode.
 * @returns {Uint8Array} Decoded bytes.
 */
function _multibaseDecode(header, text) {
  const mcValue = decode$2(text.substr(1));

  if(!header.every((val, i) => mcValue[i] === val)) {
    throw new Error('Multibase value does not have expected header.');
  }

  return mcValue.slice(header.length);
}

/*!
 * Copyright (c) 2023 Digital Bazaar, Inc. All rights reserved.
 */

const ED25519_KEY_2018_CONTEXT_URL =
  'https://w3id.org/security/suites/ed25519-2018/v1';
const ED25519_KEY_2020_CONTEXT_URL =
  'https://w3id.org/security/suites/ed25519-2020/v1';
const MULTIKEY_CONTEXT_V1_URL = 'https://w3id.org/security/multikey/v1';

const contextsBySuite = new Map([
  ['Ed25519VerificationKey2020', ED25519_KEY_2020_CONTEXT_URL],
  ['Ed25519VerificationKey2018', ED25519_KEY_2018_CONTEXT_URL],
  ['Multikey', MULTIKEY_CONTEXT_V1_URL],
  [X25519KeyAgreementKey2020.suite, X25519KeyAgreementKey2020.SUITE_CONTEXT],
  [X25519KeyAgreementKey2019.suite, X25519KeyAgreementKey2019.SUITE_CONTEXT]
]);

/**
 * Returns the public key object for a given key id fragment.
 *
 * @param {object} options - Options hashmap.
 * @param {object} options.didDocument - The DID Document to use when generating
 *   the id.
 * @param {string} options.keyIdFragment - The key identifier fragment.
 *
 * @returns {object} Returns the public key node, with `@context`.
 */
function getKey({didDocument, keyIdFragment}) {
  // Determine if the key id fragment belongs to the "main" public key,
  // or the keyAgreement key
  const keyId = didDocument.id + '#' + keyIdFragment;
  let publicKey;
  if(didDocument.verificationMethod?.[0].id === keyId) {
    // Return the public key node for the main public key
    publicKey = didDocument.verificationMethod[0];
  } else {
    // Return the public key node for the X25519 key-agreement key
    publicKey = didDocument.keyAgreement[0];
  }

  return {
    '@context': contextsBySuite.get(publicKey.type),
    ...publicKey
  };
}

function getDid({keyPair}) {
  return keyPair.fingerprint ? `did:key:${keyPair.fingerprint()}` :
    `did:key:${keyPair.publicKeyMultibase}`;
}

function setKeyPairId({keyPair, did}) {
  keyPair.id = keyPair.fingerprint ? `${did}#${keyPair.fingerprint()}` :
    `${did}#${keyPair.publicKeyMultibase}`;
}

function getKeyAgreementKeyPair({contexts, verificationPublicKey}) {
  // The KAK pair will use the source key's controller, but may generate
  // its own .id
  let keyAgreementKeyPair;

  switch(verificationPublicKey.type) {
    case 'Ed25519VerificationKey2018': {
      keyAgreementKeyPair = X25519KeyAgreementKey2019
        .fromEd25519VerificationKey2018({keyPair: verificationPublicKey});
      contexts.push(X25519KeyAgreementKey2019.SUITE_CONTEXT);
      break;
    }
    case 'Ed25519VerificationKey2020': {
      keyAgreementKeyPair = X25519KeyAgreementKey2020
        .fromEd25519VerificationKey2020({keyPair: verificationPublicKey});
      contexts.push(X25519KeyAgreementKey2020.SUITE_CONTEXT);
      break;
    }
    case 'Multikey': {
      // FIXME: Add keyAgreementKeyPair interface for Multikey.
      break;
    }
    default: {
      throw new Error(
        `Cannot derive key agreement key from verification key type
          "${verificationPublicKey.type}".`);
    }
  }
  return {keyAgreementKeyPair};
}

function getMultibaseMultikeyHeader({value}) {
  if(!value) {
    throw new TypeError('"publicKeyMultibase" must be a string.');
  }
  return value.slice(0, 4);
}

function addKeyAgreementKeyContext({contexts, keyAgreementKeyPair}) {
  const {type} = keyAgreementKeyPair;
  switch(type) {
    case 'X25519KeyAgreementKey2019': {
      if(!contexts.includes(X25519KeyAgreementKey2019.SUITE_CONTEXT)) {
        contexts.push(X25519KeyAgreementKey2019.SUITE_CONTEXT);
      }
      break;
    }
    case 'X25519KeyAgreementKey2020': {
      if(!contexts.includes(X25519KeyAgreementKey2020.SUITE_CONTEXT)) {
        contexts.push(X25519KeyAgreementKey2020.SUITE_CONTEXT);
      }
      break;
    }
    default: {
      throw new Error(`Unsupported key agreement key type, "${type}".`);
    }
  }
}

async function getKeyPair({
  fromMultibase, publicKeyMultibase, publicKeyDescription
} = {}) {
  let keyPair;
  if(fromMultibase && publicKeyMultibase) {
    keyPair = await fromMultibase({publicKeyMultibase});
  } else {
    keyPair = publicKeyDescription;
  }
  const {type} = keyPair;
  let keyAgreementKeyPair;
  if(type === 'X25519KeyAgreementKey2020' ||
    type === 'X25519KeyAgreementKey2019') {
    keyAgreementKeyPair = keyPair;
    keyPair = null;
  }
  return {keyPair, keyAgreementKeyPair};
}

/*!
 * Copyright (c) 2021-2023 Digital Bazaar, Inc. All rights reserved.
 */

const DID_CONTEXT_URL = 'https://www.w3.org/ns/did/v1';

class DidKeyDriver {
  constructor() {
    // used by did-io to register drivers
    this.method = 'key';
    this._allowedKeyTypes = new Map();
  }

  /**
   * Registers a multibase-multikey header and a multibase-multikey
   * deserializer that is allowed to handle data using that header.
   *
   * @param {object} options - Options hashmap.
   *
   * @param {string} options.multibaseMultikeyHeader - The multibase-multikey
   *   header to register.
   * @param {Function} options.fromMultibase - A function that converts a
   *  `{publicKeyMultibase}` value into a key pair interface.
   */
  use({multibaseMultikeyHeader, fromMultibase} = {}) {
    if(!(multibaseMultikeyHeader &&
      typeof multibaseMultikeyHeader === 'string')) {
      throw new TypeError('"multibaseMultikeyHeader" must be a string.');
    }
    if(typeof fromMultibase !== 'function') {
      throw new TypeError('"fromMultibase" must be a function.');
    }
    this._allowedKeyTypes.set(multibaseMultikeyHeader, fromMultibase);
  }

  /**
   * Generates a DID `key` (`did:key`) method DID Document from a KeyPair.
   *
   * @param {object} options - Options hashmap.
   *
   * @param {object} [options.verificationKeyPair] - A verification KeyPair.
   * @param {object} [options.keyAgreementKeyPair] - A keyAgreement KeyPair.
   *
   * @returns {Promise<{didDocument: object, keyPairs: Map,
   *   methodFor: Function}>} Resolves with the generated DID Document, along
   *   with the corresponding key pairs used to generate it (for storage in a
   *   KMS).
   */
  async fromKeyPair({verificationKeyPair, keyAgreementKeyPair} = {}) {
    if(!(verificationKeyPair || keyAgreementKeyPair)) {
      throw new TypeError(
        '"verificationKeyPair" or "keyAgreementKeyPair" must be an object.');
    }
    // keyPairs is a map of keyId to key pair instance, that includes the
    // verificationKeyPair above and the keyAgreementKey pair that is
    // optionally passed or derived from the passed verification key pair
    const {didDocument, keyPairs} = await this._keyPairToDidDocument(
      {keyPair: verificationKeyPair, keyAgreementKeyPair});

    // convenience function that returns the public/private key pair instance
    // for a given purpose (authentication, assertionMethod, keyAgreement, etc).
    const methodFor = ({purpose}) => {
      const {id: methodId} = this.publicMethodFor({
        didDocument, purpose
      });
      return keyPairs.get(methodId);
    };
    return {didDocument, keyPairs, methodFor};
  }

  /**
   * Returns the public key (verification method) object for a given DID
   * Document and purpose. Useful in conjunction with a `.get()` call.
   *
   * @example
   * const didDocument = await didKeyDriver.get({did});
   * const authKeyData = didDriver.publicMethodFor({
   *   didDocument, purpose: 'authentication'
   * });
   * // You can then create a suite instance object to verify signatures etc.
   * const authPublicKey = await cryptoLd.from(authKeyData);
   * const {verify} = authPublicKey.verifier();
   *
   * @param {object} options - Options hashmap.
   * @param {object} options.didDocument - DID Document (retrieved via a
   *   `.get()` or from some other source).
   * @param {string} options.purpose - Verification method purpose, such as
   *   'authentication', 'assertionMethod', 'keyAgreement' and so on.
   *
   * @returns {object} Returns the public key object (obtained from the DID
   *   Document), without a `@context`.
   */
  publicMethodFor({didDocument, purpose} = {}) {
    if(!didDocument) {
      throw new TypeError('The "didDocument" parameter is required.');
    }
    if(!purpose) {
      throw new TypeError('The "purpose" parameter is required.');
    }

    const method = findVerificationMethod({doc: didDocument, purpose});
    if(!method) {
      throw new Error(`No verification method found for purpose "${purpose}"`);
    }
    return method;
  }

  /**
   * Returns a `did:key` method DID Document for a given DID, or a key document
   * for a given DID URL (key id).
   * Either a `did` or `url` param is required.
   *
   * @example
   * await resolver.get({did}); // -> did document
   * await resolver.get({url: keyId}); // -> public key node
   *
   * @param {object} options - Options hashmap.
   * @param {string} [options.did] - DID URL or a key id (either an ed25519 key
   *   or an x25519 key-agreement key id).
   * @param {string} [options.url] - Alias for the `did` url param, supported
   *   for better readability of invoking code.
   *
   * @returns {Promise<object>} Resolves to a DID Document or a
   *   public key node with context.
   */
  async get({did, url} = {}) {
    did = did || url;
    if(!did) {
      throw new TypeError('"did" must be a string.');
    }
    const [didAuthority, keyIdFragment] = did.split('#');
    const publicKeyMultibase = didAuthority.substring('did:key:'.length);
    // get the multikey header from the public key value
    const multibaseMultikeyHeader = getMultibaseMultikeyHeader({
      value: publicKeyMultibase
    });

    const fromMultibase =
      this._allowedKeyTypes.get(multibaseMultikeyHeader);
    if(!fromMultibase) {
      throw new Error(
        `Unsupported "multibaseMultikeyHeader", "${multibaseMultikeyHeader}".`);
    }
    const {keyAgreementKeyPair, keyPair} = await getKeyPair({
      fromMultibase, publicKeyMultibase
    });
    const {didDocument} = await this._keyPairToDidDocument({
      keyPair, keyAgreementKeyPair
    });

    if(keyIdFragment) {
      // resolve an individual key
      return getKey({didDocument, keyIdFragment});
    }
    // Resolve the full DID Document
    return didDocument;
  }

  /**
   * Converts a public key object to a `did:key` method DID Document.
   * Note that unlike `generate()`, a `keyPairs` map is not returned. Use
   * `publicMethodFor()` to fetch keys for particular proof purposes.
   *
   * @param {object} options - Options hashmap.
   * @param {object} options.publicKeyDescription - Public key object
   *   used to generate the DID document (either an LDKeyPair instance
   *   containing public key material, or a "key description" plain object
   *   (such as that generated from a KMS)).
   *
   * @returns {Promise<object>} Resolves with the generated DID Document.
   */
  async publicKeyToDidDoc({publicKeyDescription} = {}) {
    const {
      keyPair, keyAgreementKeyPair
    } = await getKeyPair({publicKeyDescription});
    const {didDocument} = await this._keyPairToDidDocument({
      keyPair, keyAgreementKeyPair
    });
    return {didDocument};
  }

  /**
   * Converts an Ed25519KeyPair object to a `did:key` method DID Document.
   *
   * @param {object} options - Options hashmap.
   * @param {object} options.keyPair - Key used to generate the DID
   *   document (either an LDKeyPair instance containing public key material,
   *   or a "key description" plain object (such as that generated from a KMS)).
   * @param {object} [options.keyAgreementKeyPair] -  Optional
   *   keyAgreement key pair for generating did for keyAgreement.
   * @returns {Promise<{didDocument: object, keyPairs: Map}>}
   *   Resolves with the generated DID Document, along with the corresponding
   *   key pairs used to generate it (for storage in a KMS).
   */
  async _keyPairToDidDocument({keyPair, keyAgreementKeyPair} = {}) {
    const keyPairs = new Map();
    let didDocument;
    let publicDhKey;
    const contexts = [DID_CONTEXT_URL];
    if(!keyPair && keyAgreementKeyPair) {
      addKeyAgreementKeyContext({contexts, keyAgreementKeyPair});
      const did = getDid({keyPair: keyAgreementKeyPair});
      keyAgreementKeyPair.controller = did;
      setKeyPairId({keyPair: keyAgreementKeyPair, did});
      publicDhKey = await keyAgreementKeyPair.export({publicKey: true});
      keyPairs.set(keyAgreementKeyPair.id, keyAgreementKeyPair);
      didDocument = {
        '@context': contexts,
        id: did,
        keyAgreement: [publicDhKey]
      };
      return {didDocument, keyPairs};
    }
    let {publicKeyMultibase} = keyPair;
    if(!publicKeyMultibase && keyPair.publicKeyBase58) {
      // handle backwards compatibility w/older key pair interfaces
      publicKeyMultibase = await keyPair.fingerprint();
    }
    // get the multibaseMultikeyHeader from the public key value
    const multibaseMultikeyHeader = getMultibaseMultikeyHeader({
      value: publicKeyMultibase
    });
    const fromMultibase = this._allowedKeyTypes.get(multibaseMultikeyHeader);
    if(!fromMultibase) {
      throw new Error(
        `Unsupported "multibaseMultikeyHeader", "${multibaseMultikeyHeader}".`);
    }
    const verificationKeyPair = await fromMultibase({publicKeyMultibase});

    const did = getDid({keyPair: verificationKeyPair});
    verificationKeyPair.controller = did;
    // Now set the source key's id
    setKeyPairId({keyPair: verificationKeyPair, did});
    // get the public components of verification keypair
    const verificationPublicKey = await verificationKeyPair.export({
      publicKey: true,
      includeContext: true
    });
    contexts.push(verificationPublicKey['@context']);
    // delete context from verificationPublicKey
    delete verificationPublicKey['@context'];
    // get the keyAgreement keypair
    if(!keyAgreementKeyPair) {
      ({keyAgreementKeyPair} = await getKeyAgreementKeyPair({
        contexts, verificationPublicKey
      }));
    }

    // get the public components of keyAgreement keypair
    if(keyAgreementKeyPair) {
      addKeyAgreementKeyContext({contexts, keyAgreementKeyPair});
      const did = getDid({keyPair: keyAgreementKeyPair});
      if(!keyAgreementKeyPair.controller) {
        keyAgreementKeyPair.controller = did;
      }
      if(!keyAgreementKeyPair.id) {
        setKeyPairId({keyPair: keyAgreementKeyPair, did});
      }
      publicDhKey = await keyAgreementKeyPair.export({publicKey: true});
    }

    // Compose the DID Document
    didDocument = {
      // Note that did:key does not have its own method-specific context,
      // and only uses the general DID Core context, and key-specific contexts.
      '@context': contexts,
      id: did,
      verificationMethod: [verificationPublicKey],
      authentication: [verificationPublicKey.id],
      assertionMethod: [verificationPublicKey.id],
      capabilityDelegation: [verificationPublicKey.id],
      capabilityInvocation: [verificationPublicKey.id],
    };
    if(publicDhKey) {
      didDocument.keyAgreement = [publicDhKey];
    }
    // create the key pairs map
    keyPairs.set(verificationKeyPair.id, verificationKeyPair);
    if(keyAgreementKeyPair) {
      keyPairs.set(keyAgreementKeyPair.id, keyAgreementKeyPair);
    }

    return {didDocument, keyPairs};
  }

  /**
   * Computes and returns the id of a given key pair. Used by `did-io` drivers.
   *
   * @param {object} options - Options hashmap.
   * @param {object} options.keyPair - The key pair used when computing the
   *   identifier.
   *
   * @returns {string} Returns the key's id.
   */
  async computeId({keyPair}) {
    return `did:key:${keyPair.fingerprint()}#${keyPair.fingerprint()}`;
  }
}

/*!
 * Copyright (c) 2021-2023 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Helper method to match the `.driver()` API of other `did-io` plugins.
 *
 * @returns {DidKeyDriver} Returns an instance of a did:key resolver driver.
 */
function driver() {
  return new DidKeyDriver();
}

var base64url$3 = {exports: {}};

var base64url$2 = {};

var padString$1 = {};

Object.defineProperty(padString$1, "__esModule", { value: true });
function padString(input) {
    var segmentLength = 4;
    var stringLength = input.length;
    var diff = stringLength % segmentLength;
    if (!diff) {
        return input;
    }
    var position = stringLength;
    var padLength = segmentLength - diff;
    var paddedStringLength = stringLength + padLength;
    var buffer = Buffer.alloc(paddedStringLength);
    buffer.write(input);
    while (padLength--) {
        buffer.write("=", position++);
    }
    return buffer.toString();
}
padString$1.default = padString;

Object.defineProperty(base64url$2, "__esModule", { value: true });
var pad_string_1 = padString$1;
function encode$1(input, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    if (Buffer.isBuffer(input)) {
        return fromBase64(input.toString("base64"));
    }
    return fromBase64(Buffer.from(input, encoding).toString("base64"));
}
function decode$1(base64url, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    return Buffer.from(toBase64(base64url), "base64").toString(encoding);
}
function toBase64(base64url) {
    base64url = base64url.toString();
    return pad_string_1.default(base64url)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
}
function fromBase64(base64) {
    return base64
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
function toBuffer(base64url) {
    return Buffer.from(toBase64(base64url), "base64");
}
var base64url$1 = encode$1;
base64url$1.encode = encode$1;
base64url$1.decode = decode$1;
base64url$1.toBase64 = toBase64;
base64url$1.fromBase64 = fromBase64;
base64url$1.toBuffer = toBuffer;
base64url$2.default = base64url$1;

(function (module) {
	module.exports = base64url$2.default;
	module.exports.default = module.exports; 
} (base64url$3));

var base64urlExports = base64url$3.exports;
var base64url = /*@__PURE__*/getDefaultExportFromCjs(base64urlExports);

/*!
 * Copyright (c) 2018-2022 Digital Bazaar, Inc. All rights reserved.
 */

const encode = base64url.encode;
const decode = base64url.toBuffer;

/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * Asserts that key bytes have a type of Uint8Array and a specific length.
 *
 * @throws {TypeError|SyntaxError} - Throws a Type or Syntax error.
 *
 * @param {object} options - Options to use.
 * @param {Uint8Array} options.bytes - The bytes being checked.
 * @param {number} [options.expectedLength=32] - The expected bytes length.
 * @param {string} [options.code] - An optional code for the error.
 *
 * @returns {undefined} Returns on success throws on error.
 */
function assertKeyBytes({bytes, expectedLength = 32, code}) {
  if(!(bytes instanceof Uint8Array)) {
    throw new TypeError('"bytes" must be a Uint8Array.');
  }
  if(bytes.length !== expectedLength) {
    const error = new Error(
      `"bytes" must be a ${expectedLength}-byte Uint8Array.`);
    // we need DataError for invalid byte length
    error.name = 'DataError';
    // add the error code from the did:key spec if provided
    if(code) {
      error.code = code;
    }
    throw error;
  }
}

/*!
 * Copyright (c) 2020-2022 Digital Bazaar, Inc. All rights reserved.
 */

const randomBytesAsync = node_util.promisify(crypto$1.randomBytes);

// used to export node's public keys to buffers
const publicKeyEncoding = {format: 'der', type: 'spki'};
// used to turn private key bytes into a buffer in DER format
const DER_PRIVATE_KEY_PREFIX = Buffer.from(
  '302e020100300506032b657004220420', 'hex');
// used to turn public key bytes into a buffer in DER format
const DER_PUBLIC_KEY_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

const api = {
  /**
   * Generates a key using a 32 byte Uint8Array.
   *
   * @param {Uint8Array} seedBytes - The bytes for the private key.
   *
   * @returns {object} The object with the public and private key material.
  */
  async generateKeyPairFromSeed(seedBytes) {
    const privateKey = await crypto$1.createPrivateKey({
      // node is more than happy to create a new private key using a DER
      key: privateKeyDerEncode({seedBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    // this expects either a PEM encoded key or a node privateKeyObject
    const publicKey = await crypto$1.createPublicKey(privateKey);
    const publicKeyBuffer = publicKey.export(publicKeyEncoding);
    const publicKeyBytes = getKeyMaterial(publicKeyBuffer);
    return {
      publicKey: publicKeyBytes,
      secretKey: Buffer.concat([seedBytes, publicKeyBytes])
    };
  },
  // generates an ed25519 key using a random seed
  async generateKeyPair() {
    const seed = await randomBytesAsync(32);
    return api.generateKeyPairFromSeed(seed);
  },
  async sign(privateKeyBytes, data) {
    const privateKey = await crypto$1.createPrivateKey({
      key: privateKeyDerEncode({privateKeyBytes}),
      format: 'der',
      type: 'pkcs8'
    });
    return crypto$1.sign(null, data, privateKey);
  },
  async verify(publicKeyBytes, data, signature) {
    const publicKey = await crypto$1.createPublicKey({
      key: publicKeyDerEncode({publicKeyBytes}),
      format: 'der',
      type: 'spki'
    });
    return crypto$1.verify(null, data, publicKey, signature);
  },
  async sha256digest({data}) {
    return crypto$1.createHash('sha256').update(data).digest();
  }
};

/**
 * The key material is the part of the buffer after the DER Prefix.
 *
 * @param {Buffer} buffer - A DER encoded key buffer.
 *
 * @throws {Error} If the buffer does not contain a valid DER Prefix.
 *
 * @returns {Buffer} The key material part of the Buffer.
*/
function getKeyMaterial(buffer) {
  if(buffer.indexOf(DER_PUBLIC_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PUBLIC_KEY_PREFIX.length, buffer.length);
  }
  if(buffer.indexOf(DER_PRIVATE_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PRIVATE_KEY_PREFIX.length, buffer.length);
  }
  throw new Error('Expected Buffer to match Ed25519 Public or Private Prefix');
}

/**
 * Takes a Buffer or Uint8Array with the raw private key and encodes it
 * in DER-encoded PKCS#8 format.
 * Allows Uint8Arrays to be interoperable with node's crypto functions.
 *
 * @param {object} options - Options to use.
 * @param {Buffer} [options.privateKeyBytes] - Required if no seedBytes.
 * @param {Buffer} [options.seedBytes] - Required if no privateKeyBytes.
 *
 * @throws {TypeError} Throws if the supplied buffer is not of the right size
 *  or not a Uint8Array or Buffer.
 *
 * @returns {Buffer} DER private key prefix + key bytes.
*/
function privateKeyDerEncode({privateKeyBytes, seedBytes}) {
  if(!(privateKeyBytes || seedBytes)) {
    throw new TypeError('`privateKeyBytes` or `seedBytes` is required.');
  }
  if(!privateKeyBytes) {
    assertKeyBytes({
      bytes: seedBytes,
      expectedLength: 32
    });
  }
  if(!seedBytes) {
    assertKeyBytes({
      bytes: privateKeyBytes,
      expectedLength: 64
    });
  }
  let p;
  if(seedBytes) {
    p = seedBytes;
  } else {
    // extract the first 32 bytes of the 64 byte private key representation
    p = privateKeyBytes.slice(0, 32);
  }
  return Buffer.concat([DER_PRIVATE_KEY_PREFIX, p]);
}

/**
 * Takes a Uint8Array of public key bytes and encodes it in DER-encoded
 * SubjectPublicKeyInfo (SPKI) format.
 * Allows Uint8Arrays to be interoperable with node's crypto functions.
 *
 * @param {object} options - Options to use.
 * @param {Uint8Array} options.publicKeyBytes - The keyBytes.
 *
 * @throws {TypeError} Throws if the bytes are not Uint8Array or of length 32.
 *
 * @returns {Buffer} DER Public key Prefix + key bytes.
*/
function publicKeyDerEncode({publicKeyBytes}) {
  assertKeyBytes({
    bytes: publicKeyBytes,
    expectedLength: 32,
    code: 'invalidPublicKeyLength'
  });
  return Buffer.concat([DER_PUBLIC_KEY_PREFIX, publicKeyBytes]);
}

/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */

const SUITE_ID = 'Ed25519VerificationKey2020';
// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER = 'z';
// multicodec ed25519-pub header as varint
const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER = new Uint8Array([0x80, 0x26]);

class Ed25519VerificationKey2020 extends LDKeyPair {
  /**
   * An implementation of the Ed25519VerificationKey2020 spec, for use with
   * Linked Data Proofs.
   *
   * @see https://w3c-ccg.github.io/lds-ed25519-2020/#ed25519verificationkey2020
   * @see https://github.com/digitalbazaar/jsonld-signatures
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.controller - Controller DID or document url.
   * @param {string} [options.id] - The key ID. If not provided, will be
   *   composed of controller and key fingerprint as hash fragment.
   * @param {string} options.publicKeyMultibase - Multibase encoded public key
   *   with a multicodec ed25519-pub varint header [0xed, 0x01].
   * @param {string} [options.privateKeyMultibase] - Multibase private key
   *   with a multicodec ed25519-priv varint header [0x80, 0x26].
   * @param {string} [options.revoked] - Timestamp of when the key has been
   *   revoked, in RFC3339 format. If not present, the key itself is considered
   *   not revoked. Note that this mechanism is slightly different than DID
   *   Document key revocation, where a DID controller can revoke a key from
   *   that DID by removing it from the DID Document.
   */
  constructor(options = {}) {
    super(options);
    this.type = SUITE_ID;
    const {publicKeyMultibase, privateKeyMultibase} = options;

    if(!publicKeyMultibase) {
      throw new TypeError('The "publicKeyMultibase" property is required.');
    }

    if(!publicKeyMultibase || !_isValidKeyHeader(
      publicKeyMultibase, MULTICODEC_ED25519_PUB_HEADER)) {
      throw new Error(
        '"publicKeyMultibase" has invalid header bytes: ' +
        `"${publicKeyMultibase}".`);
    }

    if(privateKeyMultibase && !_isValidKeyHeader(
      privateKeyMultibase, MULTICODEC_ED25519_PRIV_HEADER)) {
      throw new Error('"privateKeyMultibase" has invalid header bytes.');
    }

    // assign valid key values
    this.publicKeyMultibase = publicKeyMultibase;
    this.privateKeyMultibase = privateKeyMultibase;

    // set key identifier if controller is provided
    if(this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
    // check that the passed in keyBytes are 32 bytes
    assertKeyBytes({
      bytes: this._publicKeyBuffer,
      code: 'invalidPublicKeyLength',
      expectedLength: 32
    });
  }

  /**
   * Creates an Ed25519 Key Pair from an existing serialized key pair.
   *
   * @param {object} options - Key pair options (see constructor).
   * @example
   * > const keyPair = await Ed25519VerificationKey2020.from({
   * controller: 'did:ex:1234',
   * type: 'Ed25519VerificationKey2020',
   * publicKeyMultibase,
   * privateKeyMultibase
   * });
   *
   * @returns {Promise<Ed25519VerificationKey2020>} An Ed25519 Key Pair.
   */
  static async from(options) {
    if(options.type === 'Ed25519VerificationKey2018') {
      return Ed25519VerificationKey2020.fromEd25519VerificationKey2018(options);
    }
    if(options.type === 'JsonWebKey2020') {
      return Ed25519VerificationKey2020.fromJsonWebKey2020(options);
    }
    return new Ed25519VerificationKey2020(options);
  }

  /**
   * Instance creation method for backwards compatibility with the
   * `Ed25519VerificationKey2018` key suite.
   *
   * @see https://github.com/digitalbazaar/ed25519-verification-key-2018
   * @typedef {object} Ed25519VerificationKey2018
   * @param {Ed25519VerificationKey2018} keyPair - Ed25519 2018 suite key pair.
   *
   * @returns {Ed25519VerificationKey2020} - 2020 suite instance.
   */
  static fromEd25519VerificationKey2018({keyPair} = {}) {
    const publicKeyMultibase = _encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER, decode$2(keyPair.publicKeyBase58));
    const keyPair2020 = new Ed25519VerificationKey2020({
      id: keyPair.id,
      controller: keyPair.controller,
      publicKeyMultibase
    });

    if(keyPair.privateKeyBase58) {
      keyPair2020.privateKeyMultibase = _encodeMbKey(
        MULTICODEC_ED25519_PRIV_HEADER,
        decode$2(keyPair.privateKeyBase58));
    }

    return keyPair2020;
  }

  /**
   * Creates a key pair instance (public key only) from a JsonWebKey2020
   * object.
   *
   * @see https://w3c-ccg.github.io/lds-jws2020/#json-web-key-2020
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.id - Key id.
   * @param {string} options.type - Key suite type.
   * @param {string} options.controller - Key controller.
   * @param {object} options.publicKeyJwk - JWK object.
   *
   * @returns {Promise<Ed25519VerificationKey2020>} Resolves with key pair.
   */
  static fromJsonWebKey2020({id, type, controller, publicKeyJwk} = {}) {
    if(type !== 'JsonWebKey2020') {
      throw new TypeError(`Invalid key type: "${type}".`);
    }
    if(!publicKeyJwk) {
      throw new TypeError('"publicKeyJwk" property is required.');
    }
    const {kty, crv} = publicKeyJwk;
    if(kty !== 'OKP') {
      throw new TypeError('"kty" is required to be "OKP".');
    }
    if(crv !== 'Ed25519') {
      throw new TypeError('"crv" is required to be "Ed25519".');
    }
    const {x: publicKeyBase64Url} = publicKeyJwk;
    const publicKeyMultibase = _encodeMbKey(
      MULTICODEC_ED25519_PUB_HEADER,
      decode(publicKeyBase64Url));

    return Ed25519VerificationKey2020.from({
      id, controller, publicKeyMultibase
    });
  }

  /**
   * Generates a KeyPair with an optional deterministic seed.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {Uint8Array} [options.seed] - A 32-byte array seed for a
   *   deterministic key.
   *
   * @returns {Promise<Ed25519VerificationKey2020>} Resolves with generated
   *   public/private key pair.
   */
  static async generate({seed, ...keyPairOptions} = {}) {
    let keyObject;
    if(seed) {
      keyObject = await api.generateKeyPairFromSeed(seed);
    } else {
      keyObject = await api.generateKeyPair();
    }
    const publicKeyMultibase =
      _encodeMbKey(MULTICODEC_ED25519_PUB_HEADER, keyObject.publicKey);

    const privateKeyMultibase =
      _encodeMbKey(MULTICODEC_ED25519_PRIV_HEADER, keyObject.secretKey);

    return new Ed25519VerificationKey2020({
      publicKeyMultibase,
      privateKeyMultibase,
      ...keyPairOptions
    });
  }

  /**
   * Creates an instance of Ed25519VerificationKey2020 from a key fingerprint.
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.fingerprint - Multibase encoded key fingerprint.
   *
   * @returns {Ed25519VerificationKey2020} Returns key pair instance (with
   *   public key only).
   */
  static fromFingerprint({fingerprint} = {}) {
    return new Ed25519VerificationKey2020({publicKeyMultibase: fingerprint});
  }

  /**
   * @returns {Uint8Array} Public key bytes.
   */
  get _publicKeyBuffer() {
    if(!this.publicKeyMultibase) {
      return;
    }
    // remove multibase header
    const publicKeyMulticodec =
      decode$2(this.publicKeyMultibase.substr(1));
    // remove multicodec header
    const publicKeyBytes =
      publicKeyMulticodec.slice(MULTICODEC_ED25519_PUB_HEADER.length);

    return publicKeyBytes;
  }

  /**
   * @returns {Uint8Array} Private key bytes.
   */
  get _privateKeyBuffer() {
    if(!this.privateKeyMultibase) {
      return;
    }
    // remove multibase header
    const privateKeyMulticodec =
      decode$2(this.privateKeyMultibase.substr(1));
    // remove multicodec header
    const privateKeyBytes =
      privateKeyMulticodec.slice(MULTICODEC_ED25519_PRIV_HEADER.length);

    return privateKeyBytes;
  }

  /**
   * Generates and returns a multiformats encoded
   * ed25519 public key fingerprint (for use with cryptonyms, for example).
   *
   * @see https://github.com/multiformats/multicodec
   *
   * @returns {string} The fingerprint.
   */
  fingerprint() {
    return this.publicKeyMultibase;
  }

  /**
   * Exports the serialized representation of the KeyPair
   * and other information that JSON-LD Signatures can use to form a proof.
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Export public key material?
   * @param {boolean} [options.privateKey] - Export private key material?
   * @param {boolean} [options.includeContext] - Include JSON-LD context?
   *
   * @returns {object} A plain js object that's ready for serialization
   *   (to JSON, etc), for use in DIDs, Linked Data Proofs, etc.
   */
  export({publicKey = false, privateKey = false, includeContext = false} = {}) {
    if(!(publicKey || privateKey)) {
      throw new TypeError(
        'Export requires specifying either "publicKey" or "privateKey".');
    }
    const exportedKey = {
      id: this.id,
      type: this.type
    };
    if(includeContext) {
      exportedKey['@context'] = Ed25519VerificationKey2020.SUITE_CONTEXT;
    }
    if(this.controller) {
      exportedKey.controller = this.controller;
    }
    if(publicKey) {
      exportedKey.publicKeyMultibase = this.publicKeyMultibase;
    }
    if(privateKey) {
      exportedKey.privateKeyMultibase = this.privateKeyMultibase;
    }
    if(this.revoked) {
      exportedKey.revoked = this.revoked;
    }
    return exportedKey;
  }

  /**
   * Returns the JWK representation of this key pair.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc8037
   *
   * @param {object} [options={}] - Options hashmap.
   * @param {boolean} [options.publicKey] - Include public key?
   * @param {boolean} [options.privateKey] - Include private key?
   *
   * @returns {{kty: string, crv: string, x: string, d: string}} JWK
   *   representation.
   */
  toJwk({publicKey = true, privateKey = false} = {}) {
    if(!(publicKey || privateKey)) {
      throw TypeError('Either a "publicKey" or a "privateKey" is required.');
    }
    const jwk = {crv: 'Ed25519', kty: 'OKP'};
    if(publicKey) {
      jwk.x = encode(this._publicKeyBuffer);
    }
    if(privateKey) {
      jwk.d = encode(this._privateKeyBuffer);
    }
    return jwk;
  }

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc8037#appendix-A.3
   *
   * @returns {Promise<string>} JWK Thumbprint.
   */
  async jwkThumbprint() {
    const publicKey = encode(this._publicKeyBuffer);
    const serialized = `{"crv":"Ed25519","kty":"OKP","x":"${publicKey}"}`;
    const data = new TextEncoder().encode(serialized);
    return encode(
      new Uint8Array(await api.sha256digest({data})));
  }

  /**
   * Returns the JsonWebKey2020 representation of this key pair.
   *
   * @see https://w3c-ccg.github.io/lds-jws2020/#json-web-key-2020
   *
   * @returns {Promise<object>} JsonWebKey2020 representation.
   */
  async toJsonWebKey2020() {
    return {
      '@context': 'https://w3id.org/security/jws/v1',
      id: this.controller + '#' + await this.jwkThumbprint(),
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyJwk: this.toJwk({publicKey: true})
    };
  }

  /**
   * Tests whether the fingerprint was generated from a given key pair.
   *
   * @example
   * > edKeyPair.verifyFingerprint({fingerprint: 'z6Mk2S2Q...6MkaFJewa'});
   * {valid: true};
   *
   * @param {object} options - Options hashmap.
   * @param {string} options.fingerprint - A public key fingerprint.
   *
   * @returns {{valid: boolean, error: *}} Result of verification.
   */
  verifyFingerprint({fingerprint} = {}) {
    // fingerprint should have multibase base58-btc header
    if(!(typeof fingerprint === 'string' &&
      fingerprint[0] === MULTIBASE_BASE58BTC_HEADER)) {
      return {
        error: new Error('"fingerprint" must be a multibase encoded string.'),
        valid: false
      };
    }
    let fingerprintBuffer;
    try {
      fingerprintBuffer = decode$2(fingerprint.substr(1));
      if(!fingerprintBuffer) {
        throw new TypeError('Invalid encoding of fingerprint.');
      }
    } catch(e) {
      return {error: e, valid: false};
    }

    const buffersEqual = _isEqualBuffer(this._publicKeyBuffer,
      fingerprintBuffer.slice(2));

    // validate the first two multicodec bytes
    const valid =
      fingerprintBuffer[0] === MULTICODEC_ED25519_PUB_HEADER[0] &&
      fingerprintBuffer[1] === MULTICODEC_ED25519_PUB_HEADER[1] &&
      buffersEqual;
    if(!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false
      };
    }
    return {valid};
  }

  signer() {
    const privateKeyBuffer = this._privateKeyBuffer;

    return {
      async sign({data}) {
        if(!privateKeyBuffer) {
          throw new Error('A private key is not available for signing.');
        }
        return api.sign(privateKeyBuffer, data);
      },
      id: this.id
    };
  }

  verifier() {
    const publicKeyBuffer = this._publicKeyBuffer;

    return {
      async verify({data, signature}) {
        if(!publicKeyBuffer) {
          throw new Error('A public key is not available for verifying.');
        }
        return api.verify(publicKeyBuffer, data, signature);
      },
      id: this.id
    };
  }
}
// Used by CryptoLD harness for dispatching.
Ed25519VerificationKey2020.suite = SUITE_ID;
// Used by CryptoLD harness's fromKeyId() method.
Ed25519VerificationKey2020.SUITE_CONTEXT =
  'https://w3id.org/security/suites/ed25519-2020/v1';

// check to ensure that two buffers are byte-for-byte equal
// WARNING: this function must only be used to check public information as
//          timing attacks can be used for non-constant time checks on
//          secret information.
function _isEqualBuffer(buf1, buf2) {
  if(buf1.length !== buf2.length) {
    return false;
  }
  for(let i = 0; i < buf1.length; i++) {
    if(buf1[i] !== buf2[i]) {
      return false;
    }
  }
  return true;
}

// check a multibase key for an expected header
function _isValidKeyHeader(multibaseKey, expectedHeader) {
  if(!(typeof multibaseKey === 'string' &&
    multibaseKey[0] === MULTIBASE_BASE58BTC_HEADER)) {
    return false;
  }

  const keyBytes = decode$2(multibaseKey.slice(1));
  return expectedHeader.every((val, i) => keyBytes[i] === val);
}

// encode a multibase base58-btc multicodec key
function _encodeMbKey(header, key) {
  const mbKey = new Uint8Array(header.length + key.length);

  mbKey.set(header);
  mbKey.set(key, header.length);

  return MULTIBASE_BASE58BTC_HEADER + encode$2(mbKey);
}

const serializedKeyPair = {
  id: undefined,
  type: 'Ed25519VerificationKey2020',
  publicKeyMultibase: 'z6MkfDvsiwx8ddaUitBuwxn8fCfyMZkK7ipQanMVS1FqvchE',
  privateKeyMultibase: 'zrv4A1PuCKJseb95jLWFkiBQX1QkkvfX9rZXP1nXZ3V53yZT3Yze18MfaQpzmrNXm1mbdFKSXdSTFGMbyPsHjFgXMZa'
};

const didKeyDriver = driver();
didKeyDriver.use({
  multibaseMultikeyHeader: "z6Mk",
  fromMultibase: Ed25519VerificationKey2020.from,
});


const getDIDKey = async () => {
  const keyPair = await Ed25519VerificationKey2020.from(serializedKeyPair);
  
  return await didKeyDriver.fromKeyPair({
    verificationKeyPair: keyPair,
  });
};

const sign = async (rawData) => {
  const keyPair = await Ed25519VerificationKey2020.from(serializedKeyPair);
  const { sign } = keyPair.signer();

  // data is a Uint8Array of bytes
  const data = (new TextEncoder()).encode(rawData);
  // Signing also outputs a Uint8Array, which you can serialize to text etc.
  return Buffer.from(await sign({data})).toString("base64url");
};

const generateKP = async () => {
  
  const keyPair = await Ed25519VerificationKey2020.generate();

  return await keyPair.export({publicKey: true, privateKey: true});};

exports.generateKP = generateKP;
exports.getDIDKey = getDIDKey;
exports.sign = sign;
