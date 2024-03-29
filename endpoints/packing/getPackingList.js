'use server';

const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * Uses OpenAI function call to generate a packing list for given trip prompt in a structured JSON format
 * @param {*} initial_prompt Initial trip prompt provided by the user
 * @returns A packing list in a JSON object for the given prompt
 */
const getPackingList = async (initial_prompt) => {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a packing list for this location considering climate. Please return items with emojis if applicable and limit the output to 25 items"
            },
            {
                role: "user", 
                content: "Create a packing list for this prompt " + initial_prompt
            }
        ],
        functions: [
            {
                name: "createPackingList",
                parameters: {
                    type: "object",
                    properties: {
                        packing_list: {
                            type: "array",
                            items: { type: "string" },
                            description: "An array of items (including emojis for these items) in a packing list"
                        }
                    },
                    required: ["packing_list"]
                }
            }
        ],
        function_call: { name: "createPackingList" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;
    const packing_list = functionCall['arguments'];
    
    return JSON.parse(packing_list);
}

export default getPackingList;