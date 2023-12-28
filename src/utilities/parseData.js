export default function parseData(data) {

  // map data to array of objects
  data = data.map((d) => {
    return {
      id: d.show_id,
      type: d.type,
      title: d.title,
      //? director: d.director,
      //? cast: d.cast,
      country: d.country,
      //? dateAdded: d.date_added,
      releaseYear: d.release_year,
      rating: d.rating,
      duration: d.duration,
      listedIn: d.listed_in,
    };
  }
  );

  // list of all the countries
  let countryList = [];
  data.forEach((d) => {
    d.country.split(",").forEach((country) => {
      country = country.trim();
      if (country !== "" && !countryList.includes(country)) {
        countryList.push(country);
      }
    });
  });

  // list of all the genres
  let genreList = [];
  data.forEach((d) => {
    d.listedIn.split(",").forEach((genre) => {
      genre = genre.trim();
      if (genre !== "" && !genreList.includes(genre)) {
        genreList.push(genre);
      }
    });
  });

  // list of all the years
  let yearList = [];
  data.forEach((d) => {
    if (d.releaseYear !== "" && !yearList.includes(d.releaseYear)) {
      yearList.push(d.releaseYear);
    }
  });

  // list of all the ratings
  let ratingList = [];
  data.forEach((d) => {
    if (d.rating !== "" && !ratingList.includes(d.rating)) {
      ratingList.push(d.rating);
    }
  });


  
  // get all the countries and the titles of the movies and tv shows in that country
  // TODO - not all the contries are in the map (Palastine, united kingdom, Soviet Union, etc.)
  let countries = {};
  data.forEach((d) => {
    d.country.split(",").forEach((country) => {
      country = country.trim();
      if (country !== "") {
        if (countries[country]) {
          countries[country].push(d.title);
        } else {
          countries[country] = [d.title];
        }
      }
    });
  });

  // get all the genres and the titles of the movies and tv shows in that genre
  let genres = {};

  data.forEach((d) => {
    d.listedIn.split(",").forEach((genre) => {
      genre = genre.trim();
      if (genre !== "") {
        if (genres[genre]) {
          genres[genre].push(d.title);
        } else {
          genres[genre] = [d.title];
        }
      }
    });
  });


  // get all the years and the titles of the movies and tv shows in that year
  let years = {};
  data.forEach((d) => {
    if (d.releaseYear !== "") {
      if (years[d.releaseYear]) {
        years[d.releaseYear].push(d.title);
      } else {
        years[d.releaseYear] = [d.title];
      }
    }
  });


  // TODO filter data


  return { data, countries, genres, years, countryList, genreList, yearList, ratingList};
}