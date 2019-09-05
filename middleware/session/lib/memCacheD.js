const Memcached = require("memcached");
const Store = require("./store");


class MemcachedStore extends Store {
    constructor(opts) {
        super();
        this.memcached = new Memcached(`${opts.memcached.host}:${opts.memcached.post}`, {debug: true});
    }

    get(sid) {
        let memcached = this.memcached
        return new Promise((resolve, reject) => {
            memcached.get(`${sid}`, function (error, ok) {
                if (typeof ok != "undefined") {
                    resolve(JSON.parse(ok));
                }
                else {
                    resolve(null)
                }
            });
        });
    }

    async set(externalKey, session, opts) {
        opts.sid = externalKey;

        let expire = 60 * 24; //sec
        await this.memcached.set(`${opts.sid}`, JSON.stringify(session), expire, function (error, ok) {
            ok
        });
        return opts.sid;
    }

    async destroy(sid) {
        return await this.memcached.set(`${sid}`, null);
    }
}

module.exports = MemcachedStore;