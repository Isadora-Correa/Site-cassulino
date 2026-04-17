#include <WiFi.h>
#include <PubSubClient.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";
const char* MQTT_HOST = "broker.hivemq.com";
const int MQTT_PORT = 1883;
const char* MQTT_TOPIC = "greenhouse/sensors";

WiFiClient espClient;
PubSubClient mqtt(espClient);

float readTemperature() {
  return 24.0 + random(-30, 35) / 10.0;
}

float readHumidity() {
  return 58.0 + random(-100, 100) / 10.0;
}

int readCo2() {
  return 550 + random(-80, 220);
}

int readLuminosity() {
  return 650 + random(-200, 250);
}

void connectWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

void connectMqtt() {
  while (!mqtt.connected()) {
    String clientId = "esp32-greenhouse-" + String(random(1000, 9999));
    mqtt.connect(clientId.c_str());
    delay(300);
  }
}

void setup() {
  Serial.begin(115200);
  randomSeed(analogRead(0));
  connectWifi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
  }

  if (!mqtt.connected()) {
    connectMqtt();
  }

  mqtt.loop();

  float temperature = readTemperature();
  float humidity = readHumidity();
  int co2 = readCo2();
  int luminosity = readLuminosity();

  String payload = "{";
  payload += "\"deviceId\":\"esp32-greenhouse-01\",";
  payload += "\"temperature\":" + String(temperature, 1) + ",";
  payload += "\"humidity\":" + String(humidity, 1) + ",";
  payload += "\"co2\":" + String(co2) + ",";
  payload += "\"luminosity\":" + String(luminosity) + ",";
  payload += "\"timestamp\":\"" + String(millis()) + "\"";
  payload += "}";

  mqtt.publish(MQTT_TOPIC, payload.c_str());
  Serial.println(payload);

  delay(5000);
}
