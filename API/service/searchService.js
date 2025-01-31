const request = require("request-promise");
//const keyModule = require("../api_keys/yelpApiKey");
//const API_KEY = keyModule.API_KEY;
const API_KEY = "rw0fMRw0_c05_ankeAlpIBhpuejV80QfLKT8Ktx7Mywhj8gw1R8a8_sqmYYvt2HBvaXus2kB7xrwiWreoSXHtNqW0ASxeM4GVsWEfZKaYNI9JT7IrmGBa4owV8WoXXYx";
const lineupService = require("../service/lineupService");

/**
 * @param searchResults {{businesses:{lineupTime:Number}}}
 **/
function addLineupTimes(searchResults) {
    let businessIdToBusinessMap = new Map();

    searchResults.businesses.forEach(function (business) {
        business.lineupTime = null;
        businessIdToBusinessMap.set(business.id, business);
    });

    let businessIds = Array.from(businessIdToBusinessMap.keys());

    return lineupService.getLineupsByIds(businessIds).then(function (lineups) {
        if (lineups == null) {
            return searchResults;
        }

        // works because lineup id = business id
        lineups.forEach(function (lineup) {
            businessIdToBusinessMap.get(lineup.id).lineupTime = lineup.lineupTime;
        });

        searchResults.businesses = Array.from(businessIdToBusinessMap.values());

        return searchResults;
    });
}

function getRestaurantsByKeywordAndCoordinates(keyword, coordinates) {
    const options = {
        uri: "https://api.yelp.com/v3/businesses/search",
        headers: {
            "Authorization": "Bearer " + API_KEY
        },
        qs: {
            term: keyword,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            limit: 20
        },
        json: true
    };

    return request(options).then(addLineupTimes);
}

module.exports = {getRestaurantsByKeywordAndCoordinates};
