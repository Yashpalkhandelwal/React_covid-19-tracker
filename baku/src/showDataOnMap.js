import React from 'react';
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColor = {
    cases: {
        hex:"#CC1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
};


export const showDataOnMap = (data, casesType = 'cases') =>
    data.map(country => (
        <Circle 
        center={[country.countryInfo.lat, country.countryInfo.long]} 
        fillOpacity={0.4} 
        color={casesTypeColor[casesType].hex} 
        fillColor={casesTypeColor[casesType].hex} 
        redius={
            Math.sqrt(country[casesType]) * casesTypeColor[casesType].multiplier
                } 
            >
              <Popup>
                  <h1>h11</h1>
              </Popup>
        </Circle>

    )) ;
  
