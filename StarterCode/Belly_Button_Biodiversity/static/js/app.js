function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((data) => {
    var sampleMetadata = d3.select("#sample-metadata");

    sampleMetadata.html("");
  

  Object.entries(data).forEach(([key, value]) => {
    sampleMetadata.append("h6").text(`${key}: ${value}`);
  });

  // htmlSampleMetadata.html(`${sampleMetadata}`);

  });
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    
    console.log(data);

    var bubbleTrace = {
      type: "scatter",
      mode: "marker",
      name: "Belly Buttons",
      text: "otu_labels",
      x: data.otu_ids,
      y: data.sample_values,
      marker: {
        size : "sample_values",
        color: "otu_ids"}
    };
    var data = [trace];

    var bubbleLayout = {
      margin: {t:0},
      hovermode: "closest",
      xaxis: {
        title: "OTU ID",
      }
    };

    Plotly.plot("bubble", bubbleTrace, bubbleLayout);
  });  

    var pieData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];

    var pieLayout = {
      margin: { t: 0, l: 0 }s
    };

    Plotly.plot("pie", pieData, pieLayout);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();