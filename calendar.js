// Taking http://bl.ocks.org/4063318 and generalizing a bit

function make_calendar_view(opts)
{
    var csv = opts.data;
    var key = opts.date;
    var rollup = opts.group;
    var year_range = opts.year_range;
    var fill = opts.fill;
    var tooltip = opts.tooltip || function() { return ""; };
    var click = opts.click;
    var cellSize = opts.cell_size || 17;
    var height = opts.height || cellSize * 8;
    var width = opts.width || cellSize * 53 + 59; // gives 960 in the default case

    var data = d3.nest()
        .key(key)
        .rollup(rollup)
        .map(csv);
    data = _.object(_.map(data, function(v, k) {
        return [k, { key: new Date(k), rollup: v }];
    }));

    function wrap_on_rollup(f) {
        return function(d) {
            return f(data[d].key, data[d].rollup);
        };
    };

    if (!year_range) {
        var years = _.map(data, function(v) { 
            return v.key.getFullYear();
        });
        var mn = d3.min(years);
        var mx = d3.max(years)+1;
        year_range = [mn, mx];
    }

    var day = d3.time.format("%w"),
    week = d3.time.format("%U");

    var svg = d3.select(opts.target).selectAll("svg")
        .data(d3.range(year_range[0], year_range[1]))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; })
        .attr("y", function(d) { return day(d) * cellSize; })
        .datum(String);

    rect.append("title")
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);

    var q = rect.filter(function(d) { 
        return d in data; 
    });

    q.style("fill", wrap_on_rollup(fill));

    if (click) {
        q.style("cursor", "pointer");
        q.on("click", wrap_on_rollup(click));
    }
    q.select("title")
        .text(wrap_on_rollup(tooltip));

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = +day(t0), w0 = +week(t0),
        d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }
}
