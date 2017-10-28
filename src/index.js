d3.csv('diabetes2015.csv', data => {
        
   // Assemble a summary string.
   const summary = [
     'Data table summary: ',
      data.length + ' rows',
      data.columns.length + ' columns',
      Math.round(d3.csvFormat(data).length / 1024) + ' kB',
      '\nSummary of each column:',
      dl.format.summary(data)
    ].join('\n');
        
    // Show the summary string on the page.
    d3.select('body').append('pre').text(summary);
        
    // Log the summary to the console.
    console.log(summary);
});
