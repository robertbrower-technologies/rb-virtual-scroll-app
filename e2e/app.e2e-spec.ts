import { RbVirtualScrollAppPage } from './app.po';

describe('rb-virtual-scroll-app App', () => {
  let page: RbVirtualScrollAppPage;

  beforeEach(() => {
    page = new RbVirtualScrollAppPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
