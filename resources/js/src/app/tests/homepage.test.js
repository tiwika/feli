import { Selector } from 'testcafe';

// A fixture must be created for each group of tests.
fixture(`Homepage`)
    .page('http://master.plentymarkets.com/de/');

// Create a new test(description, function(testController): <Promise>)
test('Homepage - Welcome Text', async testController => {
    // Select the paragraph element under the body.
    // Must use promises (async / await  here) for communication with the browser.
    const welcomeTextElement = await new Selector('#welcome-text');

    await testController.expect(welcomeTextElement.innerText).eql('Herzlich Willkommen!');
});
