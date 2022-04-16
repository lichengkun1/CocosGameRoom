
import MessageData from "../../../roomCommon/CommonScripts/Utils/MessageData";
import BaseComp from "../baseComp";
import Dominoe_GameMode from "../mode/Dominoe_GameMode";
import Dominoe_GlobalGameData, { GameModeDominoe } from "../Utils/Dominoe_GlobalGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dominoe_ruleLogic extends BaseComp {

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Label)
    win1Label: cc.Label = null;

    @property(cc.Label)
    win2Label: cc.Label = null;

    @property(cc.Label)
    playerLabel: cc.Label = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    player1Label: cc.Label = null;

    @property(cc.Label)
    player2Label: cc.Label = null;

    @property(cc.Label)
    player3Label: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    score1Label: cc.Label = null;

    @property(cc.Label)
    score2Label: cc.Label = null;

    @property([cc.Node])
    ruleIcons: cc.Node[] = [];

    @property(cc.Node)
    ruleAR: cc.Node = null;

    @property(cc.Node)
    scollviewNode: cc.Node = null;

    private targetRuleNode: cc.Node = null;

    onLoad() {
        /** 模式字符串 */
        const modeStr = Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND ? 'oneRound' : 'score';

        if(modeStr === "oneRound") {
            this.viewMap['scrollview/view/content/oneRound'].active = true;
            this.viewMap['scrollview/view/content/score'].active = false;
        } else {
            this.viewMap['scrollview/view/content/oneRound'].active = false;
            this.viewMap['scrollview/view/content/score'].active = true;
        }

        const prefixStr = `scrollview/view/content/${modeStr}`;
        this.targetRuleNode = this.viewMap[prefixStr];
        
        this.titleLabel = this.viewMap[`${prefixStr}/titleLabel`].getComponent(cc.Label);
        this.winLabel = this.viewMap[`${prefixStr}/winLabel`].getComponent(cc.Label);
        this.win1Label = this.viewMap[`${prefixStr}/win1Label`].getComponent(cc.Label);
        if(modeStr === 'oneRound') {
            this.win2Label = this.viewMap[`${prefixStr}/win2Label`].getComponent(cc.Label);
            this.score2Label = this.viewMap[`${prefixStr}/score2Label`].getComponent(cc.Label);

        }
        this.playerLabel = this.viewMap[`${prefixStr}/playerLabel`].getComponent(cc.Label);
        this.coinLabel = this.viewMap[`${prefixStr}/coinLabel`].getComponent(cc.Label);
        this.player1Label = this.viewMap[`${prefixStr}/player1Label`].getComponent(cc.Label);
        this.player2Label = this.viewMap[`${prefixStr}/player2Label`].getComponent(cc.Label);
        this.player3Label = this.viewMap[`${prefixStr}/player3Label`].getComponent(cc.Label);

        this.scoreLabel = this.viewMap[`${prefixStr}/scoreLabel`].getComponent(cc.Label);
        this.score1Label = this.viewMap[`${prefixStr}/score1Label`].getComponent(cc.Label);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => { event.stopPropagation() }, this);
        this.langText();
        this.showScollviewNode();
    }

    //显示view;
    showScollviewNode() {
        this.scollviewNode.active = true;
        this.scollviewNode.opacity = 0;
        let fin = cc.fadeTo(0.5, 255);
        this.scollviewNode.runAction(fin);

        this.scollviewNode.scale = 0;
        let s = cc.scaleTo(0.5, 1).easing(cc.easeBackInOut());
        this.scollviewNode.runAction(s);
    }

    //隐藏view；
    hideScollviewNode() {
        let fout = cc.fadeOut(0.3);
        this.scollviewNode.runAction(fout);
        let s = cc.scaleTo(0.3, 0).easing(cc.easeBackIn());
        let end_func = cc.callFunc(function () {
            this.node.active = false;
        }.bind(this));
        let seq = cc.sequence([s, end_func]);
        this.scollviewNode.runAction(seq);
    }


    langText() {
        // let uiLang = MessageManager.getUrlParameterValue('ui_lang');
        this.targetRuleNode.active = true;
        const currentLangJson = MessageData.langDominoe;

        this.titleLabel.string = currentLangJson.game_rules ? currentLangJson.game_rules : MessageData.langDominoeEnglish.game_rules;
        this.winLabel.string = currentLangJson.win_or_lose ? currentLangJson.win_or_lose : MessageData.langDominoeEnglish.win_or_lose;
        if(Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND) {
            this.win1Label.string = currentLangJson.rule1 ? currentLangJson.rule1 : MessageData.langDominoeEnglish.rule1;
            this.win2Label.string = currentLangJson.rule2 ? currentLangJson.rule2 : MessageData.langDominoeEnglish.rule2;
        } else {
            this.win1Label.string = MessageData.langDominoe.score_100_explain ? MessageData.langDominoe.score_100_explain : MessageData.langDominoeEnglish.score_100_explain;
        }
        this.playerLabel.string = currentLangJson.player ? currentLangJson.player : MessageData.langDominoeEnglish.player;
        this.coinLabel.string = currentLangJson.following ? currentLangJson.following : MessageData.langDominoeEnglish.following;
        this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : MessageData.langDominoeEnglish.exit;
        this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : MessageData.langDominoeEnglish.internet;
        this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : MessageData.langDominoeEnglish.anything;
        this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : MessageData.langDominoeEnglish.calculate;

        if(Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND) {
            this.score1Label.string = currentLangJson.points ? currentLangJson.points : MessageData.langDominoeEnglish.points;
            this.score2Label.string = currentLangJson.winner ? currentLangJson.winner : MessageData.langDominoeEnglish.winner;
        } else {
            this.score1Label.string = currentLangJson.one_round_calculation ? currentLangJson.one_round_calculation : MessageData.langDominoeEnglish.one_round_calculation;
        }

        // switch (uiLang) {
        //     case 'en':
        //         this.titleLabel.string = currentLangJson.game_rules ? currentLangJson.game_rules : 'Game Rules';
        //         this.winLabel.string = currentLangJson.win_or_lose ? currentLangJson.win_or_lose : 'Win or Lose';
        //         if(Dominoe_GlobalGameData.gameMode === GameModeDominoe.ROUND) {
        //             this.win1Label.string = currentLangJson.rule1 ? currentLangJson.rule1 : '1. The game ends when one player finishes all the cards first, and the player who finishes the cards is the winner.';
        //             this.win2Label.string = currentLangJson.rule2 ? currentLangJson.rule2 : '2. The game ends when all players cannot play cards, calculate the card score of each player, and the player with the least score wins.';
        //         } else {
        //             this.win1Label.string = MessageData.langDominoe.score_100_explain ? MessageData.langDominoe.score_100_explain : "After the end of a round of card games, start accumulating the scores of this round into their total scores. If someone's total score exceeds 100, the game is over. Users with more than 100 points win.";
        //         }
        //         this.playerLabel.string = currentLangJson.player ? currentLangJson.player : 'Player Admits Defeat';
        //         this.coinLabel.string = currentLangJson.following ? currentLangJson.following : 'In the following cases, the user will be deemed to have conceded and 200 game coins will be deducted:';
        //         this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : '1. Exit the room during the game';
        //         this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : '2. The internet is disconnected for more than 60 seconds';
        //         this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : "3. Didn't do anything for 3 times in his round";
        //         this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : 'Calculate Score';
        //         // if()
        //         this.score1Label.string = 'Loser points minus winner points, 5 game coins are deducted for every point, up to 200 game coins are deducted.';
        //         this.score2Label.string = "The winner gets all game coins deducted by the loser. If there are multiple winners, then the winner splits all the losers' game coins equally.";
        //         break;
        //     case 'ar':
        //         this.titleLabel.node.active = false;
        //         this.winLabel.node.active = false;
        //         this.win1Label.node.active = false;
        //         this.win2Label.node.active = false;
        //         this.playerLabel.node.active = false;
        //         this.coinLabel.node.active = false;
        //         this.player1Label.node.active = false;
        //         this.player2Label.node.active = false;
        //         this.player3Label.node.active = false;
        //         this.scoreLabel.node.active = false;
        //         this.score1Label.node.active = false;
        //         this.score2Label.node.active = false
        //         this.ruleAR.active = true;
        //         for (let i = 0; i < 3; i++) {
        //             this.ruleIcons[i].active = false;
        //         }
        //         break;
        //     case 'hi':
        //         this.titleLabel.string = 'गेम के नियम';
        //         this.winLabel.string = 'जीत या हार';
        //         this.win1Label.string = '1. गेम तब समाप्त होता है जब एक प्लेयर पहले सभी कार्डों को पूरा करता है, और कार्ड खत्म करने वाले प्लेयर विजेता होता है।';
        //         this.win2Label.string = '2. गेम तब समाप्त होता है जब सभी प्लेयर्स कार्ड नहीं खेल सकते हैं, प्रत्येक प्लेयर के कार्ड स्कोर की गणना करते हैं, और कम से कम स्कोर वाले प्लेयर जीतते हैं।';
        //         this.playerLabel.string = currentLangJson.player ? currentLangJson.player : 'प्लेयर ने हार को स्वीकार किया';
        //         this.coinLabel.string = currentLangJson.following ? currentLangJson.following : 'निम्नलिखित मामलों में, यूजर को माना जाएगा और 200 खेल के सिक्कों को काट दिया जाएगा:';
        //         this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : '1. गेम के दौरान रूम से बाहर निकलें';
        //         this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : '2. 60 सेकंड से अधिक के लिए इंटरनेट काट गया है';
        //         this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : "3. अपने राउंड में 3 बार कुछ नहीं किया";
        //         this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : 'स्कोर की गणना करें';
        //         this.score1Label.string = 'हारने वाले अंक में माइनस विनर पॉइंट्स होते हैं, हर गेम के लिए 5 गेम के सिक्के काटे जाते हैं, अधिकतम 200 गेम के सिक्के काटे जा सकते है ।';
        //         this.score2Label.string = "विजेता को हारे हुए सभी गेम के सिक्के मिलते हैं। यदि कई विजेता हैं, तो विजेता सभी हारे हुए गेम के सिक्कों को समान रूप से विभाजित करता है।";
        //         break;
        //     case 'te':
        //         this.titleLabel.string = 'గేమ్ రూల్స్';
        //         this.winLabel.string = 'గెలుపు లేక ఓటమి';
        //         this.win1Label.string = '1. ఒక ప్లేయర్ దగ్గర ఉన్న కార్డ్స్ అన్ని అయిపోతే ఆట ముగుస్తుంది, మరియు ఎవరైతే కార్డ్స్ మొత్తం ఖర్చు చేస్తే వారే విజేతలు';
        //         this.win2Label.string = '2. ఒకవేళ ఏ ప్లేయర్ అయిన కార్డ్స్ వాడకపోతే ఆట ముగుస్తుంది, ప్రతి ప్లేయర్ ఒక్క కార్డు విలువ చూసి తక్కువ విలువ ఉన్న ఆటగాడు గెలుస్తారు';
        //         this.playerLabel.string = currentLangJson.player ? currentLangJson.player : 'ఆటగాడు ఓటమి ఒప్పుకున్నాడు';
        //         this.coinLabel.string = currentLangJson.following ? currentLangJson.following : 'ఈ క్రింద తెలిపిన సందర్భాలలో, యూజర్ 200 గేమ్ కాయిన్స్  ఖర్చుపెట్టినట్టుగా పరిగణించి వాటిని అకౌంట్ నుంచి తగ్గించబడుతాయి:';
        //         this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : '1. గేమ్ సమయంలో రూమ్ వదిలి వెళ్లడం';
        //         this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : '2. 60 సెకండ్స్ కన్నా ఎక్కువ సేపు ఇంటర్నెట్ వాళ్ళ డిస్ కనెక్ట్ అవ్వడం';
        //         this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : "3. వాళ్ళ రౌండ్ లో వరుసగా 3 సార్లు ఏమి చెయ్యకపోవడం";
        //         this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : 'స్కోర్ లెక్కించండి';
        //         this.score1Label.string = 'ఓడిన పాయింట్స్ నుంచి గెలిచినా పాయింట్స్  తొలిగించి, ప్రతి పాయింట్ కు 5 గేమ్ కాయిన్స్ చొప్పున గరిష్టంగా 200 గేమ్ కాయిన్స్  తొలగించబడతాయి';
        //         this.score2Label.string = "ఓడినవారి నుంచి తొలగించిన గేమ్ కాయిన్స్ మొత్తం విజేతకు లభిస్తాయి, ఒకవేళ ఒకరి కన్నా ఎక్కువ విజేతలు ఉంటె ఓడినవారి నుంచి పొందిన కాయిన్స్ విజేతలకు సమానముగా పంచబడుతాయి";
        //         break;
        //     case 'ta':
        //         this.titleLabel.string = 'கேம் விதிகள்';
        //         this.winLabel.string = 'வெற்றி அல்லது தோல்வி';
        //         this.win1Label.string = '1. ஒரு வீரர் முதலில் அனைத்து கார்டுகளையும் முடிக்கும்போது விளையாட்டு முடிவடைகிறது, மேலும் கார்டுகளை முடித்த வீரர் வெற்றியாளராக இருக்கிறார்.';
        //         this.win2Label.string = '2. அனைத்து வீரர்களும் கார்டுகளை விளையாட முடியாதபோது விளையாட்டு முடிகிறது, ​​ஒவ்வொரு வீரரின் கார்டு மதிப்பை கணக்கிடும்போது, ​​குறைந்த மதிப்பெண் பெற்ற வீரர் வெற்றிபெறுவார்.';
        //         this.playerLabel.string = currentLangJson.player ? currentLangJson.player : 'வீரர் தோல்வியை ஒப்புக்கொண்டார்';
        //         this.coinLabel.string = currentLangJson.following ? currentLangJson.following : 'பின்வரும் சந்தர்ப்பங்களில், பயனர் ஒப்புக்கொண்டதாகக் கருதப்படுவார், மேலும் 200 கேம் நாணயங்கள் கழிக்கப்படும்:';
        //         this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : '1. கேம்-ன் போது ரூம்-ஐ விட்டு வெளியேறினால்';
        //         this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : '2. 60 நொடிகளுக்கு மேல் இன்டர்நெட் கனெக்ட் ஆகாமல் இருந்தால்';
        //         this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : "3. தனது 3 சுற்றிலும் எதுவுமே செய்யாமல் இருந்தால்";
        //         this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : 'ஸ்கொர் கணக்கீடு';
        //         this.score1Label.string = 'வெற்றி புள்ளிகளில் தூவி புள்ளிகளை கழித்தல், ஒவ்வொரு புள்ளிக்கும் 5 விளையாட்டு நாணயங்கள் கழிக்கப்படுகின்றன, 200 கேம் நாணயங்கள் வரை கழிக்கப்படுகின்றன.';
        //         this.score2Label.string = "வெற்றியாளருக்கு தோல்வியுற்றவரால் கழிக்கப்படும் அனைத்து விளையாட்டு நாணயங்களும் கிடைக்கும். பல வெற்றியாளர்கள் இருந்தால், அனைத்து தோல்வியுற்றவர்களின் விளையாட்டு நாணயங்களையும் வெற்றியாளர் சமமாகப் பிரிப்பார்.";
        //         break;
        //     case 'id':
        //         this.titleLabel.string = 'Aturan Game';
        //         this.winLabel.string = 'Menang atau Kalah';
        //         this.win1Label.string = '1. Game berakhir ketika satu pemain menyelesaikan semua kartu terlebih dahulu, dan pemain yang menyelesaikan kartu adalah pemenangnya.';
        //         this.win2Label.string = '2. Game berakhir ketika semua pemain tidak bisa memainkan kartu, menghitung skor kartu dari setiap pemain, dan pemain dengan skor paling sedikit menang.';
        //         this.playerLabel.string = currentLangJson.player ? currentLangJson.player : 'Pemain Mengaku Kalah';
        //         this.coinLabel.string = currentLangJson.following ? currentLangJson.following : 'Dalam kasus berikut, pengguna akan dianggap sudah kebobolan dan 200 koin game akan dikurangi:';
        //         this.player1Label.string = currentLangJson.exit ? currentLangJson.exit : '1. Keluar dari ruang selama game';
        //         this.player2Label.string = currentLangJson.internet ? currentLangJson.internet : '2. Internet terputus selama lebih dari 60 detik';
        //         this.player3Label.string = currentLangJson.anything ? currentLangJson.anything : "3. Tidak melakukan apapun selama 3 kali putarannya";
        //         this.scoreLabel.string = currentLangJson.calculate ? currentLangJson.calculate : 'Hitung Skor';
        //         this.score1Label.string = 'Poin kalah dikurangi poin pemenang, 5 koin game dikurangkan untuk setiap poin, hingga 200 koin game dikurangi.';
        //         this.score2Label.string = "Pemenangnya mendapatkan semua koin game yang dipotong oleh yang kalah. Jika ada beberapa pemenang, maka pemenang tersebut membagi semua koin game yang kalah secara merata.";
        //         break;
        // }
    }

    close_callback() {
        this.hideScollviewNode();
    }

}
