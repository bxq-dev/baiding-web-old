import {sampleSize} from 'lodash';
import {host} from "../../env/environment";

declare const DocumentTouch: any;

export class UrlModel {
  protocol: string;
  host: string;
  hostname: string;
  port: number;
  pathname: string;
  search: string;
  hash: string;

  constructor(protocol: string, host: string, hostname: string, port: number, pathname: string, search: string, hash: string) {
    this.protocol = protocol;
    this.host = host;
    this.hostname = hostname;
    this.port = port;
    this.pathname = pathname;
    this.search = search;
    this.hash = hash;
  }
}

export const isInWechat = /micromessenger/i.test(navigator.userAgent);
export const isiOS = /iPhone|iPad/i.test(navigator.userAgent);
export const isInApp = /zaojiuliveapp/i.test(navigator.userAgent);
export const isTouchable = (<any>window).DocumentTouch && document instanceof DocumentTouch;
export const isAndroid = /Android/i.test(navigator.userAgent);
export const isOnLargeScreen = matchMedia && matchMedia('(min-width: 1024px)').matches;
export const isChrome = /Chrome/i.test(navigator.userAgent);
export const isWindowsWechat = /WindowsWechat/i.test(navigator.userAgent);
export const now = (): number => Math.floor((new Date()).getTime() / 1000);
export const isViewportLandscape = (): boolean => {
  return window.matchMedia && matchMedia('(orientation: landscape)').matches;
};
export const regexpEmail = /^[a-z0-9_]+(\.?[a-z0-9-_])*?@([a-zA-Z0-9]([a-zA-Z0-9\-]*?[a-zA-Z0-9])?\.)+[a-zA-Z]{2,20}$/i;
export const regexpUsername = /^[a-z][a-z0-9-]{3,18}[a-z0-9]$/;
export const regexpMobile = /^1[0-9]{10}$/;
export const regexpPhone = /^((086-)?0[0-9]{2,3}-[0-9]{7,8}\;)*((086-)?0[0-9]{2,3}-[0-9]{7,8})$/;
export const regexpPhoneOrMobile = /(^((086-)?0[0-9]{2,3}-[0-9]{7,8}\;)*((086-)?0[0-9]{2,3}-[0-9]{7,8})$)||(^(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7})$/;

export const parseAt = (content: string, needHeightLight = false): string => {
  const patt = /(@.+?)(\((.+?)\)){1}/g
  let result = null;
  let _content = content;

  while ((result = patt.exec(content)) != null) {
    if (needHeightLight) {
      _content = _content.replace(result[0], `<span class="highlight">${result[1]}</span>`)
    } else {
      _content = _content.replace(result[0], result[1])
    }
  }

  return _content
};
export const resetWindowScroll = (): void => {
  setTimeout(() => document.body.scrollTop = document.body.scrollHeight, 800);
};
export const parseUrl = (url: string): UrlModel => {
  const aEle = document.createElement('a');
  aEle.href = url;
  return new UrlModel(aEle.protocol, aEle.host, aEle.hostname, +aEle.port, aEle.pathname, aEle.search, aEle.hash)
};
export const params = (obj: Object): string => {
  return Object.keys(obj).map((k: string) => encodeURIComponent(k) + '=' + encodeURIComponent((<any>obj)[k])).join('&')
};
export const randomId = (size = 10, dic?: string): string => {
  const defaultDic = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return sampleSize((dic || defaultDic).split(''), size).join('')
};
export const absUrl = (path: string, query?: {[key: string]: string}): string => {
  let url = `${location.protocol}//${location.hostname}${path}`;
  if (query) url += `?${params(query)}`;
  return url;
};

export const getRelativePath = (path: string, defaultPath: string): string => {
  let _path = path || defaultPath;
  _path = _path.replace(host.self, '');
  if (_path === '/' || !_path.startsWith('/')) _path = defaultPath;
  return _path;
};