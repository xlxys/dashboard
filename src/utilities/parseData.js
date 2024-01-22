

export default function parseData(data, options) {

  // TODO director and cast and listed_in need to to be splited and trimed
  // map data to array of objects
  data = data.map((d) => {
    return {
      id: d.show_id,
      type: d.type,
      title: d.title,
      director: d.director,
      cast: d.cast,
      country: d.country,
      // TODO dateAdded: d.date_added,
      releaseYear: d.release_year,
      rating: d.rating,
      duration: d.duration,
      listedIn: d.listed_in,
    };
  }
  );




  // type filter
  if (options.type["TV Show"]) {
    if (!options.type["Movie"]) {
      data = data.filter((d) => d.type === "TV Show");
    }
  }
  else {
    data = data.filter((d) => d.type === "Movie");
  }

  // country filter
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

  // year filter
  if (options.release_year !== null) {
    data = data.filter((d) => {
      return options.release_year.toString() === d.releaseYear
    })
  }
  console.log(options.genre)
  // genre filter
  if (options.genre !== "") {

    data = data.filter((d) => {
      if (options.genre !== null)
        return d.listedIn.includes(options.genre.toUpperCase())
      else
        return true
    })
  }


  
  // list of all the durations
  let durationList = [
    { "duration": "Long", "Movie": 0, "TV Show": 0 },
    { "duration": "Medium", "Movie": 0, "TV Show": 0 },
    { "duration": "Short", "Movie": 0, "TV Show": 0 },
    
  ];
  data.forEach((d) => {
    if (d.duration !== "") {
      if (d.duration.includes("min")) {
        let numberPart = parseInt(d.duration);
        if (numberPart < 80) {
          durationList[2]["Movie"]++;
        }
        else if (numberPart < 120) {
          durationList[1]["Movie"]++;
        }
        else {
          durationList[0]["Movie"]++;
        }

      } else if (d.duration.includes("Seasons")) {

        let numberPart = parseInt(d.duration.split(" Seasons")[0]);
        if (numberPart < 4) {
          durationList[2]["TV Show"]++;
        }
        else if (numberPart < 8) {
          durationList[1]["TV Show"]++;
        }
        else {
          durationList[0]["TV Show"]++;
        }
      } else {
        durationList[2]["TV Show"]++;
      }
    }

  })


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



  let castCount = {}
  data.forEach((d) => {
    d.cast.split(",").forEach((cast) => {
      cast = cast.trim();
      if (cast !== "") {
        if (castCount[cast]) {
          castCount[cast]++;
        } else {
          castCount[cast] = 1;
        }
      }
    });
  });



  let castList = Object.keys(castCount);
  castList.sort((a, b) => castCount[b] - castCount[a]);
  castList = castList.slice(0, 10);
  castList = castList.map((cast) => {
    return { "cast": cast, "count": castCount[cast] }
  }
  );

  

  let directorCount = {}
  data.forEach((d) => {
    d.director.split(",").forEach((director) => {
      director = director.trim();
      if (director !== "") {
        if (directorCount[director]) {
          directorCount[director]++;
        } else {
          directorCount[director] = 1;
        }
      }
    });
  });

  // keep only the top 10 directors
  let directorList = Object.keys(directorCount);
  directorList.sort((a, b) => directorCount[b] - directorCount[a]);
  directorList = directorList.slice(0, 10);
  directorList = directorList.map((director) => {
    return { "director": director, "count": directorCount[director] }
  }
  );






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

  return { data, countries, genres, years, genreList, ratingList, durationList, castList, directorList };
}