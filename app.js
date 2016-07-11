var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

//Web scraping
url = 'http://ffc.com/eastlakeview/group-fitness/';

request(url, function(error, response, html) {
    if(!error){
        var $ = cheerio.load(html);

        var headerRow = $("table#scheduleList thead");
        var timeColumnNumber = $("th:contains('Time')", headerRow).index();
        var classNameAndDescriptionColumnNumber = $("th:contains('Class')", headerRow).index();
        var roomColumnNumber = $("th:contains('Room')", headerRow).index();
        var instructorColumnNumber = $("th:contains('Instructor')", headerRow).index();

        var className, time, room, instructor, description;

        var list = [];
        $("table#scheduleList tbody tr").not("tr.tod_head").each(function(index) {
            var $this = $(this);
            var tds = $("td", $this);

            className = tds.eq(classNameAndDescriptionColumnNumber).find("a").text().trim();
            description = tds.eq(classNameAndDescriptionColumnNumber).find("div.aviahide").text().trim();
            time = tds.eq(timeColumnNumber).text().trim();
            room = tds.eq(roomColumnNumber).text().trim();
            instructor = tds.eq(instructorColumnNumber).text().trim();


            list.push({
                className : className,
                description : description,
                time : time,
                room : room,
                instructor: instructor
            });
        });

        console.log(list.length);
    }
})

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;