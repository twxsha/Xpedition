---
title: This is our hotel retrieval API that connects to OpenAI and SerpAPI
---
# Introduction

This document will walk you through the implementation of the hotel retrieval API feature. This feature connects to OpenAI and SerpAPI to retrieve hotel options based on user prompts.

We will cover:

1. How we use OpenAI to generate structured parameters for SerpAPI.


1. How we format the OpenAI response into parameters for the SerpAPI hotels call.


1. How we execute a feedback loop between SerpAPI and OpenAI to get the best hotels API response.


1. How we retrieve the SerpAPI hotel results using the prompt and summarize the data to return to the frontend.

# Using OpenAI to generate structured parameters for SerpAPI

<SwmSnippet path="/endpoints/hotels/getHotelOptions.js" line="1">

---

The first part of our implementation involves using OpenAI to generate structured parameters for SerpAPI. This is done in the create_hotel_request_parameters function. We use the OpenAI chat completions API to generate a response based on a user prompt and a system message. The system message instructs the AI to create a new hotel itinerary based on the user's prompt. The AI's response is then formatted into a function call that can be used as parameters for the SerpAPI call.

```javascript
'use server';

const { OpenAI } = require("openai");
const { getJson } = require("serpapi");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * uses OpenAI function call to give structured parameters to use for SerpAPI
 * @param {*} initial_prompt Initial user prompt for their prompt
 * @param {*} err Error string if SERP call failed
 * @returns Chat GPT function call response in format of SerpAPI paramters
 */
async function create_hotel_request_parameters(initial_prompt, err = "") {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a new hotel itinerary. Fill in as much as possible and for any items that you can't fill, fill it with any realistic sample information. FYI the year is 2024, and all dates must be in the future. The number of children_ages should match the number of children."
            },
            {
                role: "user",
                content: "Create an itinerary for this prompt " + initial_prompt + " " + err
            }
        ],
        functions: [
            {
                name: "createHotelItinerary",
                parameters: {
                    type: "object",
                    properties: {
                        q: {
                            type: "string",
                            description: "A search query for hotels. Example: Downtown Los Angeles"
                        },
                        check_in_date: {
                            type: "string",
                        },
                        check_out_date: {
                            type: "string",
                        },
                        adults: {
                            type: "integer",
                        },
                        children: {
                            type: "integer",
                        },
                        children_ages: {
                            type: "array",
                            items: { type: "integer" }
                        }
                    },
                    required: ["q", "check_in_date", "check_out_date"]
                }
            }
        ],
        function_call: { name: "createHotelItinerary" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;

    return functionCall;
}

/**
 * takes the OpenAI response and formats it into parameters for SerpAPI hotels call
 * @param {*} generated_params_string Param object filled in by OpenAI function call
 * @returns Param object formatted for Serp API 
 */
function generate_hotel_request_params(generated_params_string) {
    let params = {
        "api_key": process.env.SERP_API_KEY, 
        "engine": "google_hotels",
        "q": "",
        "hl": "en",
        "gl": "us",
        "min_price": "1",
        "rating": "7",
        "check_in_date": "",
        "check_out_date": "",
        "adults": "",
        "children": "",
        "children_ages": ""
    }
    generated_params_string = generated_params_string['arguments']
    let generated_params = JSON.parse(generated_params_string)
    if(generated_params['children_ages']) {
        generated_params['children_ages'] = generated_params['children_ages'].join(",")
    }
    Object.keys(generated_params).forEach(key => params[key] = generated_params[key])
    return params
}

/**
 * executes feedback loop between SerpAPI and OpenAI in order to get best hotels API response
 * @param {*} user_prompt The prompt provided by the user
 * @returns The SerpAPI hotel response json
 */
async function retrieve_hotel_options(user_prompt) {
    const initial_prompt = user_prompt;
    let error_msg = "";
    let best_response = {}

    let i = 0
    while (i < 3) {
        try {
            const generated_params = await create_hotel_request_parameters(initial_prompt, error_msg);
            let params = generate_hotel_request_params(generated_params)
            console.log('final_params', params)
            const response = await getJson(params)
            if (response["error"]) {
                throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query.");
            }
            best_response = response;
            break;

        } catch (e) {
            error_msg += e
            console.error(e);
        }
        i++;
    }
    return best_response
}

/**
 * Top level function that retrieves the SerpAPI hotel results using the prompt and summarizes the data to return to the frontend
 * @param {*} initial_prompt The prompt provided by the user
 * @returns Summarized hotel data JSON 
 */
async function getHotelOptions(initial_prompt) {
    try {
        const hotelRetrievalResults = await retrieve_hotel_options(initial_prompt);

        let filteredHotels = [];
        let hotelData = hotelRetrievalResults['properties'];

        if (Array.isArray(hotelData)) {
            hotelData.forEach((hotel) => {
                hotel.overall_rating = parseFloat(hotel.overall_rating).toFixed(2);
                if (hotel.link) {
                    filteredHotels.push(hotel);
                }
            });

            if (filteredHotels.length > 0) {
                filteredHotels = filteredHotels.slice(0, 7);
            }
        }

        const summarizedHotels = filteredHotels.map(hotel => {
            // If the name is longer than 50 characters, slice it and add an ellipsis
            const formattedName = hotel.name.length > 50 ? hotel.name.slice(0, 50) + '...' : hotel.name;

            const amenities = Array.isArray(hotel.amenities) && hotel.amenities.length > 0 
                ? hotel.amenities.slice(0, 3) 
                : [];

            return {
                name: formattedName,
                rating: hotel.overall_rating,
                description: hotel.description, 
                thumbnail: hotel.images?.[0]?.thumbnail,
                amenities: amenities,
                link: hotel.link,
                price: hotel.rate_per_night?.lowest
            };
        });

        return summarizedHotels;

    } catch (error) {
        console.error('Error reading or processing file:', error);
        return [];
    }
};



export default getHotelOptions;
```

---

</SwmSnippet>

# Formatting the OpenAI response into parameters for the SerpAPI hotels call

<SwmSnippet path="/endpoints/hotels/getHotelOptions.js" line="1">

---

Once we have the OpenAI response, we need to format it into parameters that can be used for the SerpAPI hotels call. This is done in the generate_hotel_request_params function. We start with a base set of parameters and then replace the values with the ones generated by the OpenAI function call. If the children_ages parameter is present, we join it into a comma-separated string. This is because SerpAPI expects this parameter to be in this format.

```javascript
'use server';

const { OpenAI } = require("openai");
const { getJson } = require("serpapi");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * uses OpenAI function call to give structured parameters to use for SerpAPI
 * @param {*} initial_prompt Initial user prompt for their prompt
 * @param {*} err Error string if SERP call failed
 * @returns Chat GPT function call response in format of SerpAPI paramters
 */
async function create_hotel_request_parameters(initial_prompt, err = "") {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a new hotel itinerary. Fill in as much as possible and for any items that you can't fill, fill it with any realistic sample information. FYI the year is 2024, and all dates must be in the future. The number of children_ages should match the number of children."
            },
            {
                role: "user",
                content: "Create an itinerary for this prompt " + initial_prompt + " " + err
            }
        ],
        functions: [
            {
                name: "createHotelItinerary",
                parameters: {
                    type: "object",
                    properties: {
                        q: {
                            type: "string",
                            description: "A search query for hotels. Example: Downtown Los Angeles"
                        },
                        check_in_date: {
                            type: "string",
                        },
                        check_out_date: {
                            type: "string",
                        },
                        adults: {
                            type: "integer",
                        },
                        children: {
                            type: "integer",
                        },
                        children_ages: {
                            type: "array",
                            items: { type: "integer" }
                        }
                    },
                    required: ["q", "check_in_date", "check_out_date"]
                }
            }
        ],
        function_call: { name: "createHotelItinerary" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;

    return functionCall;
}

/**
 * takes the OpenAI response and formats it into parameters for SerpAPI hotels call
 * @param {*} generated_params_string Param object filled in by OpenAI function call
 * @returns Param object formatted for Serp API 
 */
function generate_hotel_request_params(generated_params_string) {
    let params = {
        "api_key": process.env.SERP_API_KEY, 
        "engine": "google_hotels",
        "q": "",
        "hl": "en",
        "gl": "us",
        "min_price": "1",
        "rating": "7",
        "check_in_date": "",
        "check_out_date": "",
        "adults": "",
        "children": "",
        "children_ages": ""
    }
    generated_params_string = generated_params_string['arguments']
    let generated_params = JSON.parse(generated_params_string)
    if(generated_params['children_ages']) {
        generated_params['children_ages'] = generated_params['children_ages'].join(",")
    }
    Object.keys(generated_params).forEach(key => params[key] = generated_params[key])
    return params
}

/**
 * executes feedback loop between SerpAPI and OpenAI in order to get best hotels API response
 * @param {*} user_prompt The prompt provided by the user
 * @returns The SerpAPI hotel response json
 */
async function retrieve_hotel_options(user_prompt) {
    const initial_prompt = user_prompt;
    let error_msg = "";
    let best_response = {}

    let i = 0
    while (i < 3) {
        try {
            const generated_params = await create_hotel_request_parameters(initial_prompt, error_msg);
            let params = generate_hotel_request_params(generated_params)
            console.log('final_params', params)
            const response = await getJson(params)
            if (response["error"]) {
                throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query.");
            }
            best_response = response;
            break;

        } catch (e) {
            error_msg += e
            console.error(e);
        }
        i++;
    }
    return best_response
}

/**
 * Top level function that retrieves the SerpAPI hotel results using the prompt and summarizes the data to return to the frontend
 * @param {*} initial_prompt The prompt provided by the user
 * @returns Summarized hotel data JSON 
 */
async function getHotelOptions(initial_prompt) {
    try {
        const hotelRetrievalResults = await retrieve_hotel_options(initial_prompt);

        let filteredHotels = [];
        let hotelData = hotelRetrievalResults['properties'];

        if (Array.isArray(hotelData)) {
            hotelData.forEach((hotel) => {
                hotel.overall_rating = parseFloat(hotel.overall_rating).toFixed(2);
                if (hotel.link) {
                    filteredHotels.push(hotel);
                }
            });

            if (filteredHotels.length > 0) {
                filteredHotels = filteredHotels.slice(0, 7);
            }
        }

        const summarizedHotels = filteredHotels.map(hotel => {
            // If the name is longer than 50 characters, slice it and add an ellipsis
            const formattedName = hotel.name.length > 50 ? hotel.name.slice(0, 50) + '...' : hotel.name;

            const amenities = Array.isArray(hotel.amenities) && hotel.amenities.length > 0 
                ? hotel.amenities.slice(0, 3) 
                : [];

            return {
                name: formattedName,
                rating: hotel.overall_rating,
                description: hotel.description, 
                thumbnail: hotel.images?.[0]?.thumbnail,
                amenities: amenities,
                link: hotel.link,
                price: hotel.rate_per_night?.lowest
            };
        });

        return summarizedHotels;

    } catch (error) {
        console.error('Error reading or processing file:', error);
        return [];
    }
};



export default getHotelOptions;
```

---

</SwmSnippet>

# Executing a feedback loop between SerpAPI and OpenAI

<SwmSnippet path="/endpoints/hotels/getHotelOptions.js" line="1">

---

To ensure we get the best hotels API response, we execute a feedback loop between SerpAPI and OpenAI. This is done in the retrieve_hotel_options function. We start by generating the parameters using the OpenAI function call. We then make the SerpAPI call with these parameters. If the call is successful, we break the loop and return the response. If there is an error, we append the error message to the user prompt and try again. We do this up to three times to ensure we get a valid response.

```javascript
'use server';

const { OpenAI } = require("openai");
const { getJson } = require("serpapi");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

/**
 * uses OpenAI function call to give structured parameters to use for SerpAPI
 * @param {*} initial_prompt Initial user prompt for their prompt
 * @param {*} err Error string if SERP call failed
 * @returns Chat GPT function call response in format of SerpAPI paramters
 */
async function create_hotel_request_parameters(initial_prompt, err = "") {
    const gptResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "Given a prompt, create a new hotel itinerary. Fill in as much as possible and for any items that you can't fill, fill it with any realistic sample information. FYI the year is 2024, and all dates must be in the future. The number of children_ages should match the number of children."
            },
            {
                role: "user",
                content: "Create an itinerary for this prompt " + initial_prompt + " " + err
            }
        ],
        functions: [
            {
                name: "createHotelItinerary",
                parameters: {
                    type: "object",
                    properties: {
                        q: {
                            type: "string",
                            description: "A search query for hotels. Example: Downtown Los Angeles"
                        },
                        check_in_date: {
                            type: "string",
                        },
                        check_out_date: {
                            type: "string",
                        },
                        adults: {
                            type: "integer",
                        },
                        children: {
                            type: "integer",
                        },
                        children_ages: {
                            type: "array",
                            items: { type: "integer" }
                        }
                    },
                    required: ["q", "check_in_date", "check_out_date"]
                }
            }
        ],
        function_call: { name: "createHotelItinerary" }
    });

    const functionCall = gptResponse.choices[0].message.function_call;

    return functionCall;
}

/**
 * takes the OpenAI response and formats it into parameters for SerpAPI hotels call
 * @param {*} generated_params_string Param object filled in by OpenAI function call
 * @returns Param object formatted for Serp API 
 */
function generate_hotel_request_params(generated_params_string) {
    let params = {
        "api_key": process.env.SERP_API_KEY, 
        "engine": "google_hotels",
        "q": "",
        "hl": "en",
        "gl": "us",
        "min_price": "1",
        "rating": "7",
        "check_in_date": "",
        "check_out_date": "",
        "adults": "",
        "children": "",
        "children_ages": ""
    }
    generated_params_string = generated_params_string['arguments']
    let generated_params = JSON.parse(generated_params_string)
    if(generated_params['children_ages']) {
        generated_params['children_ages'] = generated_params['children_ages'].join(",")
    }
    Object.keys(generated_params).forEach(key => params[key] = generated_params[key])
    return params
}

/**
 * executes feedback loop between SerpAPI and OpenAI in order to get best hotels API response
 * @param {*} user_prompt The prompt provided by the user
 * @returns The SerpAPI hotel response json
 */
async function retrieve_hotel_options(user_prompt) {
    const initial_prompt = user_prompt;
    let error_msg = "";
    let best_response = {}

    let i = 0
    while (i < 3) {
        try {
            const generated_params = await create_hotel_request_parameters(initial_prompt, error_msg);
            let params = generate_hotel_request_params(generated_params)
            console.log('final_params', params)
            const response = await getJson(params)
            if (response["error"]) {
                throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query.");
            }
            best_response = response;
            break;

        } catch (e) {
            error_msg += e
            console.error(e);
        }
        i++;
    }
    return best_response
}

/**
 * Top level function that retrieves the SerpAPI hotel results using the prompt and summarizes the data to return to the frontend
 * @param {*} initial_prompt The prompt provided by the user
 * @returns Summarized hotel data JSON 
 */
async function getHotelOptions(initial_prompt) {
    try {
        const hotelRetrievalResults = await retrieve_hotel_options(initial_prompt);

        let filteredHotels = [];
        let hotelData = hotelRetrievalResults['properties'];

        if (Array.isArray(hotelData)) {
            hotelData.forEach((hotel) => {
                hotel.overall_rating = parseFloat(hotel.overall_rating).toFixed(2);
                if (hotel.link) {
                    filteredHotels.push(hotel);
                }
            });

            if (filteredHotels.length > 0) {
                filteredHotels = filteredHotels.slice(0, 7);
            }
        }

        const summarizedHotels = filteredHotels.map(hotel => {
            // If the name is longer than 50 characters, slice it and add an ellipsis
            const formattedName = hotel.name.length > 50 ? hotel.name.slice(0, 50) + '...' : hotel.name;

            const amenities = Array.isArray(hotel.amenities) && hotel.amenities.length > 0 
                ? hotel.amenities.slice(0, 3) 
                : [];

            return {
                name: formattedName,
                rating: hotel.overall_rating,
                description: hotel.description, 
                thumbnail: hotel.images?.[0]?.thumbnail,
                amenities: amenities,
                link: hotel.link,
                price: hotel.rate_per_night?.lowest
            };
        });

        return summarizedHotels;

    } catch (error) {
        console.error('Error reading or processing file:', error);
        return [];
    }
};



export default getHotelOptions;
```

---

</SwmSnippet>

# Retrieving the SerpAPI hotel results and summarizing the data

Finally, we retrieve the SerpAPI hotel results using the user prompt and summarize the data to return to the frontend. This is done in the `getHotelOptions` function. We start by calling the `retrieve_hotel_options` function to get the hotel data. We then filter the hotels to only include those with a link and limit the results to the top 7. We then map over the filtered hotels and format the data into a more user-friendly format. This includes shortening the hotel name if it's too long, limiting the amenities to the top 3, and formatting the price. The summarized hotel data is then

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBWHBlZGl0aW9uJTNBJTNBdHd4c2hh" repo-name="Xpedition"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
