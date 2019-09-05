"use strict"

const uid = require("uid-safe");

class Store {
    /**
     * context store constructor
     * @api public
     */
    constructor() {
        this.session = {};
    }
    /**
     * Decode the base64 cookie value to an object.
     *
     * @param {String} string
     * @return {Object}
     * @api private
     */
    decode(string) {
        if(!string) return "";

        let session = "";

        try{
            //存在session
            session = new Buffer(string, "base64").toString();
        } catch(e) {}

        return JSON.parse(session);
    }
    /**
     * Encode an object into a base64-encoded JSON string.
     *
     * @param {Object} body
     * @return {String}
     * @api private
     */
    encode(obj) {
        //滚成buffer
        return new Buffer(obj).toString("base64");
    }

    getID(length) {
        //获得Uid
        return uid.sync(length);
    }
    /**
     * internal logic of `ctx.session`
     * @return {Session} session object
     *
     * @api public
     */
    get(sid) {
        return Promise.resolve(this.decode(this.session[sid]));
    }
    /**
     * internal logic of `ctx.session=`
     * @param {Object} val session object
     *
     * @api public
     */
    set(session, opts) {
        opts = opts || {};
        let sid = opts.sid;
        if(!sid) {
            //Uid
            sid = this.getID(24);
        }

        this.session[sid] = this.encode(JSON.stringify(session));

        return Promise.resolve(sid);
    }

    destroy(sid) {
        delete this.session[sid];
        return Promise.resolve();
    }
}

module.exports = Store;