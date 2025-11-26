const { Kafka } = require("kafkajs");
const { Client } = require("pg");

const kafka = new Kafka({
    clientId: "consumer-app",
    brokers: ["localhost:9092"],
});

const client = new Client({
    host: "localhost",
    port: 5300,
    user: "admin",
    password: "admin",
    database: "pipeline",
});

async function start() {
    await client.connect();

    await client.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id SERIAL PRIMARY KEY,
      user_id INT,
      activity VARCHAR(50),
      timestamp TIMESTAMP
    );
  `);

    const consumer = kafka.consumer({ groupId: "group-1" });
    await consumer.connect();
    await consumer.subscribe({ topic: "activity-log" });

    // Buffer untuk 50 pesan
    const buffer = [];
    const batchSize = 50;

    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());
            buffer.push(data);

            console.log("Received:", data);

            if (buffer.length >= batchSize) {
                const insertQuery = `
                INSERT INTO activity_logs (user_id, activity, timestamp)
                VALUES 
                ${buffer.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(",")}
            `;

                const values = buffer.flatMap((d) => [
                    d.userId,
                    d.activity,
                    d.timestamp,
                ]);

                await client.query(insertQuery, values);
                console.log(`Inserted batch of ${buffer.length} rows`);

                buffer.length = 0; // clear buffer
            }
        },
    });
}

start().catch(console.error);
