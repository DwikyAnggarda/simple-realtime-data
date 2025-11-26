# Simple Real-Time Data Pipeline

Workshop tentang **Arsitektur Real-Time Data Pipeline untuk Aplikasi Skala Besar dan IoT**.

## 📋 Overview

Repository ini berisi implementasi sederhana dari arsitektur data pipeline real-time yang mampu menangani ribuan request per detik. Cocok untuk:
- Aplikasi web dengan traffic tinggi
- Sistem logging aktivitas user
- IoT sensor data ingestion
- Event streaming architecture

## 🏗️ Arsitektur

```
[Sensor/Client] → [API Gateway] → [Message Broker] → [Worker Service] → [PostgreSQL]
                                                                      ↓
                                                              [Dashboard/Analytics]
```

### Komponen Utama:
1. **API Gateway** - REST API untuk menerima data (Express/Laravel)
2. **Message Broker** - Queue system untuk menghindari bottleneck (Redis)
3. **Worker Service** - Background processor untuk validasi & penyimpanan
4. **PostgreSQL** - Database dengan indexing optimal
5. **Dashboard** - Visualisasi data (Metabase/Grafana - opsional)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Postman (untuk testing)
- Node.js/Python (untuk simulator)

## 🔑 Key Concepts

- **Throughput vs Latency** - Trade-off performa pipeline
- **Backpressure** - Handling overload dengan queue
- **Horizontal Scaling** - Menambah worker untuk throughput lebih tinggi
- **Error Recovery** - Retry pattern & circuit breaker
- **Data Indexing** - Optimasi query untuk data besar

## 📚 Learning Path

1. Pahami konsep message broker vs direct DB write
2. Pelajari pattern producer-consumer
3. Eksplorasi indexing strategy di PostgreSQL
4. Praktik error handling & observability
5. Study case: IoT, logging, analytics pipeline

## 🌐 Cloud Mapping

Arsitektur lokal ini bisa di-map ke cloud services:
- **API Gateway** → AWS API Gateway, GCP Cloud Run
- **Redis** → AWS ElastiCache, GCP Memorystore
- **Kafka** → AWS MSK, Confluent Cloud
- **PostgreSQL** → AWS RDS, GCP Cloud SQL
- **Worker** → AWS Lambda, GCP Cloud Functions

## ⚠️ Notes

- Repository ini untuk tujuan pembelajaran
- Fokus pada konsep, bukan production-grade implementation
- IoT disimulasikan via script, tidak perlu hardware fisik
