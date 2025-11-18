import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { SaveGame } from '@/model/save-game'
import { encryptEs3 } from './es3-crypto'

/**
 * Downloads the provided save game data as an encrypted file.
 * This function encrypts the save game data using ES3 encryption and
 * initiates a file download in the browser.
 *
 * @param {SaveGame} saveGame - The save game object to be downloaded
 * @param {string} filename - The name to give the downloaded file
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 * @throws {TypeError} When called outside of a browser environment
 */
export default async function downloadSaveGame(
  saveGame: SaveGame,
  filename: string
): Promise<void> {
  if (globalThis.window === undefined) {
    throw new TypeError('This function can only be used in the browser')
  }

  const binaryData = await encryptEs3(
    JSON.stringify(saveGame, null, 4),
    ENCRYPTION_KEY
  )

  // FIX: Convert Uint8Array to BlobPart compatible
  const safeBinary = new Uint8Array(binaryData)

  const blob = new Blob([safeBinary.buffer], {
    type: 'application/octet-stream'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
