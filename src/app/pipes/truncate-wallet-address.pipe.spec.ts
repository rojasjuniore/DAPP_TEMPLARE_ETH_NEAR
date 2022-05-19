import { TruncateWalletAddressPipe } from './truncate-wallet-address.pipe';

describe('TruncateWalletAddressPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateWalletAddressPipe();
    expect(pipe).toBeTruthy();
  });
});
