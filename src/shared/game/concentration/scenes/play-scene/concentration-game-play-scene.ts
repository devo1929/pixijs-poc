import * as PIXI from 'pixi.js';
import { ElementRef } from '@angular/core';
import 'pixi-sound';
import * as TWEEN from '@tweenjs/tween.js';
import { Scene } from '../../../scene';
import { Keyboard, Keys } from '../../../keyboard';
import { InputController } from 'src/shared/game/input-controller';
import { ConcentrationGame } from '../../concentration-game';

enum SceneResources {
    CardBackImage = 'card-back.png',
    CardFrontImage = 'ace_of_spades.png',
    WhistleSound = 'whistle.mp3'
};

export class ConcentrationGamePlayScene extends Scene {
    public sound: PIXI.sound.Sound;
    public card: PIXI.Sprite;
    public card2: PIXI.Sprite;
    public pauseText: PIXI.Text;

    public cardFaceUp: boolean = false;

    constructor(r: PIXI.IResourceDictionary, stageElement: ElementRef) {
        super(r, stageElement);

        this._init();
        this.initInputController(this._getInputController());
    }

    protected onUpdate(delta: number) {
    }

    protected onPause() {
        this.pauseText.visible = true;
    }

    protected onResume() {
        this.pauseText.visible = false;
    }

    protected onStart() {
        this._reset();
        console.log("Concentration Game Play Scene Start!");
    }

    protected onStop() {
        console.log("Concentration Game Play Scene Stop!");
    }

    private _init() {
        this.card = new PIXI.Sprite(this.getResource(SceneResources.CardBackImage).texture);
        this.addChild(this.card);

        this.card.on('mouseup', this._onCardClick.bind(this));
        this.card.on('touchend', this._onCardClick.bind(this));

        this.card2 = new PIXI.Sprite(this.getResource(SceneResources.CardFrontImage).texture);
        this.addChild(this.card2);

        this.pauseText = new PIXI.Text('Paused', {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
        this.addChild(this.pauseText);
    }

    private _reset() {
        this.card.texture = this.getResource(SceneResources.CardBackImage).texture;
        this.cardFaceUp = false;

        this.card.scale.x = 0.5;
        this.card.scale.y = 0.5;
        this.card.anchor.x = 0.5;
        this.card.anchor.y = 0.5;
        this.card.position.x = 150;
        this.card.position.y = 250;
        this.card.interactive = true;
        this.card.buttonMode = true;
        this.card.zIndex = 2;

        this.card2.scale.x = 0.5;
        this.card2.scale.y = 0.5;
        this.card2.anchor.x = 0.5;
        this.card2.anchor.y = 0.5;
        this.card2.position.x = 250;
        this.card2.position.y = 350;
        this.card2.zIndex = 1;

        this.pauseText.visible = false;
    }

    private _onCardClick() {
        this.getResource(SceneResources.WhistleSound).sound.play();

        let scale = { x: this.card.scale.x };

        this.createTween(scale)
            .onStart(() => this.card.interactive = false)
            .to({ x: 0 }, 75)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(result => {
                this.card.scale.x = result.x;
            })
            .chain(this.createTween({ x: 0 })
                .onStart(() => {
                    if (this.cardFaceUp) {
                        this.card.texture = this.getResource(SceneResources.CardBackImage).texture;
                        this.cardFaceUp = false;
                    }
                    else {
                        this.card.texture = this.getResource(SceneResources.CardFrontImage).texture;
                        this.cardFaceUp = true;
                    }
                })
                .to({x: 0.5}, 75)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(result => {
                    this.card.scale.x = result.x;
                })
                .onComplete(() => this.card.interactive = true)
            )
            .start();
    }

    private _getInputController(): InputController {
        return {
            onKeyDown: (e: KeyboardEvent) => this._onKeyDown(e)
        };
    }

    private _onKeyDown(e: KeyboardEvent) {
        if (Keyboard.isKeyActive(e, Keys.KeyF)) {
            if (this.isPaused()) {
                this.resume();
                console.log('resume!');
            }
            else {
                this.pause();
                console.log('pause!');
            }
        }
        else if (Keyboard.isKeyActive(e, Keys.KeyX)) {
            ConcentrationGame.getInstance().goToTestScene();
        }
    }
}