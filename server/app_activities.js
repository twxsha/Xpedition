const { OpenAI } = require("openai");
require('dotenv').config()

const openai = new OpenAI();

async function retrieveActivitiesList() {
    initial_prompt = "Help me plan a trip for Stuttgart, Germany. I have 7 adult travelers for March 27 to March 29"
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a activity list for this trip"
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

    console.log(functionCall);
    return functionCall;
}

retrieveActivitiesList();
