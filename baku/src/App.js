import React, {useState, useEffect} from 'react';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import './App.css';
import Table from "./Table";
import {sortData, prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");  
    const [countryInfo, setcountryInfo] = useState({});
    const [tableData, setTabledata] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.807446, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
            setcountryInfo(data);
        })
    }, [])

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                            name: country.country, 
                            value: country.countryInfo.iso2, 
                            flag: country.countryInfo.flag
                        }));

                    const sortedData = sortData(data);
                    setTabledata(sortedData);  
                    setMapCountries(data);  
                    setCountries(countries);
                    
                   
                });
        };
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        const url = country === "Worldwide" 
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
        .then((response) => response.json())
        .then ((data) => {
            setCountry(countryCode);
            setcountryInfo(data);

            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4);
            });
    };

    return (
        <div className="app">
            <div className="app_left">
            <div className="app_header">
                <h1> Covid - 19 Tracker</h1>
                <FormControl className="app_dropdown">
                    <Select 
                    variant="outlined" 
                    onChange={onCountryChange}
                    value={country}
                    >
                        <MenuItem value="worldwide">WorldWide</MenuItem>
                        { countries.map(country => (
                            <MenuItem value = {country.value}>{country.name} </MenuItem>
                             ))}
                    </Select>
                </FormControl >
            </div>

            <div className = "app_stats">
                <InfoBox 
                isRed
                active={casesType === "cases"}
                onClick={e => setCasesType('cases')}
                title="CoronaVirus Cases" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={prettyPrintStat(countryInfo.cases)} 
                />        
                <InfoBox 
                active={casesType === "recovered"}
                onClick={e => setCasesType('recovered')}
                title="Recovered" 
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={prettyPrintStat(countryInfo.recovered)} 
                />   
                <InfoBox 
                isRed                
                active={casesType === "deaths"}
                onClick={e => setCasesType('deaths')}
                title="Deaths" 
                cases={prettyPrintStat(countryInfo.todayDeaths)} 
                total={prettyPrintStat(countryInfo.deaths)}  
                />       
             </div>         

            <Map 
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
            />

            </div>

            <Card className="app_right">
                <CardContent>
                    <h2>LIVE Cases : Country</h2>
                    <Table countries={tableData} />
                    <h3 className="app__graphName">WorldWide New {casesType}</h3>
                    <LineGraph
                    className="app__graph"
                    casesType={casesType}
                     />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;