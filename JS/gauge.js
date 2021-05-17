function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

      // 3. Create a variable that holds the samples array. 
      let samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      let results = samples.filter(s => s.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      let current = results[0];

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let mdata = data.metadata;
    // Create a variable that holds the first sample in the array.
    let mresults = mdata.filter(s => s.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    let mcurrent = mresults[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = current.otu_ids;
    let otu_labels = current.otu_labels;
    let sample_values = current.sample_values;

    // 3. Create a variable that holds the washing frequency.
    let wash = parseFloat(mcurrent.wfreq)

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).reverse();
    yticks = yticks.map(x => `id ${x}`);

    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial cultures",
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        mode: "markers",
        marker: {
            color: otu_ids, 
            colorscale: "RdBu",
            size: sample_values,
        }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria for Sample",
      hovermode: "closest",
      xaxis: {title:"id"},
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    // D2: 3. Use Plotly to plot the data with the layout.
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {
        x: [0,1],
        y: [0,1]
      },
      value: wash,
      title: "<b>wahsing frequency</b><br>Per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {
          color: "black",
        },
        axis: {
          range: [null, 10],
        },
        steps: [
          {
            range: [0,2], color: "red"
          },
          {
            range: [2,4], color: "green"
          },
          {
            range: [4,6], color: "yellow"
          },
          {
            range: [6,8], color: "blue"
          },
          {
            range: [8,10], color: "orange"
          }
        ],
      }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 500,
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}
