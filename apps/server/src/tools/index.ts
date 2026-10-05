import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get the current weather for a city",
  inputSchema: z.object({
    city: z.string().describe("City name, e.g. Karachi"),
  }),
  execute: async ({ city }) => {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    ).then((r) => r.json<any>());

    const place = geo.results?.[0];
    if (!place) throw new Error(`City not found: ${city}`);

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m`
    ).then((r) => r.json<any>());

    return {
      city: place.name,
      country: place.country,
      temperatureC: weather.current.temperature_2m,
      windKmh: weather.current.wind_speed_10m,
    };
  },
});

export const calculate = tool({
  description: "Add, subtract, multiply or divide two numbers",
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
    op: z.enum(["add", "subtract", "multiply", "divide"]),
  }),
  execute: async ({ a, b, op }) => {
    const result = { add: a + b, subtract: a - b, multiply: a * b, divide: a / b }[op];
    return { result };
  },
});

// Add new tools here, nothing else needs to change
export const tools = { getWeather, calculate };