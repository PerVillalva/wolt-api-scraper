import axios from 'axios';
import { writeDataToJSON } from './utils.js';

export async function fetchWoltRestaurants() {
    const response = await axios.get(
        'https://consumer-api.wolt.com/v1/pages/restaurants?lat=43.5116&lon=16.4396'
    );

    const responseSectionsData = response.data.sections;

    const allRestaurants = responseSectionsData.filter((el) => {
        return el.title && el.title === 'All restaurants';
    });

    const restaurantsData = allRestaurants[0].items.map((restaurant) => {
        const restaurantInfo = restaurant.venue;
        return {
            name: restaurantInfo.name,
            address: restaurantInfo.address,
            locationLat: restaurantInfo.location[0],
            locationLong: restaurantInfo.location[1],
            slug: restaurantInfo.slug,
        };
    });

    console.log(`Found: ${restaurantsData.length} restaurants`);
    return restaurantsData;
}

export async function fetchRestaurantDetails(slug) {
    try {
        const response = await axios.get(
            `https://consumer-api.wolt.com/order-xp/web/v1/pages/venue/slug/${slug}/static`
        );
        return response;
    } catch (err) {
        console.log(err);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const restaurantsData = await fetchWoltRestaurants();
let finalData = [];
for (let restaurant of restaurantsData) {
    await sleep(1000); // Wait for 1 second
    const restaurantData = await fetchRestaurantDetails(restaurant.slug);
    const restaurantInfo = restaurantData?.data?.venue;

    const restaurantInfoStructured = {
        name: restaurantInfo?.name,
        city: restaurantInfo?.city,
        countryCode: restaurantInfo?.country,
        address: restaurantInfo?.address,
        postCode: restaurantInfo?.post_code,
        latitude: restaurant.locationLat,
        longitude: restaurant.locationLong,
        woltUrl: restaurantInfo?.share_url,
        website: restaurantInfo?.website,
        phone: restaurantInfo?.phone,
        rating: restaurantInfo?.rating?.rating,
        ratingScore: restaurantInfo?.rating?.score_raw,
        ratingVolume: restaurantInfo?.rating?.volume,
        timezone: restaurantInfo?.timezone,
    };
    console.log(restaurantInfoStructured);

    finalData.push(restaurantInfoStructured);
}
writeDataToJSON('woltRestaurantsDetail', finalData);
