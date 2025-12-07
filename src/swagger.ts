import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tracker Backend API",
      version: "1.0.0",
      description: "API for scraping Spotify playlists and managing tracks",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        ScrapePlaylistRequest: {
          type: "object",
          required: ["playlistId"],
          properties: {
            playlistId: {
              type: "string",
              description: "Spotify playlist ID (without spotify:playlist: prefix)",
              example: "6EmDBmBfF1DZmInaHhlfw8",
            },
          },
        },
        ScrapePlaylistResponse: {
          type: "object",
          properties: {
            ok: {
              type: "boolean",
              example: true,
            },
            playlist: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "6EmDBmBfF1DZmInaHhlfw8",
                },
                name: {
                  type: "string",
                  example: "My Playlist",
                },
                trackCount: {
                  type: "number",
                  example: 42,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            ok: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "scrape_failed",
            },
            message: {
              type: "string",
              example: "Partner API error 401",
            },
          },
        },
      },
    },
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);

