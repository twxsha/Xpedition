const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getJson } = require("serpapi");



require('dotenv').config()
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ...
async function gen_flight_params(initial_prompt, error = "") {
  params = {
    "api_key": "a7bc1e4262ffc5be0e120add2387a1ae68f7c04ca7d249cc728dec73368d3d29",
    "engine": "google_flights",
    "departure_id": "",
    "arrival_id": "",
    "outbound_date": "",
    "return_date": "",
  }

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  prompt = "Given this prompt: " + initial_prompt + ", fill out the following JSON parameters:" +
     "departure_id: String - uppercase 3-letter airport code." +
     "arrival_id: String -  uppercase 3-letter airport code" +
     "outbound_date: Parameter defines the outbound date. The format is YYYY-MM-DD. e.g. 2024-02-14" +
     "return_date: Parameter defines the return date. The format is YYYY-MM-DD. e.g. 2024-02-20"
  
  if (error != ""){
    prompt += "Please note that these errors were given and fix it the response" + error
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();


  let trimmed_json_string = text.substring(text.indexOf('{'), text.indexOf('}')+1);
  let trimmed_json = JSON.parse(trimmed_json_string)
  Object.keys(trimmed_json).forEach(key => params[key] = trimmed_json[key])

  return params
}

async function run(){
  const initial_prompt = "Give me flight options from los angeles to jfk on feb 23 to feb 27 in 2024"
  let error_msg = ""
  let best_response = {}

  let i = 0
  while(i < 5){
    params = await gen_flight_params(initial_prompt, error_msg)
    console.log(params)
    //const response = await getJson(params);
    try{
      const response = await getJson(params);

      if (response["error"]){
        throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query. Have you considered that the airport codes you are using don't actually exist? This has to be an airport code corresponding to exactly one airport, not a destination code that simply refers to a region with multiple airports.");
      } 
      best_response = response;
      break;  
    }
    catch(e){
      error_msg += e
      console.log(e)
    }
    i++;
  }
  if (i==5){
    //have some functionality to tell user to give a better prompt

  }
  


}


// ...