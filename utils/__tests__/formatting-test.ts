import { formatTime } from '../formatting';

describe('formatTime', () => {
  it('formats 0 milliseconds as 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats milliseconds under a minute correctly', () => {
    expect(formatTime(5000)).toBe('0:05');
    expect(formatTime(30000)).toBe('0:30');
    expect(formatTime(59000)).toBe('0:59');
  });

  it('formats exactly one minute correctly', () => {
    expect(formatTime(60000)).toBe('1:00');
  });

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(65000)).toBe('1:05');
    expect(formatTime(90000)).toBe('1:30');
    expect(formatTime(125000)).toBe('2:05');
  });

  it('formats multiple minutes correctly', () => {
    expect(formatTime(300000)).toBe('5:00');
    expect(formatTime(600000)).toBe('10:00');
  });

  it('pads single-digit seconds with leading zero', () => {
    expect(formatTime(1000)).toBe('0:01');
    expect(formatTime(9000)).toBe('0:09');
    expect(formatTime(61000)).toBe('1:01');
  });

  it('does not pad double-digit seconds', () => {
    expect(formatTime(10000)).toBe('0:10');
    expect(formatTime(59000)).toBe('0:59');
  });

  it('truncates milliseconds (floors to nearest second)', () => {
    expect(formatTime(1500)).toBe('0:01');
    expect(formatTime(1999)).toBe('0:01');
    expect(formatTime(2001)).toBe('0:02');
  });

  it('handles large values', () => {
    expect(formatTime(3600000)).toBe('60:00'); // 1 hour
    expect(formatTime(3661000)).toBe('61:01'); // 1 hour, 1 minute, 1 second
  });
});
