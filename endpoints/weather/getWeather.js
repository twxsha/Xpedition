'use server';

const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * Uses OpenAI function call to generate weather for given trip prompt in a structured JSON format
 * @param {*} initial_prompt Initial trip prompt provided by the user
 * @returns A JSON object with keys that indicate the high, average, and low weather conditions for the given prompt
 */
const getWeather = async (initial_prompt) => {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, return the weather conditions for this trip."
            },
            {
                role: "user", 
                content: "Return the weather conditons for this prompt " + initial_prompt
            }
        ],
        functions: [
            {
                name: "returnWeather",
                parameters: {
                    type: "object",
                    properties: {
                        high: {
                            type: "string",
                            description: "Highest temperature during the stay which includes Farenheit and Celsius. Format: #°F/#°C"
                        },
                        average: {
                            type: "string",
                            description: "Average temperature during the stay which includes Farenheit and Celsius. Format: #°F/#°C"
                        },
                        low: {
                            type: "string",
                            description: "Lowest temperature during the stay which includes Farenheit and Celsius. Format: #°F/#°C"
                        }
                    },
                    required: ["high, average, low"]
                }
            }
        ],
        function_call: { name: "returnWeather" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;
    const weather = functionCall['arguments'];
    
    return JSON.parse(weather);
}

export default getWeather;