var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var searchInputVal= document.querySelector('#search-input');
var today = document.querySelector('#currentWeatherSection');
var recSer = document.querySelector('#recentSearches');
var APIKey = "a305d46d8e583055265454a4f817362a";
var queryUrl;
var todayWeather;
var resultCard;
function handleSearchFormSubmit(event) {
  event.preventDefault();

  searchInputVal= document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  addToRecent(searchInputVal);
  queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInputVal + "&appid=" +APIKey;
  searchApi(searchInputVal, APIKey);
}

function addToRecent(inputval){
  var serBut = document.createElement('button');
  serBut.innerHTML = inputval;
  serBut.addEventListener('click', searchAgain);
  localStorage.setItem("LastCity", inputval);
  recSer.append(serBut);
}

function searchAgain(event){
  event.preventDefault();
  console.log("clicked");
  console.log(event.target.innerHTML);
  var buttonTransfer = event.target.innerHTML;
  queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + buttonTransfer + "&appid=" +APIKey;
  searchApi(buttonTransfer, APIKey);
}



searchFormEl.addEventListener('submit', handleSearchFormSubmit);


function getParams() {
    var searchParamsArr = document.querySelector('#search-input').val;
    console.log(searchParamsArr);
    // Get the query and APIkey values
    var query = searchParamsArr;
    console.log(query + "= Query");
    console.log(APIKey + "=appid");
  
  
    searchApi(query, APIKey);
  }




  function searchApi(query, format) {
    var locQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    todayWeather = 'https://api.openweathermap.org/data/2.5/weather';
    console.log(format);
    locQueryUrl = locQueryUrl + '?q=' + query + "&appid=" + format + "&units=imperial";
    todayWeather = todayWeather + '?q=' + query + "&appid=" + format + "&units=imperial";
    getCurrentWeather(todayWeather);
    fetch(locQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
        resultTextEl.textContent = locRes.city.name;
  
        console.log(locRes);
  
        if (locRes.message == "city not found") {
          console.log('No results found!');
          resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
        } else {
          resultContentEl.textContent = '';
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  function printResults(resultObj) {
    console.log(resultObj);
  
    // set up `<div>` to hold result content
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
  
    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);
  
    var titleEl = document.createElement('h3');
    var realtime = moment.unix(resultObj.dt).format("MM/DD/YYYY");
    titleEl.textContent = realtime;

     var imgElement = document.createElement("img");
    var icon = resultObj.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
    imgElement.src = iconurl;
  
    var bodyContentEl = document.createElement('p');
  
      bodyContentEl.innerHTML =
        '<strong>Temperature:</strong> ' + resultObj.temp.day + '<br/>';
  
      bodyContentEl.innerHTML +=
        '<strong>wind speed:</strong> ' + resultObj.wind_speed + '<br/>';
   
        bodyContentEl.innerHTML +=
        '<strong>humidity:</strong> ' + resultObj.humidity;
  
  
    resultBody.append(titleEl, imgElement, bodyContentEl);
    resultContentEl.append(resultCard);
  }


function getCurrentWeather(todayWeather){
  fetch(todayWeather).then(function(response){
    return(response.json());
  }).then(function(data){
    today.innerHTML = '';
    var lat = data.coord.lat;
    var long = data.coord.lon;
    var headEl = document.createElement('h1');
    headEl.innerHTML = data.name;
    var uvVal = data.dt;
    var timeholder  = moment.unix(uvVal).format("MM/DD/YYYY");
    var timeEl = document.createElement('h2');
    timeEl.innerHTML = timeholder;
    getUVIndex(lat, long, headEl, timeEl);
  })
}


function getUVIndex(lat, long, headEl, timeEl){
  var holder = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + APIKey + "&units=imperial";
  fetch(holder).then(function(response){
    return(response.json());
  }).then(function(data){
    console.log(data);
    var temp = data.current.temp;
    var humidity =  data.current.humidity;
    var wind =  data.current.wind_speed;
    console.log(temp);
    console.log(humidity);
    console.log(wind);
    var tempEl = document.createElement('h3');
    var humidEl = document.createElement('h3');
    var windEl = document.createElement('h3');
    tempEl.innerHTML = '<strong>Temp:</strong> ' + temp + ' F<br/>';
    humidEl.innerHTML = '<strong>Humidity:</strong> ' + humidity + '%<br/>';
    windEl.innerHTML = '<strong>Wind Speed:</strong> ' + wind + ' MPH<br/>';
    var uvIDholder = data.current.uvi;
    console.log(data);
    var uvID = document.createElement('h3');
    if(uvIDholder>=0 && uvIDholder<=2){
      uvID.innerHTML = '<strong>UVI:</strong> ' + uvIDholder + ' UV-Green<br/>';
      //UV GREEN
     }else if(uvIDholder>2 && uvIDholder<=5){
      uvID.innerHTML = '<strong>UVI:</strong> ' + uvIDholder + ' UV-Yellow<br/>';
       //UV YELLOW
     }else if(uvIDholder>5 && uvIDholder<7){
      uvID.innerHTML = '<strong>UVI:</strong> ' + uvIDholder + ' UV-Orange<br/>';
       //UV ORANGE
     }else if(uvIDholder>=7 && uvIDholder<10){
      uvID.innerHTML = '<strong>UVI:</strong> ' + uvIDholder + ' UV-Red<br/>';
       //UV RED
     }else if(uvIDholder>=10){
      uvID.innerHTML = '<strong>UVI:</strong> ' + uvIDholder + ' UV-PURPLE<br/>';
       //UV PURPLE
     }
     
    resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
    resultCard.append(headEl, timeEl, tempEl, humidEl, windEl, uvID);
    today.append(resultCard);
    console.log(data.daily);
    for(var i=0; i<=4; i++){
      printResults(data.daily[i]);
    }
  })
}



function setButton(){
  var last = localStorage.getItem("LastCity");
  console.log(last);
  if(last!=null){
  var serBut = document.createElement('button');
  serBut.innerHTML = last;
  serBut.addEventListener('click', searchAgain);
  recSer.append(serBut);
  }
}
setButton();