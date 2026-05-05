import appInfo from '@/app-info.json';

export const noStrictMode =
  import.meta.env.REACT_APP_NO_STRICT_MODE ?? // Vite mode
  process.env.REACT_APP_NO_STRICT_MODE; // WebPack mode

export const isDev =
  import.meta.env.DEV ?? // Vite mode
  process.env.NODE_ENV === 'development'; // WebPack mode

export const isProd = !isDev;

export const versionInfo = appInfo.versionInfo;

export const appId: string =
  (import.meta.env.APP_ID ?? process.env.APP_ID) || 'action-docx-documents-merger';

export const appTitle: string =
  (import.meta.env.REACT_APP_TITLE ?? process.env.REACT_APP_TITLE) || 'СОПы по хранению медизделий';

/* // NOTE: These parameters are required if we need a server API application
 * export const originHost =
 *   window.location.origin || window.location.protocol + '//' + window.location.host;
 * export const rootHost = isProd ? originHost : 'http://localhost:51732';
 * export const apiHost = isProd ? originHost : 'http://localhost:3000';
 * export const apiUrl = apiHost + '/api';
 */
