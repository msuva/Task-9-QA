import page_login from '../pages/page_login.js';
import {Builder, By, until} from 'selenium-webdriver';
import assert from 'assert';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

describe('Login & Sort', function(){
    let driver;
    
    beforeEach(async function(){
        let options = new chrome.Options();
        // options.addArguments("--headless");

        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.get('http://www.saucedemo.com');
        const title = await driver.getTitle();
        
        //assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');
        
        //input
        // let inputUsername= await driver.findElement(By.xpath('//*[@id="user-name"]'))
        let inputUsernamePOM = await driver.findElement(page_login.inputUsername)
        let inputPasswordPOM = await driver.findElement(page_login.inputPassword)
        let buttonLoginPOM = await driver.findElement(page_login.buttonLogin)
        await inputUsernamePOM.sendKeys('standard_user')
        await inputPasswordPOM.sendKeys('secret_sauce')
        await buttonLoginPOM.click()

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
        
        //screenshot keadaan layar sekarang ke current.png
        let screenshot = await driver.takeScreenshot();
        let imgBuffer = Buffer.from(screenshot, "base64");
        fs.writeFileSync("current.png", imgBuffer);

        //ambil baseline untuk compare, jika belum ada maka current.png dijadikan baseline
        if(!fs.existsSync("baseline.png")){
            fs.copyFileSync("current.png", "baseline.png");
            console.log("Baseline image saved");
        }

        //compare baseline.png dengan current.png
        let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
        let img2 = PNG.sync.read(fs.readFileSync("current.png"));
        let { width, height } = img1;
        let diff = new PNG({ width, height});

        let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1});

        fs.writeFileSync("diff.png", PNG.sync.write(diff));

        if(numDiffPixels > 0){
            console.log(`Visual difference found, different: ${numDiffPixels}`);
        }else{
            console.log("No visual difference found.");
        }      
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