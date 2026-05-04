import { TruncateWordPipe } from './truncate-word.pipe';

describe('TruncateWordPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateWordPipe();
    expect(pipe).toBeTruthy();
  });
});
