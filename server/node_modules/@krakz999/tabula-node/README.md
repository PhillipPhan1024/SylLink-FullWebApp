# @krakz999/tabula-node

A package for extracting tables from PDF files. The package is a wrapper completely written in `Typescript`, built on top of the popular `tabula-java` library.

## Installation

To use this package, install it via your favourite package manager:

    pnpm i @krakz999/tabula-node

## Usage

    import { extractTables } from '@krakz999/tabula-node';

    const results = await extractTables("./test.pdf", {
        pages: "all",
        guess: true
    });

    console.log(results);

## Options

The `extractTables` function accepts an `options` object with the following properties:

- `area`: Portion of the page to analyze. Example: "269.875,12.75,790.5,561". Accepts top,left,bottom,right i.e. y1,x1,y2,x2 where all values are in points relative to the top left corner. If all values are between 0-100 (inclusive) and preceded by '%', input will be taken as % of actual height or width of the page. Example: "%0,0,100,50". To specify multiple areas, pass an array. Default is entire page.
- `columns`: X coordinates of column boundaries. Example "10.1,20.2,30.3". If all values are between 0-100 (inclusive) and preceded by '%', input will be taken as % of actual width of the page. Example: "%25,50,80.6"
- `format`: Output format: (CSV,TSV,JSON). Default: CSV
- `guess`: Guess the portion of the page to analyze per page.
- `lattice`: Force PDF to be extracted using lattice-mode extraction (if there are ruling lines separating each cell, as in a PDF of an Excel spreadsheet)
- `noSpreadsheet`: [Deprecated in favor of -t/--stream] Force PDF not to be extracted using spreadsheet-style extraction (if there are no ruling lines separating each cell)
- `pages`: Comma separated list of ranges, or all. Examples: "1-3,5-7", --pages 3 or "all". Default is "1"
- `password`: Password to decrypt document. Default is empty
- `stream`: Force PDF to be extracted using stream-mode extraction (if there are no ruling lines separating each cell)
- `useLineReturns`: Use embedded line returns in cells. (Only in spreadsheet mode.)
