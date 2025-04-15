const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');

describe('Login & Sort', function(){
    let driver;

    it('Sukses Login', async function(){
        driver = await new Builder().forBrowser('chrome').build();

        await driver.get('http://www.saucedemo.com');
        const title = await driver.getTitle();
        
        //assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');
        
        //input
        let inputUsername = await driver.findElement(By.xpath('//*[@id="user-name"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@id="password"]'))
        let buttonLogin = await driver.findElement(By.xpath('//*[@id="login-button"]'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        //assert: text dalam element benar
        let textAppLogo = await driver.findElement(By.className('app_logo'))
        let logotext = await textAppLogo.getText()
        assert.strictEqual(logotext, 'Swag Labs')

        //Urut produk Z-A
        let sortProduct = await driver.findElement(By.css('[data-test="product-sort-container"]'))
        let sortText = await driver.findElement(By.css('[value="za"]'))
        await sortProduct.click()
        await sortText.click()

        let textActiveOption = await driver.findElement(By.className('active_option'))
        let optionText = await textActiveOption.getText()
        assert.strictEqual(optionText, 'Name (Z to A)')

        await driver.sleep(3000);
        await driver.quit();
    });
});

