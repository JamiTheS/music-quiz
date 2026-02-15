# Music Quiz (Square Savior)

Welcome to **Music Quiz**, an interactive web-based game designed to test your musical knowledge! Dive into hits from the past decade and challenge yourself or your friends to guess the song title and artist.

This project is built using modern web technologies including **React**, **Vite**, and **Tailwind CSS**.

## Features

- 🎵 **Decades of Hits**: Includes music data spanning from 2010 to 2025.
- 🎮 **Interactive Gameplay**: Listen to snippets and guess the song.
- 🎨 **Modern UI**: Clean and responsive design powered by Tailwind CSS.
- ⚡ **Fast & Responsive**: Built on top of Vite for lightning-fast performance.
- 🛠 **Easy Customization**: Add your own music by simply editing JSON files.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have **Node.js** installed on your system.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JamiTheS/music-quiz.git
    cd music-quiz
    ```

2.  **Navigate to the project directory:**
    The main application code resides in the `square-savior` folder.

    ```bash
    cd square-savior
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Adding Music

You can easily extend the quiz with your own songs!

1.  Navigate to `square-savior/src/data`.
2.  Create a new JSON file (e.g., `my_songs.json`) or duplicate `template_songs.json`.
3.  Add your songs using the following format:

```json
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "year": 2024,
    "youtubeId": "VIDEO_ID_HERE",
    "startTime": 30
  }
]
```

The application will automatically load all `.json` files in the `src/data` directory. For more detailed instructions, refer to `GUIDE_AJOUT_MUSIQUE.md` (in French).

## Deployment

This project is configured for easy deployment to **GitHub Pages**.

1.  Push your changes to GitHub.
2.  Go to your repository **Settings > Pages**.
3.  Select **GitHub Actions** as the source.
4.  The provided workflow will automatically build and deploy your site.

For troubleshooting or detailed steps, refers to `GUIDE_GITHUB_DEPLOY.md` (in French).

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)

## License

This project is open-source and available under the MIT License.
