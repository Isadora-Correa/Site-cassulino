function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function buildMockReadings(totalPoints = 30) {
  return Array.from({ length: totalPoints }, (_, index) => {
    const sample = index + 1;
    const angle = sample / 3.8;
    const drift = totalPoints - sample;
    const timestamp = new Date(Date.now() - drift * 5 * 60 * 1000);

    const temperature = clamp(24 + Math.sin(angle) * 3.6 + (sample % 11 === 0 ? 4.5 : 0), 16, 37);
    const humidity = clamp(58 + Math.cos(angle / 1.3) * 10 - (sample % 10 === 0 ? 8 : 0), 32, 86);
    const co2 = clamp(540 + Math.sin(angle / 1.7) * 150 + (sample % 13 === 0 ? 420 : 0), 360, 1500);
    const luminosity = clamp(620 + Math.cos(angle / 1.9) * 220 - (sample % 9 === 0 ? 280 : 0), 60, 1100);

    return {
      id: `reading-${sample}`,
      timestamp: timestamp.toISOString(),
      time: timestamp.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: Number(temperature.toFixed(1)),
      humidity: Number(humidity.toFixed(1)),
      co2: Math.round(co2),
      luminosity: Math.round(luminosity),
    };
  });
}
