const { Task } = require("klasa");

module.exports = class MemorySweeper extends Task {

    async run() {
        if (!this.client.ready || !this.client.lavalink) return;
        let [users, guilds, vc] = [0, 0, 0];
        const results = await this.client.shard.broadcastEval(`[this.guilds.reduce((prev, val) => val.memberCount + prev, 0), this.guilds.size, this.lavalink.map(u => u).filter(p => p.playing).length]`);

        for (const result of results) {
            users += result[0];
            guilds += result[1];
            vc += result[2];
        }

        this.client.dogstats.gauge("pengubot.totalcommands", this.client.settings.counter.total);
        this.client.dogstats.gauge("pengubot.users", users);
        this.client.dogstats.gauge("pengubot.guilds", guilds);
        this.client.dogstats.gauge("pengubot.voicestreams", vc);
        return;
    }

    async init() {
        if (this.client.user.id !== "303181184718995457" || this.client.shard.id !== 0) return this.disable();
        if (!this.client.settings.schedules.some(schedule => schedule.taskName === this.name)) {
            await this.client.schedule.create("datadog", "*/1 * * * *");
        }
    }

};
