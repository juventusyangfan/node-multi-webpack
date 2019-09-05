const Redis = require("ioredis");
const Store = require("./store");

class RedisStore extends Store {
    constructor(opts) {
        super();
        this.redis = new Redis({
            port: opts.redis.post,
            host: opts.redis.host,
            family: 4,
            password: '',
            db: 0
        });
    }

    async get(sid) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(externalKey, session, opts) {
        if (!opts.sid) {
            if (externalKey) {
                opts.sid = externalKey;
            }
            else {
                opts.sid = this.getID(24);
            }
        }
        let expire = 24 * 60 * 1000;
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session), 'EX', expire);
        return opts.sid;
    }

    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}

module.exports = RedisStore;