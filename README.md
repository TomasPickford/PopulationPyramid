# The Chart Class #

### Application ###

This class produces a population pyramid that compares the male and female population in 5 year age ranges. Unlike conventional population pyramids, both sexes are plotted on the same axis such that the translucent bars overlap. This makes comparisons much easier to gauge at a glance. The class takes data input for multiple decades, and provides animations for transitioning between them. This illustrates how the population born in a certain range of five years tends to decrease as the user moves forward in time.


### Data Input ###

The data enters the class as a single object. It must be manipulated into the correct form before being passed as a parameter.
The object consists of multiple layers of data structures:
1. The object is a dictionary, with decades (in the number data type) as the keys.
2. The values corresponding to each of these keys are themselves dictionaries. These represent the 5-year age ranges as recorded in that decade. The keys are the lowest year in the ranges (again in the number data type).
3. Each of these age ranges have as the value an array of length 2. At index 0 we have the male population, and at index 1 we have the female population (both in the number data type).

The data may easily be manipulated into this form by creating a CSV file with the columns year, age, sex, and people with sort priority in that order. It may then be parsed with d3.csv(). The final step is to convert the values from strings to numbers, except for the sex values (which remain as 0s and 1s in string format).

All other parameters are optional as default values are provided by the class.

### General Usage ###

The constructor function automatically creates the chart from the given parameters, by calling four other methods:
1. setup()
2. addTitle()
3. addAxes()
4. addBars()

As the user, you will never need to call these functions.

You may however want to use these functions:
- getStartYear()
- getCurrentYear()
- getEndYear()
- setCurrentYear()
- update()

Their use is explained in the class documentation under methods.


## Sources ##

### Initial Code ###
The original code was written by Mike Bostock, and released under the GNU General Public License, version 3.
His project is hosted at this website: https://bl.ocks.org/mbostock/4062085


### Dataset ###
The data was extracted from UNdata. Their licensing information can be found at https://data.un.org/Host.aspx?Content=UNdataUse.

The exact search from which data was downloaded can be followed at http://data.un.org/Data.aspx?d=POP&f=tableCode%3a22%3bcountryCode%3a724%3brefYear%3a1960%2c1970%2c1980%2c1990%2c2000%2c2010%3bareaCode%3a0%3bsexCode%3a1%2c2&c=2,3,6,8,10,15,16&s=_countryEnglishNameOrderBy:asc,refYear:desc,areaCode:asc&v=1.

## License ##

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details http://www.gnu.org/licenses/.