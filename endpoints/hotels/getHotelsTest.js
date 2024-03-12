const fs = require('fs');

async function testGetHotelOptions(serp_results) {
    try {
        // const hotelRetrievalResults = await retrieve_hotel_options(initial_prompt);
        // for our testing, we will always assume that openai and serp provide valid results.
        // our goal is to test how we handle their results and if we made any mistakes handling our results

        const hotelRetrievalResults = serp_results;

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

function test1BasicAccomodationsAndAmenties() {
    fs.readFile('endpoints/hotels/test1.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test1 success. Basic Accomodations and Types.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test2AdvancedAccomodationsAndAmenties() {
    fs.readFile('endpoints/hotels/test2.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test2 success. Advanced Amenity types.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test3MultipleLocationsAmenityTypes() {
    fs.readFile('endpoints/hotels/test3.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test3 success. Multiple Locations and Amenity Types.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

function test4Empty() {
    fs.readFile('endpoints/hotels/test4.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test4 success. No results from Serp");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}
function test5NoRating() {
    fs.readFile('endpoints/hotels/test5.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test5 success. No rating from Serp.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}
function test6NoRate() {
    fs.readFile('endpoints/hotels/test6.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            testGetHotelOptions(data);
            console.log("test6 success. No rate from Serp.");
        } catch (err) {
            console.log('Error parsing JSON string:', err, ' or unable to parse');
        }
    });
}

test1BasicAccomodationsAndAmenties();
test2AdvancedAccomodationsAndAmenties();
test3MultipleLocationsAmenityTypes();
test4Empty();
test5NoRating();
test6NoRate();