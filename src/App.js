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

function Country({ country }) {
  const [expanded, setExpanded] = useState(false)
  const languages = Object.values(country.languages)
  const handleHideClick = () => {
    setExpanded(false)
  }

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
