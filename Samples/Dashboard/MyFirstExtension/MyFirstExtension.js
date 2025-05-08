console.log('JS loaded');
// Initialize the extension with context menu configuration
tableau.extensions.initializeAsync({
    configure: {
        contextMenu: {
            items: []
        }
    }
}).then(() => {
    // Get the dashboard object
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    
    // Get UI elements
    const messageDiv = document.getElementById('message');
    const refreshButton = document.getElementById('refreshButton');
    const getDataButton = document.getElementById('getDataButton');

    // Update message with dashboard name
    messageDiv.textContent = `Connected to dashboard: ${dashboard.name}`;

    // Add click handler for refresh button
    refreshButton.addEventListener('click', () => {
        tableau.extensions.dashboardContent.dashboard.refreshAsync()
            .then(() => {
                messageDiv.textContent = 'Dashboard refreshed successfully!';
            })
            .catch(error => {
                messageDiv.textContent = `Error refreshing dashboard: ${error.message}`;
            });
    });

    // Add click handler for get data button
    getDataButton.addEventListener('click', async () => {
        try {
            // Get all worksheets in the dashboard
            const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
            
            if (worksheets.length === 0) {
                messageDiv.textContent = 'No worksheets found in the dashboard.';
                return;
            }

            // Get data from the first worksheet
            const worksheet = worksheets[0];
            const dataTable = await worksheet.getSummaryDataAsync();
            
            // Display some basic information about the data
            const rowCount = dataTable.data.length;
            const columnCount = dataTable.columns.length;
            messageDiv.textContent = `Worksheet "${worksheet.name}" has ${rowCount} rows and ${columnCount} columns.`;
            
        } catch (error) {
            messageDiv.textContent = `Error getting worksheet data: ${error.message}`;
        }
    });

}).catch(error => {
    console.error('Error initializing extension:', error);
    document.getElementById('message').textContent = `Error initializing extension: ${error.message}`;
}); 