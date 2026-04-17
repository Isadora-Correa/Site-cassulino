CREATE DATABASE IF NOT EXISTS iot_pipeline;
USE iot_pipeline;

CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  recorded_at DATETIME NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  co2 INT NOT NULL,
  luminosity INT NOT NULL,
  classification ENUM('normal', 'alerta', 'critico') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hourly_aggregates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) NOT NULL,
  bucket_start DATETIME NOT NULL,
  avg_temperature DECIMAL(5,2) NOT NULL,
  avg_humidity DECIMAL(5,2) NOT NULL,
  avg_co2 DECIMAL(8,2) NOT NULL,
  avg_luminosity DECIMAL(8,2) NOT NULL,
  anomaly_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
