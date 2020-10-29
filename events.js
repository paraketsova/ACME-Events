const database = new Database();

document.addEventListener("DOMContentLoaded", () => {
  displayEvents();

  const btnSort = document.getElementById('btnSort');
  const btnFilters = document.getElementById('btnFilters');

  let filterDate = document.getElementById('filterDate');
  let fromDate = document.getElementById('fromDate');
  let toDate = document.getElementById('toDate');

  filterDate.addEventListener('change', e => {
    /*
    if(e.target.checked){
      fromDate.disabled = false;
      toDate.disabled = false;
    } else {
      fromDate.disabled = true;
      toDate.disabled = true;
    }
    */
    fromDate.disabled = !e.target.checked;
    toDate.disabled = !e.target.checked;

  });


  btnSort.addEventListener('click', () => {
    updateSorting ();
    
    displayEvents();
  });

  btnFilters.addEventListener('click', () => {
    updateFilters ();
    displayEvents();
  });
});

// Default values for sorting and filters
let sorting = 'byDate';
let filters = {
  date: {
    enabled: false
  },
  format: {
    enabled: false
  }
};

function displayEvents() { 
  let events = database.readDataFromStorage();

  // Filter events using filters

  if (filters.date.enabled) {
    // Filter by date
    const inputFromDate = document.getElementById('fromDate');
    let fromDate = null;
    if (inputFromDate.value !== '') {
      fromDate = new Date(inputFromDate.value);
    }

    const inputToDate = document.getElementById('toDate');
    let toDate = null;
    if (inputToDate.value !== '') {
      toDate = new Date(inputToDate.value);
    }
    
    events = events.filter((e) => {
      const eDate = new Date(e.date);
      if (fromDate !== null && eDate < fromDate) {
        return false;
      }
      if (toDate !== null && eDate > toDate) {
        return false;
      }
      return true;
    });
  }

  if (filters.format.enabled) {
    // Filter by format=====================!!!

    const inputToFormat = document.getElementById('filterFormat');
    const inputConference = document.getElementById('filterConference');
    const inputClass = document.getElementById('filterClass');
    const inputNetworking = document.getElementById('filterNetworking');
    console.log(filters.format); //TEST
    
    if (inputToFormat.value !== '') {
      if (inputConference.checked) {
        checkFilter("conference")
      } else if (inputClass.checked) {
        checkFilter("class")
      } else if (inputNetworking.checked) {
        checkFilter("networking")
      }
    }
    function checkFilter(eventType) {
      let fformat = eventType;
      events = events.filter((e) => {
        const eFormat = e.format;
        if (fformat !== '' && eFormat === fformat) {
          return true;
        }
      })
    }
  }

  // Sort events using sorting
  if (sorting === 'byName') {
    events.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
  } else if (sorting === 'byDate') {
    events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  }

  let divEventsList = document.getElementById('divEventsList');
  divEventsList.innerHTML = '';

  let tableEventsList = document.createElement('table');
  tableEventsList.id = 'tableEventsList';
  divEventsList.appendChild(tableEventsList);

  let tr1TableEventsL = document.createElement('tr');
  tr1TableEventsL.id = 'tr1TableEventsL';
  tableEventsList.appendChild(tr1TableEventsL);

  let dateThTableEventsL = document.createElement('th');
  dateThTableEventsL.id = 'dateTableEventsL';
  dateThTableEventsL.innerHTML = 'Date';
  tr1TableEventsL.appendChild(dateThTableEventsL);

  let formatThTableEventsL = document.createElement('th');
  formatThTableEventsL.id = 'formatThTableEventsL';
  formatThTableEventsL.innerHTML = 'Format';
  tr1TableEventsL.appendChild(formatThTableEventsL);

  let nameThTableEventsL = document.createElement('th');
  nameThTableEventsL.id = 'nameThTableEventsL';
  nameThTableEventsL.innerHTML = 'Name';
  tr1TableEventsL.appendChild(nameThTableEventsL);


  events.forEach((item) => {              //  skapa en rad för varje event från Events array
    let trTableEventsL = document.createElement('tr');
    trTableEventsL.id = 'trTableEventsL' + item.id;
    tableEventsList.appendChild(trTableEventsL);

    let dateTrTableEventsL = document.createElement('td');
    dateTrTableEventsL.id = 'dateTrTableEventsL' + item.id;
    dateTrTableEventsL.innerHTML = item.date;
    trTableEventsL.appendChild(dateTrTableEventsL);

    let formatTrTableEventsL = document.createElement('td');
    formatTrTableEventsL.id = 'formatThTableEventsL' + item.id;
    formatTrTableEventsL.innerHTML = item.format;
    trTableEventsL.appendChild(formatTrTableEventsL);

    let nameTrTableEventsL = document.createElement('td');
    nameTrTableEventsL.id = 'nameTrTableEventsL' + item.id;
    nameTrTableEventsL.innerHTML = item.name;
    trTableEventsL.appendChild(nameTrTableEventsL);
  });
}

function updateSorting() {
  let name = document.getElementById('byName');
  if (name.checked) {
    sorting = 'byName';
  } else {
    sorting = 'byDate';
  }
  console.log(sorting); //TEST
}

function updateFilters() {
  let filterDate = document.getElementById('filterDate');
  let fromDate = document.getElementById('fromDate');
  let toDate = document.getElementById('toDate');

  let filterFormat = document.getElementById('filterFormat');
  let filterConference = document.getElementById('filterConference');
  let filterClass = document.getElementById('filterClass');
  let filterNetworking = document.getElementById('filterNetworking');

  filters = {
    date: {
      enabled: filterDate.checked,
      from: fromDate.value,
      to: toDate.value,
    },
    format: {
      enabled: filterFormat.checked,
      filterConference: filterConference.checked,
      filterClass: filterClass.checked,
      filterNetworking: filterNetworking.checked,
    }
  }
  console.log(filters); //TEST
}