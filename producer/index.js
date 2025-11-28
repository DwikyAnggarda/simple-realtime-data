const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "producer-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function run() {
    await producer.connect();

    console.log("Producer started...");

    // helper for random range (supports float)
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // publish engine RPM (fast)
    setInterval(async () => {
        const msg = { sensor: "engine_rpm", value: Math.floor(rand(800, 2200)), ts: Date.now(), topic: "rpm", payload: JSON.stringify({ rpm: Math.floor(rand(800, 2200)) }) };
        await producer.send({
            topic: "activity-log",
            messages: [{ value: JSON.stringify(msg) }],
        });
        console.log(`[engine_rpm] value=${msg.value} ts=${msg.ts}`);
    }, 500); // tiap 0.5s

    // publish GPS (slower)
    setInterval(async () => {
        const msg = { sensor: "gps", lat: -7.276 + rand(-0.001, 0.001), lon: 112.79 + rand(-0.001, 0.001), ts: Date.now(), topic: "gps", payload: JSON.stringify({ lat: -7.276 + rand(-0.001, 0.001), lon: 112.79 + rand(-0.001, 0.001) }) };
        await producer.send({
            topic: "activity-log",
            messages: [{ value: JSON.stringify(msg) }],
        });
        console.log(`[gps] lat=${msg.lat.toFixed(6)} lon=${msg.lon.toFixed(6)} ts=${msg.ts}`);
    }, 2000); // tiap 2s

    // temperature
    setInterval(async () => {
        const msg = { sensor: "temp", value: Number(rand(20, 45).toFixed(2)), ts: Date.now(), topic: "temp", payload: JSON.stringify({ value: Number(rand(20, 45).toFixed(2)) }) };
        await producer.send({
            topic: "activity-log",
            messages: [{ value: JSON.stringify(msg) }],
        });
        console.log(`[temp] value=${msg.value}°C ts=${msg.ts}`);
    }, 1000); // tiap 1s
}

run().catch(console.error);
