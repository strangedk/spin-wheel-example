import * as PIXI from 'pixi.js';
import WheelView from "./WheelView";
import gsap from 'gsap';
import Signals from "../signals/Signals";
import CoinView from "./CoinView";

class GameView extends PIXI.Container {

    constructor(app, {width, height}) {
        super();
        this.app = app;

        this.WIDTH = width;
        this.HEIGHT = height;

        this.interactiveChildren = true;

        // Update the UI with the text 'credits: N'
        Signals.updateUI.add((value) => this.credits = value);

        // Imitate the math from the backend through Signals
        Signals.onGetMath.add(math => {
            this.math = math;
            this
              .createBackground()
              .createWheel()
              .createPointer()
              .createButton()
              .createUI()
              .createWinScreen();
        })
    }

    createBackground() {
        const bg = new PIXI.Sprite();
        bg.texture = PIXI.Texture.from('background.png');
        bg.anchor.set(0.5);
        bg.position.set(this.WIDTH/2,0);
        this.addChild(bg);
        return this;
    }

    createWheel() {
        const wheel = this.wheel = new WheelView(this.math);
        wheel.anchor.set(0.5);
        wheel.position.set(this.WIDTH/2, this.HEIGHT/2);

        this.addChild(wheel);

        return this;
    }

    createButton() {
        const button = this.button = new PIXI.Sprite();
        button.anchor.set(0.5);
        button.eventMode = 'dynamic';

        const rect = new PIXI.Graphics();
        rect.beginFill(0x336688,1);
        rect.drawRoundedRect(0,0,300,100, 15);
        rect.endFill();
        rect.pivot.set(150,50);

        const styleOptions = {
            fill: ['#ffff33', '#99ff99'],
            fontWeight: 'bold',
            fontSize: 110,
        };
        const style = new PIXI.TextStyle(styleOptions);
        const text = this.text = new PIXI.Text('SPIN', style);
        text.anchor.set(0.5);

        button.position.set(this.WIDTH/2-20, this.HEIGHT-60)
        button.addChild(rect, text);
        this.addChild(button);

        button.on('pointerdown', () => this.controller.spin());
        window.spin = () => { this.controller.spin(); };

        return this;
    }

    createPointer() {
        const pointer = this.pointer = new PIXI.Sprite();
        pointer.texture = PIXI.Texture.from('pointer.png');
        pointer.position.set(this.WIDTH/2-45,100);
        pointer.scale.set(2);
        this.addChild(pointer);
        return this;
    }

    createUI() {
        const styleOptions = {
            fill: ['#ffffff'],
            fontWeight: 'bold',
            fontSize: 24,
        };
        const style = new PIXI.TextStyle(styleOptions);
        const text = this.creditsText = new PIXI.Text('credits: 0', style);
        text.position.set(20,20);
        this.addChild(text);

        return this;
    }

    createWinScreen() {
        const styleOptions = {
            fill: ['#ffffaa'],
            fontWeight: 'bold',
            fontSize: 90,
        };
        const style = new PIXI.TextStyle(styleOptions);
        const text = this.winText = new PIXI.Text(`YOU WON`, style);
        text.anchor.set(0.5);
        text.position.set(this.WIDTH/2, 400);
        this.addChild(text);
        this.winText.visible = false;
    }

    spin(spinData) {
        const {weight, angle, credit} = spinData;
        console.log('%c spin data: ', 'background: #333333; color: #4aaaff', spinData);

        const self = this;
        const duration = 5;
        Signals.onSpinStart.dispatch(spinData);
        gsap.to(this.wheel, {
            duration,
            angle: 360 * 8 + angle,
            onComplete: () => self.stop(credit),
            ease: 'Expo.easeOut'
        })
        this.startTickSound(duration);
        this.button.visible = false;
    }

    startTickSound(duration) {
        let soundTween = { delta:0 };
        gsap.to(soundTween, {
            duration,
            delta: duration,
            ease: 'Expo.easeOut',
            onUpdate:() => Signals.onSpinProgress.dispatch(soundTween.delta),
        });
    }

    stop(credit) {
        Signals.onSpinStop.dispatch(credit);

        this.showWin(credit);

        // Invoke this in the case when you want to hide and reset the wheel
        this.hideWheel();
    }

    hideWheel() {
        this.pointer.visible = false;

        gsap.to(this.wheel, {
            duration:3,
            alpha:0,
            onComplete: () => {
                this.wheel.angle = 0;
                this.showWheel();
            }
        });
    }

    showWheel() {
        gsap.to(this.wheel, {
            duration: 0.5,
            alpha: 1,
            onComplete: () => {
                this.button.visible = true;
                this.pointer.visible = true;
            }
        });
    }

    showWin(credit) {
        this.winText.text = `YOU WON ${credit} CREDITS!`
        this.winText.visible = true;

        const container = new PIXI.Container();
        for (let i=0; i<300; ++i) {
            const microCoin = new CoinView(Math.random() - 0.7);
            microCoin.position.set(Math.random() * this.WIDTH, Math.random() * this.HEIGHT);
            microCoin.alpha = 0.1;
            microCoin.scale.set(Math.random());
            container.addChild(microCoin);
        }
        this.addChild(container);

        const coin = new CoinView();
        coin.position.set(this.WIDTH/2, this.HEIGHT/2);
        this.addChild(coin);

        const delayID = setTimeout(() => {
            this.winText.visible = false;
            this.removeChild(coin);
            container.removeChildren();
            this.removeChild(container);

            clearTimeout(delayID);
        }, 3750);
    }

    // region #math & credits
    set math(value) {
        this._math = value;
    }

    get math() {
        return this._math;
    }

    set credits(value) {
        this.creditsText.text = 'credits: ' + value;
        this._credits = value;
    }
    get credits() {
        return this._credits;
    }

    // endregion
}

export default GameView;
