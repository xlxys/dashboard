export default function parseData(data, options) {

  // TODO director and cast and listed_in need to to be splited and trimed
  // map data to array of objects
  data = data.map((d) => {
    return {
      id: d.show_id,
      type: d.type,
      title: d.title,
      // TODO director: d.director,
      // TODO cast: d.cast,
      country: d.country,
      // TODO dateAdded: d.date_added,
      releaseYear: d.release_year,
      rating: d.rating,
      duration: d.duration,
      listedIn: d.listed_in,
    };
  }
  );

  // TODO filter data based on options
  if (options.type["TV Show"]) {
    if (!options.type["Movie"]) {
      data = data.filter((d) => d.type === "TV Show");
    }
  }
  else {
    data = data.filter((d) => d.type === "Movie");
  }

  if (options.country.length > 0) {
    
    data = data.filter((d) => {
      let found = false;
      d.country.split(",").forEach((country) => {
        country = country.trim();
        if (options.country.includes(country)) {
          found = true;
        }
      });
      return found;
    });
  }


  // list of all the ratings
  let ratingList = [];
  data.forEach((d) => {
    if (d.rating !== "" && !ratingList.includes(d.rating)) {
      ratingList.push(d.rating);
    }
  });

  
  // get all the countries and the titles of the movies and tv shows in that country
  // TODO - not all the contries are in the geojson file (Palastine, united kingdom, Soviet Union, etc.)
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

  let genreList = Object.keys(genres);


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


  console.log(years);



  return { data, countries, genres, years, genreList, ratingList};
}