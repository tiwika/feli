import { Selector } from 'testcafe';
import VueSelector from 'testcafe-vue-selectors';

// A fixture must be created for each group of tests.
fixture(`Category`)
    .page('http://master.plentymarkets.com/wohnzimmer/sessel-hocker');

test('Homepage - Welcome Text', async testController => {
    // Select the paragraph element under the body.
    // Must use promises (async / await  here) for communication with the browser.
    const welcomeTextElement = await new Selector('#welcome-text');
    const addToBasketItems = VueSelector('add-to-basket');

    await testController.expect(welcomeTextElement.innerText).eql('Herzlich Willkommen!');
});
