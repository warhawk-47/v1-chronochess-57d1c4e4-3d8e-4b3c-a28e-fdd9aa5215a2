# ChronoChess

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/warhawk-47/an-online-chess-game)

A visually striking, retro-themed online chess game focusing on a polished user experience and robust, client-side gameplay.

ChronoChess is a visually stunning online chess application with a unique 'Retro' aesthetic. It evokes the feel of 90s and early 2000s web culture through pixel art, neon palettes, and subtle glitch effects. The application provides a complete, playable chess experience in a 'hot-seat' mode for two players on the same device.

## Key Features

-   **Retro 90s Aesthetic:** A unique visual style with pixel art, neon glows, and glitch effects.
-   **Complete Chess Engine:** Fully client-side logic handling all standard chess rules.
-   **Full Ruleset Implemented:** Supports castling, en passant, pawn promotion, check, checkmate, and stalemate.
-   **Hot-Seat Multiplayer:** Play with a friend on the same device.
-   **Polished & Interactive UI:** Smooth animations, glowing move indicators, and a delightful user experience.
-   **Responsive Design:** Flawless gameplay on desktop devices.

## Technology Stack

-   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Backend & Routing:** [Hono](https://hono.dev/)
-   **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for deployment.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/chronochess.git
    cd chronochess
    ```
2.  Install dependencies using Bun:
    ```sh
    bun install
    ```

### Running in Development Mode

To start the local development server, run the following command. This will start the Vite frontend and the Hono backend concurrently.

```sh
bun dev
```

The application will be available at `http://localhost:3000`.

## Deployment

This project is configured for easy deployment to Cloudflare Workers.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    wrangler login
    ```
2.  **Deploy the Application:**
    Run the deploy script, which will build the application and deploy it to your Cloudflare account.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/warhawk-47/an-online-chess-game)

## Project Structure

-   `src/`: Contains all the React frontend code, including pages, components, hooks, and the Zustand store.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono.
-   `shared/`: Contains TypeScript types shared between the frontend and the worker.
-   `public/`: Static assets that are served directly.
-   `index.html`: The main entry point for the application.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.