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
/*lessons
1) props updates do not update the state of rerendered components
2) to work around this you use a useEffect that updates the state, setting the dependency array to be the value that changes
3) components rerender on prop or state changes
4) need to think about what the components see, I needed the component to be able to see that there was only one country, and if i shared that info to the Country component, it would be easy.  
  //use effects cant be inside a conditional


*/
//use effect note:
//each use effect block should be as specific as possible

//expanse state needs to be in countryList, which is a set of countries

function CountryList({ countries, expandedSet, updateExpandedSet }) {
  const [onlyCountry, setOnlyCountry] = useState(countries.length === 1)
  useEffect(() => setOnlyCountry(countries.length === 1), [countries])
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  const deleteCountry = (countryName) => {
    expandedSet.delete(countryName)
    updateExpandedSet((expandedSet) => {
      expandedSet.delete(countryName)
      const newSet = new Set(expandedSet)
      return newSet
    })
  }
  const addCountry = (countryName) => {
    updateExpandedSet((expandedSet) => {
      const newSet = new Set(expandedSet.add(countryName))
      return newSet
    })
  }

  return (
    <>
      {countries.map((country) => {
        return (
          <Country
            key={country.name.common}
            country={country}
            onlyCountry={onlyCountry}
            isExpanded={expandedSet.has(country.name.common)}
            deleteFromExpanded={deleteCountry}
            addToExpanded={addCountry}
          />
        )
      })}
    </>
  )
}

function Country({
  country,
  onlyCountry,
  isExpanded,
  addToExpanded,
  deleteFromExpanded,
}) {
  const [weather, setWeather] = useState(null)

  const languages = Object.values(country.languages)
  const handleHideClick = () => {
    deleteFromExpanded(country.name.common)
  }

  const api_key = process.env.REACT_APP_API_KEY
  const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`

  useEffect(() => {
    axios.get(url).then((response) => {
      setWeather(response.data.current)
    })
  }, [url])

  if (onlyCountry) {
    return (
      <>
        <div>
          <div>
            <h2>{country.name.common} </h2>
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
  } else if (isExpanded) {
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
        <button onClick={() => addToExpanded(country.name.common)}>show</button>
      </div>
    </>
  )
}

/*

the plan:
I have an empty set, whose contents are countries that are to be expanded

I suppose countrylist would have to see, when populating every country component, the country component will check to see if it is in the set, and if its not it wont expand. if it is it will expand.

if you press the expand button, you acutally just send the setExpand function to the country level 

*/

function App() {
  const hook = () => {
    const eventHandler = (response) => {
      setCountries(response.data)
    }
    const promise = axios.get('https://restcountries.com/v3.1/all')

    promise.then(eventHandler)
  }

  useEffect(hook, [])

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [expandedSet, setExpandedSet] = useState(new Set())

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  return (
    <>
      <div>
        <div>2.13 alt</div>
        find countries
        <Filter value={filter} onChange={handleFilterChange} />
        <CountryList
          countries={countriesToShow}
          expandedSet={expandedSet}
          updateExpandedSet={setExpandedSet}
        />
      </div>
    </>
  )
}

export default App
