const { OpenAI } = require("openai");
const { getJson } = require("serpapi");
require('dotenv').config()

const openai = new OpenAI();


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

    // console.log(functionCall);
    return functionCall;
}

function generate_hotel_request_params(generated_params_string) {
    params = {
        "api_key": "b07e0633f36f0cf83db573912528c3436d74a42f2a49a9e9715ce3f9c32391f7",
        "engine": "google_hotels",
        "q": "",
        "hl": "en",
        "gl": "us",
        "check_in_date": "",
        "check_out_date": "",
        "adults": "",
        "children": "",
        "children_ages": ""
    }
    generated_params_string = generated_params_string['arguments']
    let generated_params = JSON.parse(generated_params_string)
    generated_params['children_ages'] = generated_params['children_ages'].join(",")
    Object.keys(generated_params).forEach(key => params[key] = generated_params[key])
    // console.log(params)
    return params
}
async function retrieve_hotel_options(user_prompt) {
    const initial_prompt = user_prompt;
    let error_msg = "";
    let best_response = {}

    let i = 0
    while(i < 3){
        try {
            const generated_params = await create_hotel_request_parameters(initial_prompt, error_msg);
            params = generate_hotel_request_params(generated_params)
            console.log('final_params', params)
            const response = await getJson(params)

            if (response["error"]){
                throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query.");
            } 
            best_response = response;
            break;

        } catch(e) {
            error_msg += e
            console.error(e);
        }
        i++;
    }
    return best_response
}


const getHotelOptions = async () => {
    const initial_prompt = "Help me plan a trip for Korea. I have 3 triplets and will travel with my husband";

    hotel_retrieval_results = await retrieve_hotel_options(initial_prompt);

    try {
        
        hotelData = hotel_retrieval_results['properties'].slice(0,5);
    
        const summarizedHotels = hotelData.map(hotel => {
            return {
                name: hotel.name,
                rating: hotel.overall_rating,
                description: hotel.description,
                thumbnail: hotel.images[0].thumbnail, 
                amenities: hotel.amenities.slice(0, 3), 
                link: hotel.link
            };
        });

        return summarizedHotels;

    } catch (error) {
        console.error('Error reading or processing file:', error);
    }
};


export default getHotelOptions;