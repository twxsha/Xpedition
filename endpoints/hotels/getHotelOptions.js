'use server';

const { OpenAI } = require("openai");
const { getJson } = require("serpapi");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });


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


const getHotelOptions = async (initial_prompt) => {
    // const initial_prompt = "Help me plan a trip for NY. I have 3 triplets and will travel with my husband";
    const hotelRetrievalResults = await retrieve_hotel_options(initial_prompt);

    try {

        let filteredHotels = [];
        let hotelData = hotelRetrievalResults['properties'];
        hotelData.forEach((hotel) => {
            // Ensure overall_rating is a number and fix it to 2 decimal places
            hotel.overall_rating = parseFloat(hotel.overall_rating).toFixed(2);
            if (hotel.link) {
                filteredHotels.push(hotel);
            }
        });
        filteredHotels = filteredHotels.slice(0, 7);

        const summarizedHotels = filteredHotels.map(hotel => {
            // If the name is longer than 50 characters, slice it and add an ellipsis
            const formattedName = hotel.name.length > 50 ? hotel.name.slice(0, 50) + '...' : hotel.name;

            return {
                name: formattedName,
                rating: hotel.overall_rating,
                description: hotel.description,
                // Use optional chaining for thumbnail to handle cases where images may not exist
                thumbnail: hotel.images?.[0]?.thumbnail,
                amenities: hotel.amenities.slice(0, 3),
                link: hotel.link,
                // Use optional chaining for price to handle cases where rate_per_night may not exist
                price: hotel.rate_per_night?.lowest
            };
        });


        return summarizedHotels;


    } catch (error) {
        console.error('Error reading or processing file:', error);
    }
};

export default getHotelOptions;