function show_table(opts) {
    var target = opts.target;
    var column_names = opts.column_names;
    var columns = opts.columns;

    var result = function(data) {
        d3.select(target).selectAll("thead").remove();
        d3.select(target).selectAll("tbody").remove();
        if (!data.length) 
            return result;
        d3.select(target).append("thead").append("tr")
            .selectAll("td")
            .data(column_names)
            .enter()
            .append("td")
            .text(function(i) { return i; });
        d3.select(target)
            .append("tbody")
            .selectAll("tr")
            .data(data)
            .enter().append("tr")
            .selectAll("td")
            .data(columns)
            .enter().append("td")
            .text(function(i) { return i; });
        return result;
    };

    result.target = function(_) {
        if (!arguments.length) return target;
        target = _;
        return result;
    };
    result.column_names = function(_) {
        if (!arguments.length) return column_names;
        column_names = _;
        return result;
    };
    result.columns = function(_) {
        if (!arguments.length) return columns;
        columns = _;
        return result;
    };

    if (opts.data)
        result(opts.data);
    return result;
}
