'use client';

import { useEffect, useState } from "react";
import { broadcast, Province  } from "@prisma/client";

interface WeatherAPIProps {
    broadcasts: broadcast[];
  }

export default function Weather({ broadcasts }: WeatherAPIProps) {
    console.log('Weather component rendered');
    function formatProvince(province: Province): string {
    return province.replace(/_/g, " ");
  }

  // https://api.openweathermap.org/data/2.5/forecast?q=toronto&appid=8871a42421c11dbbf6bafc2e4005b6df
  const getWeather = async(province: string) =>{
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${province}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER}`;
        const response = await fetch(weatherAPI);
        return await response.json();
    }
    
    useEffect(()=>{
        const getWeatherData = async() => {
            for(const broadcast of broadcasts){
                const {province, date} = broadcast;
                console.log("run api: ",province)
                const dateDiff = Math.floor(
                    (new Date(date).getTime() - new Date(Date.now()).getTime()) / (1000 * 60 * 60 * 24));
                const cnt = (dateDiff<0? 0:dateDiff)*8;
                    console.log(cnt);
                const fetchWeather = await getWeather(formatProvince(province));
                console.log(fetchWeather);
                console.log(fetchWeather.list[cnt]);
            }

        }
        getWeatherData();
    },[broadcasts]);

    return null;

}