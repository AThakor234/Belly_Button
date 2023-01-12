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
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
    // 3. Create a variable that holds the samples array. 
    let sample_array = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let sample_number = []
    sample_array.forEach(sample_element =>{   
      if (sample_element.id == sample) {
        sample_number.push(sample_element)
      }
    })
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let sample_metadata_array = data.metadata;
    let sample_filtered_metadata = [];
    sample_metadata_array.forEach(element =>{  
      if (element.id == sample) {
        sample_filtered_metadata.push(element)
      }
    })

    //  5. Create a variable that holds the first sample in the array.
    let sample_first = sample_number[0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    let sample_metadata_first = sample_filtered_metadata[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let sample_otu_id = sample_first.otu_ids
    let sample_labels = sample_first.otu_labels
    let sample_values = sample_first.sample_values

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let washingFrequency = parseFloat(sample_metadata_first.wfreq).toFixed(2);
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let yticks = sample_otu_id.sort(function(a, b){return b-a}).slice(0,10)
    let xvalues = sample_values.sort(function(a, b){return b-a}).slice(0,10)
    let hoverText = sample_labels.sort();
    hoverText = hoverText.reverse().slice(0,10);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x : xvalues,
      y : yticks,
      type: "bar",
      orientation: 'h',
      text: hoverText,
      width : 14,

    }

    // 9. Create the layout for the bar chart. 
    var layout = {
      title: 'Top 10 Bacteria Cultures Found',
      barmode: 'stack',
    };
      
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [trace],layout); 

    // Deliverable 2: 1. Create the trace for the bubble chart.
    let y = sample_otu_id;
    let x = sample_values;
    var bubbleTrace = {
      x : y,
      y : x,
      text: hoverText,
      mode: 'markers',
      marker: {
        size:xvalues,
        color:yticks,
      },
    }
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'hoverclosest',
      height: 500,
      width : 1000,
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleTrace],bubbleLayout); 

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gauageTrace = {
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      title: {
        text:
          "<br><b><span style='font-size:1em;'>Belly Button Washing Frequency</span></b><br><span style='font-size:0.7em;'>Scrubs per Week</span>"
      },
      gauge: { axis: { range: [0, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" },
        ],
      },
      

    }
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gauageLayout = {
   
      height: 400,
      width : 500,
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gauageTrace],gauageLayout); 
  });

    
}
    
  
  