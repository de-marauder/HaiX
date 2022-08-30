import _ from "lodash";

import citiesData from "src/views/AI/data/worldcities.json";

const cities = citiesData;

function getLatLong(cityName, idx) {
  const re = /[&/\\#+()$~%.'":;*!?<>{},]/;
  let [city, country] = cityName.split(re);

  city = city.trim();
  country = country && country.trim();

  const matchedCities = _.find(
    cities,
    function ([{ admin_name, city_ascii, country }]) {
      return (
        admin_name.toLowerCase() === city.toLowerCase() ||
        city_ascii.toLowerCase() === city.toLowerCase() ||
        country.toLowerCase() === city.toLowerCase()
      );
    }
  );

  const matchedCity = _.filter(
    matchedCities,
    ({ country: _country, iso2, iso3 }) => {
      return (
        country &&
        (_country.toLowerCase() === country.toLowerCase() ||
          iso2.toLowerCase() === country.toLowerCase() ||
          iso3.toLowerCase() === country.toLowerCase())
      );
    }
  );

  return matchedCity && matchedCity.length
    ? matchedCity[0]
    : matchedCities && matchedCities[0];
}

const isCityValid = (city) =>
  city && city.length && !/[&/\\#+()$~%.'":;*!?<>{}]/.test(city);

const sortTweetsByFollowers = (tweets) =>
  tweets.sort((a, b) => b.followers - a.followers);

export default function getMapData(tweets) {
  if (tweets) {
    const groupedByCities = _.groupBy(tweets?.allTweets, "location");

    const emojiFilter =
      /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;

    const filterdCities = Object.entries(groupedByCities)
      .filter(([city]) => isCityValid(city))
      .map(([city, tweets]) => [city.replace(emojiFilter, "").trim(), tweets]);

    const withCoordinates = _.groupBy(
      filterdCities
        .map(([city, tweets], idx) => [city, tweets, getLatLong(city, idx)])
        .filter(([, , coordinates]) => coordinates),
      ([, , city]) => `${city.lat}-${city.lng}`
    );

    const city = Object.entries(withCoordinates).map(([, _data]) => {
      const cityName = _data[0][2].city_ascii;
      const _tweets = _data.reduce((acc, [, _t]) => [...acc, ..._t], []);
      const toptweets = sortTweetsByFollowers(_tweets).map((tweet) => ({
        id: tweet._id,
        tweet: tweet.tweet,
        source: tweet.name,
        followers: tweet.followers,
        handler_name: tweet.handler_name,
        is_user_verified: tweet.is_user_verified,
        profile_image_url: tweet.profile_image_url,
        profile_image_url_https: tweet.profile_image_url_https,
        twitterHandlerused: tweet.twitterHandlerused,
        createdAtISO: tweet.createdAtISO,
        location: tweet.location,
        sentimentPolarity: tweet.sentimentPolarity,
      }));
      const citymean = _.map(toptweets, "sentimentPolarity");
      const polarity = citymean.reduce((a, b) => a + b / citymean.length, 0);
      const meanCounts = citymean.reduce(
        (acc, curr) =>
          curr > 0.8
            ? { ...acc, green: acc.green + 1 }
            : curr < 0
            ? { ...acc, red: acc.red + 1 }
            : { ...acc, amber: acc.amber + 1 },
        { red: 0, green: 0, amber: 0 }
      );

      const classifyMean = citymean.reduce(
        (acc, curr) =>
          curr > 0.8
            ? { ...acc, positive: acc.positive + 1 }
            : curr < 0
            ? { ...acc, negative: acc.negative + 1 }
            : { ...acc, neutral: acc.neutral + 1 },
        { negative: 0, positive: 0, neutral: 0 }
      );

      const coordinates = { lat: _data[0][2].lat, lng: _data[0][2].lng };

      const obj = {
        cityName,
        toptweets,
        tweetCount: toptweets.length,
        citymean,
        polarity,
        meanCounts,
        classifyMean,
        coordinates,
      };

      return obj;
    });

    const minLat = -6.1751;
    const maxLat = 55.7558;
    const minLong = -0.5103751;
    const maxLong = 0.3340155;

    return {
      city,
      minLat,
      maxLat,
      minLong,
      maxLong,
      centerLat: (minLat + maxLat) / 2,
      distanceLat: maxLat - minLat,
      centerLong: (minLong + maxLong) / 2,
      distanceLong: maxLong - minLong,
      bufferLong: (maxLong - minLong) * 0.05,
    };
  }

  return null;
}
