import tweetData from '../assets/tweets data.json'
// import countryGeodata from '../assets/country_geodata/world_country_and_usa_states_latitude_and_longitude_values.json'
import citiesGeodata from '../assets/world_cities.json'

// Get country name dataset
// export const getCountries = async () => {
//     const proxyURL = 'https://still-lake-77123.herokuapp.com/'
//     const targetURL = 'http://country.io/names.json'
//     const data = await fetch(proxyURL + targetURL).then((data) => {
//         return data.json();
//     })
//     return data;
// }
// Get country code dataset
// export const getCountriesCodes = async () => {
//     const proxyURL = 'https://still-lake-77123.herokuapp.com/'
//     const targetURL = 'http://country.io/iso3.json'
//     const data = await fetch(proxyURL + targetURL).then((data) => {
//         return data.json();
//     })
//     return data;
// }

export const cleanData = async () => {

    // Fetch tweets
    // let tweetData = await fetch('../assets/tweets data.json').then((data) => {return data.json()})
    // console.log(tweetData)
    // // Fetch country geodata
    // let countryGeodata = await fetch('../assets/country_geodata/world_country_and_usa_states_latitude_and_longitude_values.json').then((data) => {return data.json()})

    // Clean tweetData json (filter out junk countries and sentiments)
    // const citiesGeodata = citiesGeodata.map((el, id) => {
    //     return {
    //         iso2: el,
    //         iso3: Object.entries(countriesCode)[id][1],
    //         name: Object.entries(countries)[id][1],
    //         long: citiesGeodata.find((data) => data["country_code"] === el)?.longitude,
    //         lat: citiesGeodata.find((data) => data["country_code"] === el)?.latitude
    //     }
    // })
    console.log(citiesGeodata)
    var filteredData = tweetData.data.twitter.data.filter((data) => {

        return (
            data.location !== '' &&
            (// Check if any word in the location string is a valid country and introduced a new parameter 'locationCode' into tweets
                data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item?.iso2.toUpperCase() }).includes(el?.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.iso2 === data.location.split(', ')[id])?.city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item?.iso3.toUpperCase() }).includes(el?.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.iso3 === data.location.split(', ')[id])?.city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item?.city.toUpperCase() }).includes(el?.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.city === data.location.split(', ')[id])?.city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item?.country.toUpperCase() }).includes(el?.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.country === data.location.split(', ')[id])?.city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b })
                // Check for uppercase
                // data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item.iso2 }).includes(el.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.iso2 === data.location.split(', ')[id]).city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                // data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item.iso3 }).includes(el.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.iso3 === data.location.split(', ')[id]).city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                // data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item.city }).includes(el.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.name === data.location.split(', ')[id]).city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b }) ||
                // data.location.split(', ').map((el) => { return citiesGeodata.map((item) => { return item.countries }).includes(el.toUpperCase()) }).map((bool, id) => { if (bool) { data.locationCode = citiesGeodata.find((co) => co.name === data.location.split(', ')[id]).city }; return bool ? 1 : 0 }).reduce((a, b) => { return a + b })
            )
        );
    })

    console.log('filteredData: ', filteredData)

    const filteredDataLocations = filteredData.map((item) => {
        return item.locationCode
    })
    console.log(filteredDataLocations)

    // Reshape tweets data
    let locationCountList = []

    // Identify unique items in the filtered list and count there number of occurence. Store their sentiments as an array to be reduced later
    for (let [key, filteredDataLocation] of Object.entries(filteredDataLocations)) {
        if (locationCountList.length === 0) {
            citiesGeodata.find((d) => {
                return d === filteredDataLocation
            })
            locationCountList.push({
                locationCode: filteredDataLocation,
                location: citiesGeodata.find((d) => d.city === filteredDataLocation)?.name,
                latitude: citiesGeodata.find((d) => d.city === filteredDataLocation)?.lat,
                longitude: citiesGeodata.find((d) => d.city === filteredDataLocation)?.lng,
                count: 1,
                average: [filteredData[key].sentimentPolarity]
            })
            continue;
        }

        const location = locationCountList.map((el) => el.locationCode)
        if (location.includes(filteredDataLocation)) {
            const data = locationCountList.find((item)=>{
                return item.locationCode === filteredDataLocation
            });
            data.count += 1;
            data.average = [...data.average, filteredData[key].sentimentPolarity]
        } else {
            locationCountList.push({
                locationCode: filteredDataLocation,
                location: citiesGeodata.find((d) => d.city === filteredDataLocation)?.name,
                latitude: citiesGeodata.find((d) => d.city === filteredDataLocation)?.lat,
                longitude: citiesGeodata.find((d) => d.city === filteredDataLocation)?.lng,
                count: 1,
                average: [filteredData[key].sentimentPolarity]
            })
        }
    }

    // Calculate average of sentiments.
    locationCountList = locationCountList.map((item) => {
        return {
            ...item,
            average: (item.average.reduce((prev, curr) => {
                return prev + curr
            }, 0)) / item.average.length
        }
    })
    console.log('locationCountList: ', locationCountList)

    return [locationCountList, filteredData]
}