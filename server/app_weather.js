const { OpenAI } = require("openai");
require('dotenv').config()

const openai = new OpenAI();

async function retrieveWeather() {
    initial_prompt = "Help me plan a trip to Korea from July 25 to August 10"
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
                            description: "Highest temperature during the stay which includes Farenheit and Celsius"
                        },
                        average: {
                            type: "string",
                            description: "Average temperature during the stay which includes Farenheit and Celsius"
                        },
                        low: {
                            type: "string",
                            description: "Lowest temperature during the stay which includes Farenheit and Celsius"
                        }
                    },
                    required: ["high, average, low"]
                }
            }
        ],
        function_call: { name: "returnWeather" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;

    console.log(functionCall);
    return functionCall;
}

retrieveWeather();
