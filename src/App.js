import React, { useState, useEffect } from 'react'
import axios from 'axios'

/* 2.12 - countries- what do i have to do
1) i have to create an input feild that filters 
2) i have to list country name from a json format


*/

function Filter({ value, onChange }) {
  return (
    <>
      <input value={value} onChange={onChange} />
    </>
  )
}

//toggle country,
//new component, if collapsed,

//refactor country component, - renders have some state, are we showing the expanded view

function Countries({ countries }) {
  //selected country, set seletedCountry usestate
  //if there is a selected country, then you return that country
  // const showCountryClick = (country) => {
  //   return <Country country={country} />
  // }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  return (
    <>
      {countries.map((country) => (
        <Country key={country.name.common} country={country} />
      ))}
    </>
  )
}

function Weather({ weather, city }) {
  if (!weather) {
    return null
  }

  return (
    <div>
      <h3>Weather in {city}</h3>
      <div>
        <strong>temperature:</strong> {weather.temperature} Celcius
      </div>
      <img
        src={weather.weather_icons[0]}
        alt={weather.weather_descriptions[0]}
      />
      <div>
        <strong>wind:</strong> {weather.wind_speed} mph direction{' '}
        {weather.wind_dir}
      </div>
    </div>
  )
}
function Country({ country }) {
  const [weather, setWeather] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const languages = Object.values(country.languages)
  const handleHideClick = () => {
    setExpanded(false)
  }

  const capital = country['capital']

  const fetchWeather = () => {
    console.log('test', process.env.API_KEY)
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=ae75f740ed8c9e696a7e401ab3925578&query=${capital}`
      )
      .then((res) => {
        console.log('res.data', res.data)
        // return setWeather({
        //   temperature: `${res.data.current.temperature} Celsius`,
        //   weather_icons: res.data.current.weather_icons,
        //   wind_speed: `${res.data.current.wind_speed} kilometers/hour`,
        //   wind_dir: `direction ${res.data.current.wind_dir}`,
        // })
      })
      .catch(() => setWeather({ temperature: 'api request failed' }))
  }

  useEffect(fetchWeather, [capital])

  if (expanded) {
    return (
      <>
        <div>
          <div>
            <h2>
              {country.name.common}{' '}
              <button onClick={handleHideClick}>hide</button>
            </h2>
          </div>
          <div>capital {country.capital}</div>
          <div>population {country.population}</div>
          <h3>languages</h3>
          <ul>
            {languages.map((lang) => {
              return <li key={lang}>{lang}</li>
            })}
          </ul>
          <img alt={`map of ${country.name.common}`} src={country.flags.png} />
          <Weather weather={weather} city={country.capital} />
        </div>
      </>
    )
  }
  return (
    <>
      <div>
        {country.name.common}
        <button onClick={() => setExpanded(!expanded)}>show</button>
      </div>
    </>
  )
}

function App() {
  const hook = () => {
    const eventHandler = (response) => {
      setCountries(response.data)
    }
    const promise = axios.get('https://restcountries.com/v3.1/all')

    promise.then(eventHandler)
  }

  useEffect(hook, [])

  //array of country objects
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  return (
    <>
      <div>
        <div>2.13</div>
        find countries
        <Filter value={filter} onChange={handleFilterChange} />
        <Countries countries={countriesToShow} />
      </div>
    </>
  )
}

export default App
