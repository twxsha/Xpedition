const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getJson } = require("serpapi");



require('dotenv').config()
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ...
async function gen_hotel_params(initial_prompt, error = "") {
  params = {
    "api_key": "a7bc1e4262ffc5be0e120add2387a1ae68f7c04ca7d249cc728dec73368d3d29",
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

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  prompt = "Given this prompt: " + initial_prompt + ", fill out the following json" + params + 
     "q: String - Parameter defines the search query. You can use anything that you would use in a regular hotels search."
     "check_in_date: Parameter defines the check in date. The format is YYYY-MM-DD. The year is 2024 unless specified otherwise. If no date use a default date of 2 months from today. e.g. 2024-02-14" +
     "check_out_date: Parameter defines the check out date. The format is YYYY-MM-DD. The year is 2024 unless specified otherwise. If no date use a default date of 2 months + 5 days from today. e.g. 2024-02-14" +
     "adults: Number -  Number of adults on trip. If not specified, default to 2" +
     "children: Number -  Number of adults on trip. If not specified, default to 0" +
     "children_ages: Number List separated by commas. If number of children is above 0 but the ages are not specified, default to 10 for each child. e.g. 10,10"
  
  if (error != ""){
    prompt += "Please note that these errors were given and fix it the response" + error
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  let trimmed_json_string = text.substring(text.indexOf('{'), text.indexOf('}')+1);
  let trimmed_json = JSON.parse(trimmed_json_string)
  Object.keys(trimmed_json).forEach(key => params[key] = trimmed_json[key])

  return params
}

async function run(){
  const initial_prompt = "Give me hotel options from for chamonix on april 4 to april 9th"
  let error_msg = ""
  let best_response = {}

  let i = 0
  while(i < 5){
    params = await gen_hotel_params(initial_prompt, error_msg)
    console.log(params)
    // const response = await getJson(params);
    try {
      const response = await getJson(params);

      if (response["error"]){
        throw new Error("\n \n There is something wrong with the JSON you provided last time I made this query. Have you considered that the airport codes you are using don't actually exist? This has to be an airport code corresponding to exactly one airport, not a destination code that simply renode rs to a region with multiple airports.");
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
  console.log(best_response)
  


}

run()

// ...