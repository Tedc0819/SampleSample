const csv = require("fast-csv")
const fs = require("fs")

class CSVReaderChunkSizeInvalidError extends Error {}
class CSVReaderFilePathInvalidError extends Error {}
class CSVReaderHandlerInvalidError extends Error {}

class CSVReader {
  async iterateCSV({ filePath, chunkSize, handler = ({ rows }) => {} }) {
    if (!filePath) {
      throw new CSVReaderFilePathInvalidError(
        "file path should be a non-empty string"
      )
    }

    if (chunkSize < 1) {
      throw new CSVReaderChunkSizeInvalidError(
        "chunk size should be greater than 1"
      )
    }

    if (!handler || typeof handler !== "function") {
      throw new CSVReaderHandlerInvalidError("handler should be a function")
    }

    let lastChunk = []
    let from = 0

    // TODO: better do estimation before running instead of run-time determination of end of loop
    do {
      // eslint-disable-next-line no-await-in-loop
      lastChunk = await this.readRange({
        filePath,
        from,
        limit: chunkSize
      })

      // eslint-disable-next-line no-await-in-loop
      await handler({
        rows: lastChunk
      })

      from += chunkSize
    } while (lastChunk.length >= chunkSize)
  }

  async readRange({ filePath, from, limit }) {
    return new Promise((resolve, reject) => {
      const acc = []

      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, maxRows: limit, skipRows: from }))
        .on("error", reject)
        .on("data", async row => {
          acc.push(row)
        })
        .on("end", async rowCount => {
          resolve(acc)
        })
    })
  }
}

module.exports = CSVReader
