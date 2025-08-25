# Personal-Music-Player
A sleek, modern, and fully functional music player built with vanilla HTML, CSS, and JavaScript. This project demonstrates core front-end development skills, combining dynamic UI manipulation, media controls, and browser storage.

MyPersonal Music Player
A sleek, modern, and fully functional music player built with vanilla HTML, CSS, and JavaScript. This project is a hands-on implementation of front-end web development concepts, creating an interactive and visually appealing application for playing your favorite songs.

🚀 Features
This music player comes packed with all the essential features for an immersive listening experience:

🎧 Core Playback Controls: Play, pause, next, and previous song functionalities.

🎚️ Audio Controls: A draggable seek bar to navigate through the song and a volume control slider.

⏱️ Time Display: Real-time display of the current time and total duration of the song.

🎵 Dynamic Playlist: Loads a playlist of 10-15 songs dynamically from a JSON file.

🖼️ Album Art: Displays the corresponding album image for each song during playback.

# 🔍 Search Functionality:

Text Search: A search bar to quickly find songs by title or artist.

Voice Search: Click the microphone icon to search for songs using your voice (requires browser permission).

❤️ Favorites: Mark songs as favorites and view them in a separate "Favorites" tab. Your selections are saved in the browser's local storage.

🕓 Recently Played: Automatically keeps track of the songs you've listened to, accessible in the "Recently Played" tab.

🔀 Shuffle & 🔁 Repeat: Options to shuffle the playlist or repeat the current song.

👀 Visitor Counter: A simple counter that tracks the number of times the page has been visited, stored locally.

📱 Responsive Design: The layout adapts seamlessly to different screen sizes, from mobile phones to desktops.

# 🛠️ Technologies Used
This project was built using fundamental web technologies, with no external frameworks.

HTML5: For the structure and layout of the application.

CSS3: For styling, animations, and creating a responsive design.

JavaScript (ES6+): For all the logic and interactivity, including:

DOM Manipulation

HTML5 Audio API for playback control

Fetch API for loading song data from JSON

Web Storage API (localStorage) for persisting favorites, recently played, and visitor count.

Web Speech API for voice search functionality.

# 📂 Project Structure
The project is organized into a clean and understandable folder structure.

my-music-player/
├── 📄 index.html          # Main HTML file
├── 🎨 style.css           # All CSS styles
├── 🧠 script.js           # Core JavaScript logic
├── 📁 data/
│   └── 🎵 songs.json       # The "database" containing song metadata
└── 📁 assets/
    ├── 🎶 music/          # Folder for your .mp3 song files
    └── 🖼️ images/         # Folder for your album cover images

# ⚙️ Setup and Installation
To get this project up and running on your local machine, follow these simple steps:

Navigate to the project directory:

cd your-repo-name

Add your music and images:

Place your .mp3 song files inside the assets/music/ directory.

Place your album cover images inside the assets/images/ directory.

Update the song data:

Open the data/songs.json file.

Edit the entries to match your song titles, artists, and the correct file paths for the music and images you added.

Run the application using a live server:

Because this project uses the fetch API to load a local JSON file, you cannot simply open index.html in your browser due to security (CORS) policies.

The easiest way to run it is with a local development server. If you use Visual Studio Code, you can install the Live Server extension.

Once installed, right-click on index.html and select "Open with Live Server".

# 🕹️ How to Use
Select a song from the "All Songs" list to start playing.

Use the central controls to play, pause, or skip tracks.

Click the heart icon next to any song to add it to your Favorites.

Use the search bar or the voice search button to filter the playlist.

Switch between "All Songs," "Favorites," and "Recently Played" using the tabs.
