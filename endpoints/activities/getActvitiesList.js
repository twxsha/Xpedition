'use server';

const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * Uses OpenAI function call to generate a list of activities for given trip prompt in a structured JSON format
 * @param {*} initial_prompt Initial trip prompt provided by the user
 * @returns A list of activities in a JSON object for the given prompt
 */
const getActivitiesList = async (initial_prompt) => {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a activity list for this trip. Add emojis for each activity."
            },
            {
                role: "user", 
                content: "Create a activity list for this prompt " + initial_prompt
            }
        ],
        functions: [
            {
                name: "createActivitiesList",
                parameters: {
                    type: "object",
                    properties: {
                        activities_list: {
                            type: "array",
                            items: { type: "string" },
                            description: "An array of actvities to do during the trip"
                        }
                    },
                    required: ["activities_list"]
                }
            }
        ],
        function_call: { name: "createActivitiesList" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;
    const activities_list = functionCall['arguments'];
    
    return JSON.parse(activities_list);
}

export default getActivitiesList;