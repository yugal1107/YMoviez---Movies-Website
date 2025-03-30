# YMoviez - Movies Website Project

YMoviez is a web application built using React, Node.js, and the TMDB API. It allows users to explore movies and TV series, view details, cast information, and search for their favorite content. The project is designed with a modern UI and leverages Vite for fast development and TailwindCSS for styling.

## Features

- **Movies and TV Series**: Browse trending, upcoming, and now-playing movies and series.
- **Search Functionality**: Search for movies and TV series by keywords.
- **Cast Information**: View detailed cast information for movies and series.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Modern UI**: Built with React, TailwindCSS, and NextUI for a sleek user experience.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, NextUI
- **Backend**: Node.js, Express
- **API**: TMDB API for fetching movie and series data
- **Hosting**: Deployed on Vercel

## Live Demo

Check out the live version of the project here: [YMoviez](https://ymoviez.vercel.app)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/movies-website-project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movies-website-project
   ```
3. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
4. Create a `.env` file in the `server` directory and add your TMDB API key:
   ```
   ACCESS_TOKEN_AUTH=your_tmdb_api_key
   ```
5. Start the development servers:
   - For the client:
     ```bash
     cd client
     npm run dev
     ```
   - For the server:
     ```bash
     cd server
     npm start
     ```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
