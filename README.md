# Get Started

## Setup

Install dependencies with:

```sh
npm install
```

## Development

Start the development server by running:

```sh
npm run dev
```

## Production

To run the app in production mode:

```sh
npm run build-and-start
```

## Environment Variables

Create a `.env` file for storing these variables

| Variable    | Default Value           | Description |
| ----------- | ----------------------- | ----------- |
| `PORT`      | `3000`                  | Port used when starting the express server |
| `HOST_NAME` | `http://localhost:3000` | Host endpoint used for setting up the AWS S3 client |