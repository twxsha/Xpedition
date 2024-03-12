'use server'

const { OpenAI } = require("openai");
const { getJson } = require("serpapi");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
/**
 * uses OpenAI function call to give structured parameters to use for SerpAPI
 * @param {*} initial_prompt Initial user prompt for their prompt
 * @param {*} err Error string if SERP call failed
 * @returns Chat GPT function call response in format of SerpAPI paramters
 */
async function create_flight_request_parameters(initial_prompt, err = "") {
  const gptResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
          {
              role: "system",
              content: "Given a prompt, create a new flight itinerary. Fill in as much as possible and for any items that you can't fill, fill it with any realistic sample information. FYI the year is 2024, and all dates must be in the future."
          },
          {
              role: "user", 
              content: "Create an itinerary for this prompt " + initial_prompt + " " + err
          }
      ],
      functions: [
        {
            name: "createFlightItinerary",
            parameters: {
                type: "object",
                properties: {
                    departure_id: {
                        type: "string",
                        description: "The departure airport code, must be 3 digit airport code referring to specific airport "
                    },
                    arrival_id: {
                        type: "string",
                        description: "The arrival airport code, must be 3 digit airport code referring to specific airport "
                    },
                    type: {
                        type: "integer",
                        description: "Parameter defines the type of the flights. Flight type should always be round trip unless otherwise specified. Available options: 1 - Round trip (default), 2 - One way "
                    },
                    outbound_date: {
                        type: Date
                    },
                    return_date: {
                        type: Date,
                    },
                    travel_class: {
                        type: "integer",
                        description: "Parameter defines the travel class. Travel class should always be economy unless otherwise specified. Available options: 1 - Economy (default), 2 - Premium economy, 3 - Business, 4 - First"
                    },
                    adults: {
                      type: "integer",
                      description: "The number of adults. Default to 1"
                    },
                    children: {
                      type: "integer",
                      description: "The number of children. Default to 0"
                    }
                },
                required: ["departure_id", "arrival_id", "type", "travel_class", "adults", "outbound_date"]
            }
        }
    ],
    function_call: { name: "createFlightItinerary" }
  });

  const functionCall = gptResponse.choices[0].message.function_call;

  return functionCall;
}

/**
 * takes the OpenAI response and formats it into parameters for SerpAPI flights call
 * @param {*} generated_params_string Param object filled in by OpenAI function call
 * @returns Param object formatted for Serp API 
 */
function generate_flight_request_params(generated_params_string) {
  let params = {
      "api_key": process.env.SERP_API_KEY,
      "engine": "google_flights",
      "hl": "en",
      "gl": "us",
      "departure_id": "",
      "arrival_id": "",
      "outbound_date": "",
      "return_date": "",
  }
  generated_params_string = generated_params_string['arguments']
  let generated_params = JSON.parse(generated_params_string)
  Object.keys(generated_params).forEach(key => params[key] = generated_params[key])
  return params
}

/**
 * executes feedback loop between SerpAPI and OpenAI in order to get best flights API response
 * @param {*} user_prompt The prompt provided by the user
 * @returns The SerpAPI flight response json
 */
async function retrieve_flight_options(user_prompt) {
  const initial_prompt = user_prompt;
  let error_msg = "";
  let best_response = {}

  let i = 0
  while(i < 3){
      try {
          const generated_params = await create_flight_request_parameters(initial_prompt, error_msg);
          let params = generate_flight_request_params(generated_params)
    
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

/**
 * Top level function that retrieves the SerpAPI flight results using the prompt and summarizes the data to return to the frontend
 * @param {*} initial_prompt The prompt provided by the user
 * @returns Summarized flight data JSON 
 */
async function getFlightOptions(initial_prompt) {
  let flight_retrieval_results = await retrieve_flight_options(initial_prompt);

  try {
    let summarizedFlightData = []
    let flightData = flight_retrieval_results.best_flights ? flight_retrieval_results.best_flights.slice(0,3) : [];
    flightData = flight_retrieval_results.other_flights ? flightData.concat(flight_retrieval_results.other_flights.slice(0,3)) : flightData;
    flightData = flightData.slice(0,3)
    let link = flight_retrieval_results.search_metadata ? flight_retrieval_results.search_metadata.google_flights_url : ""
    flightData.forEach((option) => {
        let summarizedOption = {}
        summarizedOption.flights = []
        let num_stops = -1
        option.flights.forEach((flight) => {
            num_stops = num_stops + 1
            let summarizedFlight = {}
            summarizedFlight['departure_code'] = flight.departure_airport.id
            summarizedFlight['departure_time'] = flight.departure_airport.time
            summarizedFlight['arrival_code'] = flight.arrival_airport.id
            summarizedFlight['arrival_time'] = flight.arrival_airport.time
            summarizedFlight['duration'] = flight.duration
            summarizedFlight['airline'] = flight.airline
            summarizedFlight['airline_logo'] = flight.airline_logo
            summarizedFlight['travel_class'] = flight.travel_class
            summarizedFlight['flight_number'] = flight.flight_number
            summarizedOption.flights.push(summarizedFlight)
        });
        summarizedOption['departure_code'] = option.flights[0].departure_airport.id
        summarizedOption['departure_time'] = option.flights[0].departure_airport.time
        summarizedOption['arrival_code'] = option.flights.slice(-1)[0].arrival_airport.id
        summarizedOption['arrival_time'] = option.flights.slice(-1)[0].arrival_airport.time
        summarizedOption['travel_class'] = option.flights[0].travel_class
        summarizedOption['airline'] = option.flights[0].airline
        summarizedOption['num_stops'] = num_stops
        summarizedOption['total_duration'] = option.total_duration
        summarizedOption['price'] = option.price
        summarizedOption['airline_logo'] = option.airline_logo
        summarizedOption['type'] = option.type
        summarizedOption['link'] = link
        summarizedFlightData.push(summarizedOption)
    });
    return summarizedFlightData
  }
  catch(error){
    console.error("Error", error)
  }
}

export default getFlightOptions;