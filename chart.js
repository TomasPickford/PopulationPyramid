/**
 * The class representing the Population Pyramid.
 */
class Chart {
    /**
     * Accepts parameters, creates class properties and finally calls setup(), addTitle(), addAxes() and addBars() to build the chart.
     * @constructor
     * @param {dictionary} data - The data object consisting of a dictionary of dictionaries or arrays. An in-depth explanation is in the README.md file.
     * @param {number} width - The width of the chart in pixels. Recommended minimum of 500.
     * @param {number} height - The height of the chart in pixels. Recommended minimum of 200.
     * @param {number} barScale - A number between 0 and 1 used to determine the width of a bar relative to its maximum (where it touches the adjacent bars).
     * @param {number} yAxisDP - The number of decimal places displayed for population labels on the y-axis, which are in millions.
     * @param {number} transDur - The duration of transitions in milliseconds, used by the function update().
     * @param {dictionary} margin - Defines the width of all 4 margins with keys "top", "right", "bottom" and "left"
     * @example // initialision of the class with example parameters
     * chart = new Chart(data,960,500,0.9,1,500,{ top: 50, right: 30, bottom: 30, left: 30 });
     */
    constructor (data, width = 800, height = 500, barScale = 0.8, yAxisDP = 1, transDur = 750, margin = { top: 20, right: 40, bottom: 30, left: 20 }) {
        this.data = data;
        this.age1 = d3.max(this.data, function (d) { return d.age; }); // the greatest age in the data
        this.year0 = d3.min(this.data, function (d) { return d.year; }); // the earliest decade in the data
        this.year1 = d3.max(this.data, function (d) { return d.year; }); // the latest decade in the data
        this.year = this.year1; // the year initially shown will be the lastest year

        this.margin = margin;
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.barWidth = Math.floor((this.width / 16) * barScale); // if 0 < barScale < 1 there will be no overlap with other bars

        this.yAxisDP = yAxisDP; // used in setup()
        this.transDur = transDur; // used in update()

        // these functions are only called by the constructor, when the class is initialised
        this.setup();
        this.addTitle();
        this.addAxes();
        this.addBars();
    }

    /**
     * Calculates the scales of the axes, creates the SVG element and manipulates the data structure.
     * This is the first function to be called by the constructor.
     * The user will not need to call this function ever.
     */
    setup () {
        const that = this; // used to refer the the class object when within anonymous functions

        this.x = d3.scale.linear()
            .range([this.barWidth / 2, this.width - this.barWidth / 2])
            .domain([this.year1 - this.age1, this.year1]);

        this.y = d3.scale.linear()
            .range([this.height, 0])
            .domain([0, d3.max(this.data, function (d) { return d.people; })]);

        // this is later used in the function addAxes()
        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient('right')
            .tickSize(-this.width)
            //* takes the yAxisDP parameter and calculates the labels in millions to the specified number of decimal places. */
            .tickFormat(function (d) { return (d / 1e6).toFixed(that.yAxisDP) + 'M'; });

        // An SVG element with a bottom-right origin
        this.svg = d3.select('body').append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // A sliding container to hold the bars by birthyear
        this.birthyears = this.svg.append('g')
            .attr('class', 'birthyears');

        // Produce a map from year and birthyear to [male, female]
        this.data = d3.nest()
            .key(function (d) { return d.year; })
            .key(function (d) { return d.year - d.age; })
            .rollup(function (v) { return v.map(function (d) { return d.people; }); })
            .map(this.data);
    }

    /**
     * Creates a text element that initially displays the last decade in the dataset.
     * This is the second function to be called by the constructor.
     * The user will not need to call this function ever.
     */
    addTitle () {
        this.title = this.svg.append('text')
            .attr('class', 'title') // places it into the CSS 'title' class for custom font and colour
            .attr('dy', '.71em')
            .text(this.year1); // the text is initiallyset to the last year in the dataset
    }

    /**
     * Draws the lines of the axis and all their labels.
     * This is the third function to be called by the constructor.
     * The user will not need to call this function ever.
     */
    addAxes () {
        const that = this; // used to refer the the class object when within anonymous functions

        // Add an axis to show the population values
        this.svg.append('g')
            .attr('class', 'y axis') // places it into the CSS 'y axis' class
            .attr('transform', 'translate(' + this.width + ',0)')
            .call(this.yAxis)
            .selectAll('g')
            .filter(function (value) { return !value; })
            .classed('zero', true);

        // Add labels to show age. These arre separate to the sliding container so are not animated)
        this.svg.selectAll('.age')
            .data(d3.range(0, this.age1 + 1, 5))
            .enter().append('text')
            .attr('class', 'age') // places it into the CSS 'age' class for text anchoring
            .attr('x', function (age) { return that.x(that.year - age); })
            .attr('y', this.height + 4)
            .attr('dy', '.71em')
            .text(function (age) { return age; });
    }

    /**
     * Draws the translucent bars with their labels. The labels show the years the different age ranges were born in.
     * This is the fourth and final function to be called by the constructor after the class is initialised.
     * The user will not need to call this function ever.
     */
    addBars () {
        const that = this; // used to refer the the class object when within anonymous functions

        // Add labeled rects for each birthyear (so that no enter or exit is required)
        this.birthyear = this.birthyears.selectAll('.birthyear')
            .data(d3.range(this.year0 - this.age1, this.year1 + 1, 5))
            .enter().append('g')
            .attr('class', 'birthyear') // places it into the CSS 'birthyear' class for colouring
            .attr('transform', function (birthyear) { return 'translate(' + that.x(birthyear) + ',0)'; });

        this.birthyear.selectAll('rect')
            .data(function (birthyear) { return that.data[that.year][birthyear] || [0, 0]; })
            .enter().append('rect')
            .attr('x', -this.barWidth / 2)
            .attr('width', this.barWidth)
            .attr('y', this.y)
            .attr('height', function (value) { return that.height - that.y(value); });

        // Add labels to show birthyear.
        this.birthyear.append('text')
            .attr('y', this.height - 4)
            .text(function (birthyear) { return birthyear; });
    }

    /**
     * If the current year has been changed, when explicitly called, this function animates the bars to show the different data.
     * If the newly chosen year is not in the dataset, the chart will not be updated.
     */
    update () {
        const that = this; // used to refer the the class object when within anonymous functions

        if (!(this.year in this.data)) return; // ensure there is data for the requested year
        this.title.text(this.year); // update the title to the newly chosen year

        this.birthyears.transition()
            .duration(this.transDur)
            .attr('transform', 'translate(' + (this.x(this.year1) - this.x(this.year)) + ',0)');

        this.birthyear.selectAll('rect')
            .data(function (birthyear) { return that.data[that.year][birthyear] || [0, 0]; })
            .transition()
            .duration(this.transDur)
            .attr('y', this.y)
            .attr('height', function (value) { return that.height - that.y(value); });
    }

    /**
     * Get the first decade available in the dataset.
     * @return {number} The first decade
     */
    getStartYear () {
        return this.year0;
    }

    /**
     * Get the currently displayed decade.
     * @return {number} The currently visualised decade
     */
    getCurrentYear () {
        return this.year;
    }

    /**
     * Get the last decade available in the dataset.
     * @return {number} The last decade
     */
    getEndYear () {
        return this.year1;
    }

    /**
     * Sets the year to be displayed.
     * Changes will not be visible until the update() function has been called.
     * @param {number} year - The decade that will next be displayed. This must exactly match a year in the data, which by convention is the start of a decade.
     */
    setCurrentYear (year) {
        this.year = year;
    }
}
