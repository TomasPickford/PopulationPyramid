var chart; // a global reference to the chart object for other page elements to be able to access its methods

d3.csv('population.csv', function (_error, data) {
    // Convert strings to numbers
    data.forEach(function (d) {
        d.people = +d.people;
        d.year = +d.year;
        d.age = +d.age;
    });
    chart = new Chart(data, 960, 500, 0.9, 1, 500, { top: 50, right: 30, bottom: 30, left: 30 });
    displayRange(); // update a <p> element dependent on the data passed to chart
});

function next () {
    const year = chart.getCurrentYear();
    const limit = chart.getEndYear();
    if (year < limit) {
        chart.setCurrentYear(year + 10);
        chart.update(); // animate the transition to show the new data
    }
}

function previous () {
    const year = chart.getCurrentYear();
    const limit = chart.getStartYear();
    if (year > limit) {
        chart.setCurrentYear(year - 10);
        chart.update(); // animate the transition to show the new data
    }
}

function displayRange () {
    document.getElementById('range_display').innerHTML = 'The range of this dataset is '.concat((chart.getEndYear() - chart.getStartYear()).toString(), ' years.');
}
