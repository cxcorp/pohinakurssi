# pohinaprojekti
![Travis CI shield](https://api.travis-ci.org/cxcorp/pohinaprojekti-server.svg?branch=master)

Node.js course project

## Time management

* [Time sheet](https://docs.google.com/spreadsheets/d/1mbteAlOCUMvJn13TG__nOK1Tgx8i0OieWs5t9_7Abpc/edit?usp=sharing)

## Compiling

This project relies on dependencies which are compiled with node-gyp. Configure your environment according to [these instructions](https://github.com/nodejs/node-gyp#installation).

Then:

1. Clone or download this repository
2. Install npm and node
3. `npm install`
4. `npm run build`

## Development

Follow **Compiling** steps 1-3. Then, you'll want to start two shells and run `npm run watch-ts` and `npm run watch-server`. Server will be started on port 1235.
