const { Kafka } = require("kafkajs");
const { Client } = require("pg");

const kafka = new Kafka({ clientId: "consumer-app", brokers: ["localhost:9092"] });
const clientPG = new Client({ host: "localhost", port: 5300, user: "admin", password: "admin", database: "pipeline" });

async function start() {
    await clientPG.connect();
    await clientPG.query(`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id SERIAL PRIMARY KEY,
      topic TEXT,
      payload JSONB,
      ts BIGINT,
      created_at TIMESTAMP DEFAULT NOW()
    );`);

    const consumer = kafka.consumer({ groupId: "group-1" });
    await consumer.connect();
    await consumer.subscribe({ topic: "activity-log", fromBeginning: false });

    const buffer = [];
    const BATCH_SIZE = 4;

    await consumer.run({
        eachMessage: async ({ message }) => {
            const obj = JSON.parse(message.value.toString());
            buffer.push([obj.topic, obj.payload ? JSON.parse(obj.payload) : null, obj.ts || Date.now()]);
            if (buffer.length >= BATCH_SIZE) {
                const valuesSQL = buffer.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(",");
                const flat = buffer.flat();
                await clientPG.query(
                    `INSERT INTO sensor_readings (topic, payload, ts) VALUES ${valuesSQL}`,
                    flat
                );
                console.log(`Inserted ${buffer.length} rows`);
                buffer.length = 0;
            }
        }
    });
}

start().catch(console.error);