const { OpenAI } = require("openai");
require('dotenv').config()

const openai = new OpenAI();

async function retrievePackingList() {
    initial_prompt = "Help me plan a trip for Stuttgart, Germany. I have 7 adult travelers for March 27 to March 29"
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a packing list for this trip. Please return items with emojis and limit the output to 25 items"
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

    console.log(functionCall['arguments']);
    return functionCall['arguments'];
}

retrievePackingList();
