import type { RegexTemplate } from '@/types/common';

export const REGEX_TEMPLATES: RegexTemplate[] = [
  {
    id: 'email',
    name: '邮箱地址',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: '匹配常见的电子邮箱格式',
    example: 'hello@example.com',
  },
  {
    id: 'url',
    name: 'URL 链接',
    pattern: 'https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+',
    description: '匹配 HTTP/HTTPS URL',
    example: 'https://www.example.com/path?q=test',
  },
  {
    id: 'phone-cn',
    name: '中国手机号',
    pattern: '1[3-9]\\d{9}',
    description: '匹配中国大陆手机号码',
    example: '13800138000',
  },
  {
    id: 'ipv4',
    name: 'IPv4 地址',
    pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b',
    description: '匹配 IPv4 地址',
    example: '192.168.1.1',
  },
  {
    id: 'date',
    name: '日期 (YYYY-MM-DD)',
    pattern: '\\d{4}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\\d|3[01])',
    description: '匹配 YYYY-MM-DD 或 YYYY/MM/DD 格式',
    example: '2026-07-11',
  },
  {
    id: 'hex-color',
    name: '十六进制颜色',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    description: '匹配 #fff 或 #ffffff 格式',
    example: '#3B82F6',
  },
];
