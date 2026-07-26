import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, buildTree, countKeys, getDepth, formatSize } from './formatter';

describe('formatJson', () => {
  it('应格式化简单 JSON 对象', () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('应支持自定义缩进', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toBe('{\n    "a": 1\n}');
  });

  it('应格式化嵌套对象和数组', () => {
    const result = formatJson('{"a":[1,2],"b":{"c":3}}');
    expect(result).toContain('"a"');
    expect(result).toContain('[\n');
    expect(result).toContain('"c": 3');
  });

  it('无效 JSON 应抛出 SyntaxError', () => {
    expect(() => formatJson('{invalid}')).toThrow(SyntaxError);
  });

  it('空字符串应抛出 SyntaxError', () => {
    expect(() => formatJson('')).toThrow();
  });
});

describe('minifyJson', () => {
  it('应压缩 JSON 为单行', () => {
    const result = minifyJson('{ "a" : 1 , "b" : [1, 2] }');
    expect(result).toBe('{"a":1,"b":[1,2]}');
  });

  it('应移除所有空白字符', () => {
    const result = minifyJson(JSON.stringify({ key: 'value' }, null, 4));
    expect(result).not.toContain('\n');
    expect(result).not.toContain('  ');
  });

  it('无效 JSON 应抛出 SyntaxError', () => {
    expect(() => minifyJson('not json')).toThrow(SyntaxError);
  });
});

describe('buildTree', () => {
  it('应构建 null 节点', () => {
    const tree = buildTree(null);
    expect(tree).toEqual({ key: '$', type: 'null', value: null, path: '$' });
  });

  it('应构建基本类型节点', () => {
    expect(buildTree(42).type).toBe('number');
    expect(buildTree('hello').type).toBe('string');
    expect(buildTree(true).type).toBe('boolean');
  });

  it('应构建数组节点并带有 children', () => {
    const tree = buildTree([1, 2, 3]);
    expect(tree.type).toBe('array');
    expect(tree.children).toHaveLength(3);
    expect(tree.children![0].key).toBe('[0]');
    expect(tree.children![0].value).toBe(1);
  });

  it('应构建对象节点并带有 children', () => {
    const tree = buildTree({ a: 1, b: 'two' });
    expect(tree.type).toBe('object');
    expect(tree.children).toHaveLength(2);
    expect(tree.children![0].key).toBe('a');
    expect(tree.children![1].key).toBe('b');
  });

  it('应递归构建嵌套结构', () => {
    const tree = buildTree({ a: { b: { c: 1 } } });
    expect(tree.children![0].children![0].children![0].value).toBe(1);
    expect(tree.children![0].children![0].children![0].path).toBe('$.a.b.c');
  });

  it('应支持自定义根 key', () => {
    const tree = buildTree(42, 'root', 'root');
    expect(tree.key).toBe('root');
    expect(tree.path).toBe('root');
  });
});

describe('countKeys', () => {
  it('基本类型应返回 0', () => {
    expect(countKeys(null)).toBe(0);
    expect(countKeys(42)).toBe(0);
    expect(countKeys('str')).toBe(0);
  });

  it('应统计对象 key 数量', () => {
    expect(countKeys({ a: 1, b: 2 })).toBe(2);
  });

  it('应递归统计嵌套对象', () => {
    expect(countKeys({ a: { b: 1, c: 2 }, d: 3 })).toBe(4);
  });

  it('应统计数组内元素', () => {
    expect(countKeys([{ a: 1 }, { b: 2 }])).toBe(2);
  });
});

describe('getDepth', () => {
  it('基本类型深度为 0', () => {
    expect(getDepth(null)).toBe(0);
    expect(getDepth(42)).toBe(0);
  });

  it('扁平对象深度为 1', () => {
    expect(getDepth({ a: 1 })).toBe(1);
  });

  it('应计算嵌套深度', () => {
    expect(getDepth({ a: { b: { c: 1 } } })).toBe(3);
  });

  it('应计算数组深度', () => {
    expect(getDepth([[1, [2]]])).toBe(3);
  });
});

describe('formatSize', () => {
  it('小于 1KB 应显示 B', () => {
    expect(formatSize(500)).toBe('500 B');
  });

  it('大于等于 1KB 应显示 KB', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
    expect(formatSize(2048)).toBe('2.0 KB');
  });

  it('应保留一位小数', () => {
    expect(formatSize(1536)).toBe('1.5 KB');
  });
});
