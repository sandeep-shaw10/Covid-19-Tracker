/*--------Data element---------*/
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  dates = [],
  formatedDates = [];

// GET USERS COUNTRY CODE
let country_code = "IN"; //geoplugin_countryCode(); <--[Use this in local server]
let user_country;
country_list.forEach((country) => {
  if (country.code == country_code) {
    user_country = country.name;
  }
});

console.log(user_country);

//api fetch
function fetchData(country) {
    user_country = country;
    country_name_element.innerHTML = "Loading...";
  
    //refreshing the list or destroying old data
    (cases_list = []),
      (recovered_list = []),
      (deaths_list = []),
      (dates = []),
      (formatedDates = []);
  
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    //Waiting till the data for CONFIRMED from the country is returned [promise]
    const api_fetch = async (country) => {
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/confirmed",
        requestOptions
      )
      //On being returned converting it into readable JSON form
        .then((res) => {
          return res.json();
        })

        //pushing th case list and dates in array
        .then((data) => {
          data.forEach((entry) => {
            dates.push(entry.Date);
            cases_list.push(entry.Cases);
          });
        });
//Waiting till the data for RECOVERED from the country is returned [promise]  
      await fetch(
        "https://api.covid19api.com/total/country/" +
          country +
          "/status/recovered",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
                //pushing th case list and dates in array
        .then((data) => {
          data.forEach((entry) => {
            recovered_list.push(entry.Cases);
          });
        });
//Waiting till the data for Death from the country is returned [promise]   
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/deaths",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            deaths_list.push(entry.Cases);
          });
        });
        //After fetching the data it updates the content *ptr1
      updateUI();
    };
  
    api_fetch(country);
}

//Main fuction of app fetch called 
fetchData(user_country);
  
  // UPDATE UI FUNCTION [ *ptr1(t) updating chart and statistics *ptr2 ]
  function updateUI() {
    updateStats();
    axesLinearChart();
  }
  
  //updating and rendering data [ *ptr2(t) ]
  function updateStats() {
    // Calculating the data
    const total_cases = cases_list[cases_list.length - 1];
    const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];
  
    const total_recovered = recovered_list[recovered_list.length - 1];
    const new_recovered_cases = total_recovered - recovered_list[recovered_list.length - 2];
  
    const total_deaths = deaths_list[deaths_list.length - 1];
    const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
  
    //Rendering the data in html
    country_name_element.innerHTML = user_country;
    total_cases_element.innerHTML = total_cases;
    new_cases_element.innerHTML = `+${new_confirmed_cases}`;
    recovered_element.innerHTML = total_recovered;
    new_recovered_element.innerHTML = `+${new_recovered_cases}`;
    deaths_element.innerHTML = total_deaths;
    new_deaths_element.innerHTML = `+${new_deaths_cases}`;
  
    // format dates
    dates.forEach((date) => {
      formatedDates.push(formatDate(date));
    });
  }
  
  // UPDATE CHART [ *ptr2(t) destroying previous data & updating chart ]
  let my_chart;
  function axesLinearChart() {
    if (my_chart) {
      my_chart.destroy();
    }
  
    my_chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Cases",
            data: cases_list,
            fill: false,
            borderColor: "#FFF",
            backgroundColor: "#FFF",
            borderWidth: 1,
          },
          {
            label: "Recovered",
            data: recovered_list,
            fill: false,
            borderColor: "#009688",
            backgroundColor: "#009688",
            borderWidth: 1,
          },
          {
            label: "Deaths",
            data: deaths_list,
            fill: false,
            borderColor: "#f44336",
            backgroundColor: "#f44336",
            borderWidth: 1,
          },
        ],
        labels: formatedDates,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    }
  
  // FORMAT DATES
  const monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  function formatDate(dateString) {
    let date = new Date(dateString);
        if(date.getMonth()<=0){
            console.log(date.getDate()+" "+date.getMonth()+" "+monthsNames[11-date.getMonth()]);
            return `${date.getDate()} ${monthsNames[11-date.getMonth()]}`;
        }else{
            console.log(date.getDate()+" "+date.getMonth()+" "+monthsNames[date.getMonth() - 1]);
            return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
        }
    }
