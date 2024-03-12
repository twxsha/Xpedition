const fs = require('fs');

function testGetFlightOptions(serp_results) {
  //let flight_retrieval_results = await retrieve_flight_options(initial_prompt);
  // for our testing, we will always assume that openai and serp provide valid results.
  // our goal is to test how we handle their results and if we made any mistakes handling our results

  let flight_retrieval_results = serp_results;

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

function test1BasicBestFlightsAndOthers() {
    fs.readFile('endpoints/flights/test1.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetFlightOptions(data);
            console.log("test1 success. Best flights and other flights provided.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test2NoBestFlights() {
    fs.readFile('endpoints/flights/test2.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetFlightOptions(data);
            console.log("test2 success. Works without best flights");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test3NotEnoughBestFlights() {
    fs.readFile('endpoints/flights/test3.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            let res = testGetFlightOptions(data);
            if (res.length == 3)
                console.log("test3 success. Multiple Locations and Amenity Types.");
            else{
                throw ("Failed to return 3 elements")
            }
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test4Empty() {
    fs.readFile('endpoints/flights/test4.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetFlightOptions(data);
            console.log("test4 success. No results from Serp");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}
test1BasicBestFlightsAndOthers();
test2NoBestFlights();
test3NotEnoughBestFlights();
test4Empty();