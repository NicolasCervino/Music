# Music App

This project is a music application developed with React Native and Expo. It allows users to explore, organize, and play music files stored locally on their device, with a dynamic interface that adapts to the currently playing music.

## Technologies Used

*   **Framework:** React Native (with Expo)
*   **Navigation:** Expo Router and custom Tab Bar system
*   **Audio Playback:**`react-native-track-player`
*   **Local File Management:** `react-native-get-music-files`, `expo-media-library`
*   **Local Storage:**
    *   **Expo SQLite:** Used to efficiently store and manage the scanned music library and user playlists.
    *   **AsyncStorage:** Used to cache data, such as colors extracted from album artwork (`CacheColorService.ts`), to improve UI performance.
*   **UI:**
    *   Components: `expo-image`, `@gorhom/bottom-sheet`, `@shopify/flash-list`, `lottie-react-native`, `@expo/vector-icons`.
    *   **Color Extraction:** `react-native-image-colors` to obtain dominant colors from artwork.
*   **Language:** TypeScript

## Key Features

*   **Local Music Scanning and Storage:** Scans the device storage for music files and stores metadata and file paths in a local **SQLite** database for fast and efficient access.
*   **Music Playback:** Built-in audio player with controls (play, pause, skip), track info, and support for background playback.
*   **Dynamic and Adaptive User Interface:**
    *   **Artwork Color Extraction:** Uses `react-native-image-colors` to extract the dominant color from the current song’s album artwork.
    *   **Themed Player UI:** The extracted color is dynamically applied to the background of the mini-player and expanded player view, as well as to the status bar and navigation bar (on Android), creating a visually cohesive experience tailored to the music.
    *   **Color Caching:** Extracted colors are cached using **AsyncStorage** to optimize performance and avoid recalculating them repeatedly.
*   **Organization:**
    *   View all songs (Tab: "Home").
    *   Group by Artists (Tab: "Artists"), highlighting popular artists.
    *   Group by Albums (Tab: "Albums"), highlighting popular albums.
*   **Playlist Management:** Create, view, edit, and delete custom playlists (Tab: "Playlists"), stored using **SQLite**.

## Main Screens

 The core of the application is organized into four main tabs:

1.  **Home:** Displays a complete list of all songs...

    ![image](https://github.com/user-attachments/assets/815665fa-a067-48c3-bb7d-61a228b0cf71)
3.  **Playlists:** Allows the user to manage their playlists...

    ![image](https://github.com/user-attachments/assets/3d194636-e60f-4be3-a32c-79a3de371a04)

4.  **Artists:** Displays a list of artists...

    ![image](https://github.com/user-attachments/assets/d16b57d8-f052-413f-a0c9-8ee9b33e6cfe)

5.  **Albums:** Displays a list of albums...

    ![image](https://github.com/user-attachments/assets/9922f4c7-7601-421f-8286-4caf3d564b48)

*   **Player:** Both the mini-player and expanded view adapt their background color to the artwork of the current song.

    ![Grabación 2025-04-20 235955_1](https://github.com/user-attachments/assets/02be0597-db57-495f-8213-fc613affbade)
