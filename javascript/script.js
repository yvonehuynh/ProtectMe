// PSEUDO CODE

// 1. user enters the name of their city into the input bar
    // or geolocation automatically looks up their location
    // their location is shown on the screen
// 2. information on the UV index, weather condition, icon url, temperature in Celsius
// 3. if UV index is at a certain amount, spit out suggestions on what the user should do to protect themsleves
    // safety measures:
        // 1. hat
        // 2. sunscreen
        // 3. sun glasses
        // 4. staying indoors
// new changes:
    // automatic geolookup will retrieve the data for you based on your location
    // the person can even search up other cities as well to find out the weather conditions


// user inputs the location
// location is passed into the function



// WEATHER APP SECTION

// weather variable 
weatherApp = {};


// Firebase Stuff
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCOnaWUefFYRUpIqFoHoXLhecR0seMe82s",
    authDomain: "protectme-d25ea.firebaseapp.com",
    databaseURL: "https://protectme-d25ea.firebaseio.com",
    projectId: "protectme-d25ea",
    storageBucket: "",
    messagingSenderId: "150322686782"
};
firebase.initializeApp(config);

const dbref = firebase.database().ref();
const userRef = firebase.database().ref("/users");

// Function to adjust User Index
function appendIndex(sunscreen, hat, sunglasses, shade, hydrate) {
    $(".sunscreen").append(sunscreen);
    $(".hat").append(hat);
    $(".sunglasses").append(sunglasses);
    $(".shade").append(shade);
    $(".hydrate").append(hydrate);
};

// Function to adjust applicable background colour
function adjustColor(sliderBG, border, headerBG) {
    $(".first-flex").addClass(sliderBG);
    $(".color-align").addClass(border);
    $("h2, details").addClass(headerBG);
}

// Function to change user background according to UV index
function userIndex(colorBackground) {
    $(".second-cell").addClass(colorBackground);
}

// Get Weather Data API
function getUserIndex(){
    $(".myForm").on("submit", function(e){
        e.preventDefault();
        const sunscreen = $("input[name=sunscreen-amount]:checked").val();
        const hat = $("input[name=hat-amount]:checked").val();
        const eye = $("input[name=eye-amount]:checked").val();
        const water = $("input[name=sunscreen-amount]:checked").val();
        
        const newDate = new Date().toISOString();
        const currentDate = moment(newDate).format("DD-MMM-YYYY");

        userRef.push({
                date: currentDate,
                sunscreenlevel: sunscreen,
                hatlevel: hat,
                eyelevel: eye,
                waterlevel: water 
            })
 /*        $(".user-info").append(`<details class="user-details">
            <summary class="time-label">${currentDate}</summary>
            <p class="sun-level">Sunscreen Protection
                <span class="one">${sunscreen}</span>
            </p>
            <p class="hat-level">Hat protection
                <span class="2">${hat}</span>
            </p>
            <p class="eye-level">Eye Protection
                <span class="3">${eye}</span>
            </p>
            <p class="water-level">Hydrate Level
                <span class="4">${water}</span>
            </p>
        </details>`); */
        ///////////////

        $(".user-info").append("<details class=\"user-details\">" + 
           "<summary class=\"time-label\">" + currentDate + "</summary>" +
            "<p class=\"sun-level\">Sunscreen Protection" + 
                "<span class=\"one\">"+ + sunscreen + "</span>" + 
            "</p>" +
            "<p class=\"hat-level\">Hat protection" +
                "<span class=\"2\"\>" + hat + "/span>" +
            "</p>" +
            "<p class=\"eye-level\">Eye Protection" +
                "<span class=\"3\">" + eye + "</span>" +
            "</p>" +
            "<p class=\"water-level\">Hydrate Level" +
                "<span class=\"4\">" + water + "</span>" +
           " </p>" +
        "</details>");

         // Submit the above object to Firebase user
        // Do not worry about creating unique users, unless you have time

        // this pushes data to the user object in Firebase
    })
};

getUserIndex();

// Get weather function
weatherApp.getWeather = function (){
    $.ajax({
        url: "http://api.wunderground.com/api/b92997f42d10bef1/geolookup/conditions/q/autoip.json",
        method: "GET",
        dataType: "json",
      })
    .then(function(autoWeather) {
        weatherApp.displayAutoWeather(autoWeather.current_observation);
    })
}; // end getWeather function

// get user location weather
weatherApp.getUserWeather = function(province, city) {
     $.ajax({
        url: /* `https://api.wunderground.com/api/b92997f42d10bef1/conditions/q/${province}/${city}.json`, */
             "https://api.wunderground.com/api/b92997f42d10bef1/conditions/q/" + province + "/" + "city" + ".json",
        method: "GET",
        dataType: "json"
    })
        .then(function (userWeather){
            weatherApp.displayUserWeather(userWeather.current_observation);
    })
         .fail(function() {
             alert("Data not found. Please check spelling");
         })
}; // end getUserWeather function

// Display weather function
weatherApp.displayAutoWeather = function(selectWeatherInfo) {
    $(".UV-index").text(selectWeatherInfo.UV);
    $(".location").text(selectWeatherInfo.observation_location.city);
    $(".temp-in-c").text(selectWeatherInfo.temp_c);
    $(".weather-condition").text(selectWeatherInfo.weather);
    $(".wind-chill").text(selectWeatherInfo.windchill_c);
    $(".feels-like").text(selectWeatherInfo.feelslike_c);
    const text = "Did you wear your sunscreen today? Today's UV index is" + "selectWeatherInfo.UV";
    $(".twitter-share-button").attr("href", "https://twitter.com/share?ref_src=twsrc%5Etfw&text=${text}");
        if (selectWeatherInfo.UV <= 2) {
            appendIndex("reapply every 2 hours", "👒", "😎", "🍃", "💧");
            adjustColor("low", "low-border", "low-background");
        } else if (selectWeatherInfo.UV <= 5 && selectWeatherInfo.UV > 2) {
            appendIndex("reapply every 2 hours", "👒", "😎", "🍃", "💧");
            adjustColor("moderate", "moderate-border", "moderate-background");
        } else if (selectWeatherInfo.UV == 6 || selectWeatherInfo.UV == 7) {
            appendIndex("reapply every hour", "👒👒👒👒", "😎😎😎😎", "🍃🍃🍃🍃", "💧💧💧💧");
            adjustColor("high", "high-border", "high-background");
        } else if (selectWeatherInfo.UV <= 10 && selectWeatherInfo.UV > 7) {
            appendIndex("reapply every hour", "👒👒", "😎😎😎", "🍃🍃", "💧💧");
            adjustColor("very-high", "very-high-border", "very-high-background");
        } else if (selectWeatherInfo.UV >= 11) {
            $("h2, summary").addClass("extreme-background");
            appendIndex("reapply every hour", "👒👒👒👒", "😎😎😎😎", "🍃🍃🍃🍃", "💧💧💧💧");
            adjustColor("extreme", "extreme-border", "extreme-background");

    };
}; // end displayAutoWeather function

weatherApp.userInput = function () {
    $(".hello").on("submit", function (e) {
        e.preventDefault();
        const userInputProvince = $("#province").val().replace(/ /, "_");
        const userInputCity = $("#city").val().replace(/ /, "_");
        weatherApp.getUserWeather(userInputProvince, userInputCity);
        $('input').val('');
        weatherApp.displayUserWeather = function (userWeatherInfo) {
            $(".user-UV-index").text(userWeatherInfo.UV);
            $(".user-location").text(userWeatherInfo.observation_location.city);
            $(".user-temp-in-c").text(userWeatherInfo.temp_c).append("℃ ");
            $(".user-weather-condition").text(userWeatherInfo.weather);
            $(".user-wind-chill").text(userWeatherInfo.windchill_c);
            $(".user-feels-like").text(userWeatherInfo.feelslike_c).append("℃ ");
            if (userWeatherInfo.UV <= 2) {
                userIndex("low-background");
            } else if (userWeatherInfo.UV <= 5 && userWeatherInfo.UV > 2) {
                userIndex("moderate-background");
            } else if (userWeatherInfo.UV == 6 || userWeatherInfo.UV == 7) {
                userIndex("high-background");
            } else if (userWeatherInfo.UV <= 10 && userWeatherInfo.UV > 7) {
                userIndex("very-high-background");
            } else if (userWeatherInfo.UV >= 11) {
                userIndex("extreme-background");
            }
        };
    })
}; 

///////////////////

//////// Facts Array - Random Facts Generator /////////

let facts = [
    "most people only apply 25-50% of the recommended sunscreen amount",
    "Sunscreen begin to lose their protection power immediately when you sweat or are in contact with water",
    "You can get double the amount of UV exposure in the winter",
    "Snow can reflect up to 80% of UV radiation, causing sunburn in the winter",
    "Minimum of SPF 30+ recommended for everyday use",
    "Tanning beds can cause severe skin damage and should be avoided at all costs",
    "UV radiation can cause skin cancer, eye cataracts, early aging and sunburn",
    "Even when indoors, you can still get exposed to UV. Wear sunscreen, even when indoors",
    "Running? Sweating? Swimming? Skiing? If engaging in outside activities, apply sunscreen every hour",
    "IF you are just spending time outdoors, apply sunscreen every 2 hours for best protection",
    "There is nothing wrong with using an umbrella in the daytime, even when its not raining",
    "Snow and water reflect af lot of UV radiation",
        "SPF stands for Sun Protection Factor",
    "SPF partially protects you from UVB rays, but not UVA rays",
    "There are 2 types of UV: UVA and UVB",
    "UVB aka \"the burning rays\" cause damange to the superficial layers of the skin, like a tan",
    "Most sunscreen only protect against UVB rays, not UVA rays, which causes premature aging, and wrinkling",
    "In Japan and Korea, \"PA\" is used to indicate how well a sunscreen protects against UVA rays. PA+ is the lowest protection, PA++++ is the highest",
    "Applying sunscreen once during the day is not enough. You should reapply at least once depending on your activity",
    "There are two types of sunscreens: physical and chemical; each with their own unique purpose",
    "Choose a sunscreen that has both UVA and UVB protection, such as anything with broad or total spectrum",
    "UV rays can make your vision worse, without proper protection",
    "If you wear sunscreen and you still get a tan, it means you either did not reapply enough or your sunscreen is not strong enough"
];

function randomFacts() {
    const index = Math.floor(Math.random() * facts.length);
    const factGenerate = facts[index];
    $(".cool-facts").text(factGenerate);
    return factGenerate;
};
randomFacts();

// initialize function
weatherApp.init = function(){
    weatherApp.getWeather();
    weatherApp.userInput();
    $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true
    });
    
};


$(document).ready(function () {
    weatherApp.init();

    userRef.on("value", function (snapshot) {
        $(".user-info").empty();
        let userItems = snapshot.val();
        for (let items in userItems) {
            const myTime = moment(userItems[items]["date"]).format("DD-MMM-YYYY");
          /*   $(".user-info").append(`<details class="user-details">
            <summary class="time-label">${myTime}</summary>
            <p class="sun-level">Sunscreen Protection:
                <span class="logged-info">${userItems[items].sunscreenlevel}</span>
            </p>
            <p class="hat-level">Hat protection:
                <span class="logged-info">${userItems[items]["hatlevel"]}</span>
            </p>
            <p class="eye-level">Eye Protection:
                <span class="logged-info">${userItems[items]["eyelevel"]}</span>
            </p>
            <p class="water-level">Hydrate Level:
                <span class="logged-info">${userItems[items]["waterlevel"]}</span>
            </p>
        </details >`); */
        

            $(".user-info").append("<details class=\"user-details\">" +
            "<summary class=\"time-label\">${myTime}</summary>" +
            "<p class=\"sun-level\">Sunscreen Protection:" +
                "<span class=\"logged-info\">" + userItems[items].sunscreenlevel + "</span>" +
            "</p>" +
           " <p class=\"hat-level\">Hat protection:" +
                "<span class=\"logged-info\">" + userItems[items].hatlevel + "</span>" +
           " </p>" +
            "<p class=\"eye-level\">Eye Protection:" +
               "<span class=\"logged-info\">" + userItems[items].eyelevel+ "</span>" +
           " </p>" +
            "<p class=\"water-level\">Hydrate Level:" +
                "<span class=\"logged-info\">" + userItems[items].waterlevel + "</span>" +
            "</p>" +
        "</details >");
        }
    })



});

