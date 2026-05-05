/// <reference types="vite/client" />

// Module declaration for process/browser (Node.js polyfill)
declare module 'process/browser' {
  const process: NodeJS.Process;
  export default process;
}

/**
 * File System Access API Type Definitions
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 * @see https://wicg.github.io/file-system-access/
 *
 * Browser Support:
 * - Chrome/Edge: 86+ (Full support)
 * - Firefox: Not supported (as of 2024)
 * - Safari: Not supported (as of 2024)
 * - Opera: 72+ (Full support)
 *
 * Feature detection: 'showSaveFilePicker' in window
 */
interface ShowSaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
  excludeAcceptAllOption?: boolean;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | BufferSource | string | ArrayBufferView): Promise<void>;
  close(): Promise<void>;
  abort(): Promise<void>;
}

interface FileSystemFileHandle {
  kind: 'file';
  name: string;
  createWritable(options?: { keepExistingData?: boolean }): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
  isSameEntry(other: FileSystemHandle): Promise<boolean>;
}

interface Window {
  /**
   * Shows a file save dialog and returns a handle to the selected file.
   * Part of the File System Access API.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker
   * @throws {AbortError} If user cancels the dialog
   * @throws {SecurityError} If permission is denied
   */
  showSaveFilePicker?: (options?: ShowSaveFilePickerOptions) => Promise<FileSystemFileHandle>;
}
