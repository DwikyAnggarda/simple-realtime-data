const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "producer-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function run() {
    await producer.connect();

    let totalSent = 0;
    const TARGET = 1000;

    setInterval(async () => {
        if (totalSent >= TARGET) {
            console.log("Done, stopping producer.");
            process.exit(0);
        }

        const batch = [];
        for (let i = 0; i < 100; i++) {
            batch.push({
                value: JSON.stringify({
                    userId: Math.floor(Math.random() * 1000),
                    activity: "click",
                    timestamp: new Date().toISOString(),
                }),
            });
        }

        await producer.send({ topic: "activity-log", messages: batch });

        totalSent += batch.length;
        console.log(`Sent batch of ${batch.length} messages. Total: ${totalSent}`);
    }, 2000); // setiap 2 detik
}

run().catch(console.error);
