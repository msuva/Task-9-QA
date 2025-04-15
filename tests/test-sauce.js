const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');

describe('Login & Sort', function(){
    let driver;
    
    beforeEach(async function(){
        options = new chrome.Options();
        // options.addArguments("--headless");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('http://www.saucedemo.com');
        const title = await driver.getTitle();
        
        //assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');
        
        //input
        let inputUsername= await driver.findElement(By.xpath('//*[@id="user-name"]'))
        let inputPassword = await driver.findElement(By.xpath('//*[@id="password"]'))
        let buttonLogin = await driver.findElement(By.xpath('//*[@id="login-button"]'))
        await inputUsername.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()

        //assert: text dalam element benar
        let textAppLogo = await driver.findElement(By.className('app_logo'))
        let logotext = await textAppLogo.getText()
        let sortProduct = await driver.findElement(By.css('[data-test="product-sort-container"]'))
        assert.strictEqual(logotext, 'Swag Labs')       
        await sortProduct.click()

    });
 
    it('Sort Z-A', async function(){ 
        //Urut produk Z-A
        let sortText = await driver.findElement(By.css('[value="za"]'))
        await sortText.click()

        let textActiveOption = await driver.findElement(By.className('active_option'))
        let optionText = await textActiveOption.getText()
        assert.strictEqual(optionText, 'Name (Z to A)')       
    });

    it('Sort Low-High', async function(){ 
        //Urut produk Z-A
        let sortText = await driver.findElement(By.css('[value="lohi"]'))
        await sortText.click()

        let textActiveOption = await driver.findElement(By.className('active_option'))
        let optionText = await textActiveOption.getText()
        assert.strictEqual(optionText, 'Price (low to high)')       
    });

    afterEach(async function(){
        await driver.sleep(2000);
        await driver.quit();
    });
});