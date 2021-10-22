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
function Countries({ countries }) {
  if (countries.length === 1) {
    return <Country country={countries} />
  }
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  return (
    <>
      {countries.map((country) => (
        <div key={country.name.common}>{country.name.common}</div>
      ))}
    </>
  )
}

function Country({ country }) {
  const languages = Object.values(country[0].languages)
  return (
    <>
      <h2>{country[0].name.common}</h2>
      {console.log(country[0])}
      <div>capital {country[0].capital}</div>
      <div>population {country[0].population}</div>
      <h3>languages</h3>
      <ul>
        {languages.map((lang) => {
          return <li>{lang}</li>
        })}
      </ul>
      <img
        alt={`map of ${country[0].name.common}`}
        src={country[0].flags.png}
      />
    </>
  )
}

function App() {
  const hook = () => {
    console.log('effect')
    const eventHandler = (response) => {
      console.log(response)
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
    country.name.common.toLowerCase().includes(filter)
  )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  return (
    <>
      <div>
        find countries
        <Filter value={filter} onChange={handleFilterChange} />
        <Countries countries={countriesToShow} />
      </div>
    </>
  )
}

export default App
