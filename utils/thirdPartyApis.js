const axios = require("axios");

// Get the weather for a given location using the OpenWeatherMap API for the selected dates, and return the data
const getWeather = async (location, startDate, endDate) => {
    try {
        console.log(location, startDate, endDate);

        // 1) Check if location, startDate and endDate are provided
        if (!location || !startDate || !endDate) {
            return(new Error('Please provide a location, start date and end date'));
        }

        // Check the selected dates are valid for the developer plan (30 day daily forecast)
        const today = new Date();
        const thirtyDaysFromToday = new Date(today.setDate(today.getDate() + 30));

        if (startDate > thirtyDaysFromToday) {
            return [];
        }

        // Get the weather for the given location using the OpenWeatherMap API
        const weather = await axios.get(`https://pro.openweathermap.org/data/2.5/forecast/climate?q=${location}&appid=${process.env.WEATHER_API_KEY}&units=metric`);

        // Filter the weather data to only include the dates selected by the user and send it to the client in response
        return weather.data.list.filter((day) => {
            const date = new Date(day.dt * 1000).setHours(0, 0, 0, 0);
            return date >= startDate && date <= endDate;
        }).map((day) => {
            return {
                date: new Date(day.dt * 1000).toLocaleDateString(),
                ...day
            };
        });

    } catch (error) {
        console.log(error);
        return [];
    }
}

// Get the famous food from meal db api
const getFood = async (nationality) => {
    try {
        console.log(nationality);

        // 1) Check if location
        if (!nationality) {
            return(new Error('Please provide a location'));
        }

        // Get the famous for the given location using the meal db api
        const food = await axios.get(`https://www.themealdb.com/api/json/v1/${process.env.MEAL_API_KEY}/filter.php?a=${nationality}`, {
            timeout: 1000 // 1 seconds
        });

        return food.data.meals;
    }  catch (error) {
        console.log(error);
        return [];
    }
}

// Get the currency exchange rate for a given currency using the currencyconverterapi.com
const getCurrency = async (currency, currencyCode) => {
    try {
        console.log(currency);

        // 1) Check if currency
        if (!currency) {
            return(new Error('Please provide a currency'));
        }

        // Get the currency exchange rate for the given currency using the currencyconverterapi.com
        const currencyRate = await axios.get(`https://free.currconv.com/api/v7/convert?q=${currency}_${currencyCode}&compact=ultra&apiKey=${process.env.CURRENCY_API_KEY}`);

        return currencyRate.data;
    }  catch (error) {
        console.log(error);
        return [];
    }
}

const express = require('express');

const weatherRouter = express.Router();

weatherRouter.get('/weather', getWeather);

module.exports = {
    weatherRouter,
    getWeather,
    getFood,
    getCurrency
};