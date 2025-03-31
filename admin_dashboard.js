// Initialize WebSocket connection for screen streaming
const socket = io('/screen', {
    transports: ['websocket'],
    withCredentials: true
});

// Function to handle incoming screen data
function handleScreenData(data) {
    const { staffId, screenImage } = data;

    // Find or create a canvas for the staff member
    let canvas = document.getElementById(`screen-canvas-${staffId}`);
    if (!canvas) {
        const container = document.getElementById('screen-streams-container');
        const staffDiv = document.createElement('div');
        staffDiv.id = `staff-stream-${staffId}`;
        staffDiv.innerHTML = `
            <h3>Staff ID: ${staffId}</h3>
            <canvas id="screen-canvas-${staffId}" width="1280" height="720"></canvas>
        `;
        container.appendChild(staffDiv);
        canvas = document.getElementById(`screen-canvas-${staffId}`);
    }

    // Draw the screen image on the canvas
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = `data:image/png;base64,${screenImage}`;
}

// Listen for screen data from the server
socket.on('screen_data', (data) => {
    handleScreenData(data);
});

// Handle stream started event
socket.on('stream_started', (data) => {
    console.log('Stream started:', data);
});

// Handle stream stopped event
socket.on('stream_stopped', (data) => {
    console.log('Stream stopped:', data);

    // Remove the canvas for the staff member
    const { staffId } = data;
    const staffDiv = document.getElementById(`staff-stream-${staffId}`);
    if (staffDiv) {
        staffDiv.remove();
    }
});

// Error handling
socket.on('error', (error) => {
    console.error('WebSocket Error:', error);
});

// UI for Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.getElementById('admin-dashboard');
    const streamsContainer = document.createElement('div');
    streamsContainer.id = 'screen-streams-container';
    streamsContainer.innerHTML = '<h2>Live Screen Streams</h2>';
    dashboard.appendChild(streamsContainer);
});
