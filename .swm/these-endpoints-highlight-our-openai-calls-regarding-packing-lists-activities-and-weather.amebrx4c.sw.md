---
title: >-
  These Endpoints highlight our OpenAI calls regarding packing lists,
  activities, and weather.
---
<SwmSnippet path="/endpoints/packing/getPackingList.js" line="1">

---

/This code snippet defines a function `getPackingList` that uses the OpenAI API to generate a packing list for a given trip prompt. It sends a chat completion request to the `gpt-4-turbo-preview` model and provides a system message and a user message as input. The response from the API is parsed to extract the packing list, which is returned as a JSON object.

```javascript
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
```

---

</SwmSnippet>

<SwmSnippet path="/endpoints/activities/getActvitiesList.js" line="1">

---

This code snippet is a function that uses the OpenAI API to generate a list of activities for a given trip prompt. It sends a chat completion request to the OpenAI API with a system message and a user message containing the prompt. The API response includes a JSON object with the generated activities list. The function then parses the activities list from the API response and returns it as a JSON object.

```javascript
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
```

---

</SwmSnippet>

<SwmSnippet path="/endpoints/weather/getWeather.js" line="1">

---

This code snippet uses the OpenAI API to generate weather conditions for a given trip prompt. It initializes the OpenAI client using the API key, and defines a function `getWeather` that takes an initial trip prompt as input. Within this function, it makes a chat completion request to the GPT-4 Turbo model, providing a system message and a user message with the prompt. It also includes a custom function called `returnWeather` that defines the expected structure of the weather data. The code then makes the function call and assigns the response to `functionCall`.

```javascript
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
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBWHBlZGl0aW9uJTNBJTNBdHd4c2hh" repo-name="Xpedition"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
