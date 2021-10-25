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
//whats happening
//i'm displaying counties, which returns a <Country /> component for every country that fits the filter
//

//does the component rerender when the prop is updated. should be yes, check
//tend to more less state,
//When do componenets rerender: React components automatically re-render whenever there is a change in their state or props

function Countries({ countries }) {
  console.log('countries arr', countries, 'len is', countries.length)
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  const test = (country) => {
    return (
      <Country
        key={country.name.common}
        country={country}
        isOnlyCountry={countries.length === 1}
      />
    )
  }
  return <>{countries.map((country) => test(country))}</>
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

//different renders vs rerenders

//write a use effect as the only value in the dependney array, and set expanded as isonly
function Country({ country, isOnlyCountry }) {
  console.log('country', country.name.common)
  console.log('isOnlyCountry', isOnlyCountry)
  // const [weather, setWeather] = useState(null)
  const [expanded, setExpanded] = useState(isOnlyCountry)
  console.log('is expanded', expanded)

  const languages = Object.values(country.languages)
  const handleHideClick = () => {
    setExpanded(false)
  }

  useEffect(() => setExpanded(isOnlyCountry), [isOnlyCountry])
  // const api_key = process.env.API_KEY
  // console.log(process.env)
  // const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`

  // useEffect(() => {
  //   axios.get(url).then((response) => {
  //     setWeather(response.data.current)
  //   })
  // }, [])

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
          {/*<Weather weather={weather} city={country.capital} />*/}
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
