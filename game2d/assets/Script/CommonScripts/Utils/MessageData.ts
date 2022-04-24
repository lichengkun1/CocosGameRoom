import MatchPlayer from "../MatchSceneScripts/MatchPlayer";

export enum GameType {
    room = "room",
    single = "single"
}
export enum GameCoinType {
    coin = "coin",
    game_coin = "game_coin"
}
export enum StartGameType {
    roomOwner = "roomOwner",
    count_down = "count_down",
    match_up = "match_up"
}

export type LudoLangType = {
    players: string;
    select_mode: string;
    one_round: string;
    score: string;
    choose_bets: string;
    start: string;
    point: string;
    exit: string;
    rules: string;
    ufo: string;
    play_again: string;
    give_up_tip: string;
    network_abnormality: string;
    quit_ask_popup: string;
    close_in: string;
    winning_the_game: string;
    win_condition_rule: string;
    special_items: string;
    ufo_function: string;
    super_dice: string;
    super_dice_function: string;
    invisibility: string;
    invisibility_function: string;
    missile: string;
    missile_function: string;
    bets_setting: string;
    seat_is_full: string;
    tap_screen_to_control: string;
  
    host_configure: string;
    pay_service_fee: string;
    yes: string;
    no: string;
    play_game_tips: string;
    player_word: string;
    start_prepare: string;
    waiting: string;
    reset_game_model: string;
    title: string;
    win_label: string;
    win2_label: string;
    items_label: string;
    ufo_title_label: string;
    ufo_label: string;
    dice_title_label: string;
    dice_label: string;
    invisi_title_label: string;
    invisi_label: string;
    miss_title_label: string;
    miss_label: string;
    regret_title: string;
    regret_label: string;
    setbet: string;
    seatsfull: string;
    ok: string;
    tap_screen: string;
    only: string;
    coin_type: string;
    bets: string;
    winner: string;
    confirm: string;
    on: string;
    quick: string;
    classical: string;
    magic: string;
    set: string;
    game_mode: string;
    quick_mode_rule: string;
    classical_mode_rule: string;
    magic_mode: string;
    magic_mode_rule: string;
    match_failed: string;
    try_again: string;
    choose_friend_to: string;
    "1_on_1": string;
  }
export default class MessageData {
    public static gameName = ""

    public static gameType = GameType.single;// single
    public static isRoomOwner = false;//false
    public static game_coinType = GameCoinType.game_coin;//coin/game_coin
    public static player_number = "4";//4
    public static startGameType = StartGameType.roomOwner;//count_down,match_up
    public static switch_room_id = ""; // switch_room中的room_id single模式为source_id
    public static bet_limit = 200;


    public static matchScenePlayersData: {
        userid: number,
        userName: string,
        userAvatar: string,
        userHeadImage: cc.SpriteFrame,
        userFrame: string,
        userHeadFrameImage: cc.SpriteFrame
    }[] = [];
    public static matchScenePlayers: MatchPlayer[] = [];

    /**是否是房主 */
    public static isOwner = false;
    public static gameid = "";
    public static gameRoomId = "";
    public static gameSource = "";
    /**用户个人信息 */
    public static userInfo = null;
    public static userId: number = -1;
    public static shareUrl: string = "";


    public static isFirstSendJoinRoomGamePoint = true;
    public static isCanAutoJoinGame = true;
    public static isFirstShowChangeRoom = true;
    public static followedObj;

    public static gameSource_Id = "";
    public static isCanSendEmoji = false;
    public static extra;

    public static hasReceivedGroupInfo: boolean = false;


    public static lang ={
        "players": "PLAYERS",
        "select_mode": "Select Mode",
        "one_round": "ONE ROUND",
        "score": "SCORE",
        "choose_bets": "Choose Bets",
        "start": "START",
        "point": "Point",
        "exit": "Exit",
        "rules": "Rules",
        "ufo": "UFO",
        "play_again": "Play Again",
        "give_up_tip": "You have not made any action 3 times in a row,you hava been set to give up by the system.",
        "network_abnormality": "Network abnormality!",
        "quit_ask_popup": "Are you sure to quit the game?",
        "close_in": "Close in",
        "winning_the_game": "WINNING THE GAME",
        "win_condition_rule": "Each player wins when 2 playing pieces reach the end.",
        "special_items": "SPECIAL ITEMS",
        "ufo_function": "Pawns can randomly advance 3 to 8 squares.",
        "super_dice": "Super Dice",
        "super_dice_function": "The next time you roll the dice, there must be a six.",
        "invisibility": "Invisibility",
        "invisibility_function": "The token will not be kicked home by any other pieces or items for 2 rounds.",
        "missile": "Missile",
        "missile_function": "The missile advances 5 squares, and the other pieces encountered midway will be kicked home.",
        "bets_setting": "BETS SETTING",
        "seat_is_full": "The seats are full and you cannot join the game. Please communicate with the owner.",
        "tap_screen_to_control": "Tap the screen to control",
        "host_ configure": "Only the room owner and host can configure",
        "pay_service_fee": " Winner Pays 5% service fee.",
        "yes": "Yes",
        "no": "No",
        "1_on_1": "1 ON 1",
        "play_game_tips": "Come to join this chatroom and play incredible game!",
        "player_word": "player",
        "start_prepare": "START PREPARE",
        "waiting": "Waiting..",
        "reset_game_model": "Reset Game Mode",
        "title": "Rules",
        "win_label": "WINNING THE GAME",
        "win2_label": "Each player wins when 2 playing pieces reach the end.",
        "items_label": "SPECIAL ITEMS",
        "ufo_title_label": "UFO",
        "ufo_label": "Pawns can randomly advance 3 to 8 squares.",
        "dice_title_label": "Super Dice",
        "dice_label": "The next time you roll the dice, there must be a six.",
        "invisi_title_label": "Invisibility",
        "invisi_label": "The token will not be kicked home by any other pieces or items for 2 rounds.",
        "miss_title_label": "Missile",
        "miss_label": "The missile advances 5 squares, and the other pieces encountered midway will be kicked home.",
        "regret_title": "Regret function",
        "regret_label": "when you are not satisfied with the result of dice, you can use this function to roll dice again with game coins.",
        "setbet": "BETS SETTING",
        "seatsfull": "The seats are full and you cannot join the game. Please communicate with the owner.",
        "ok": "OK",
        "tap_screen": "Tap the screen to control",
        "only": "Only the room owner and host can configure",
        "coin_type": "COIN TYPE",
        "bets": "BETS",
        "winner": "Winner Pays 5% service fee.",
        "confirm": "Confirm",
        "on": "ON",
        "quick": "QUICK",
        "classical": "CLASSICAL",
        "magic": "MAGIC",
        "set": "SET",
        "game_mode": "Game Mode",
        "quick_mode_rule": "Each player has 2 tokens and wins when they reach the end",
        "classical_mode_rule": "Each player has 4 tokens and wins when they reach the end",
        "magic_mode": "Magic Mode",
        "magic_mode_rule": "Items will appear randomly in the map.",
        "match_failed": "Match failed !",
        "try_again": "Try Again",
        "choose_friend_to": "Choose friend to",
        "yoyo_coins": "You do not have enough Coins, please recharge.",
        "game_coins": "You do not have enough Game Coins, please recharge.",
        "recharge": "Recharge",

        "under_maintenance": "The game is under maintenance, please try again later.",
        "system_busy": "Bet failed, the system is busy, please try again later.",
        "ban_user_game": "The account is banned and cannot play games, please contact customer service."
    }
    public static langEnglish ={
        "players": "PLAYERS",
        "select_mode": "Select Mode",
        "one_round": "ONE ROUND",
        "score": "SCORE",
        "choose_bets": "Choose Bets",
        "start": "START",
        "point": "Point",
        "exit": "Exit",
        "rules": "Rules",
        "ufo": "UFO",
        "play_again": "Play Again",
        "give_up_tip": "You have not made any action 3 times in a row,you hava been set to give up by the system.",
        "network_abnormality": "Network abnormality!",
        "quit_ask_popup": "Are you sure to quit the game?",
        "close_in": "Close in",
        "winning_the_game": "WINNING THE GAME",
        "win_condition_rule": "Each player wins when 2 playing pieces reach the end.",
        "special_items": "SPECIAL ITEMS",
        "ufo_function": "Pawns can randomly advance 3 to 8 squares.",
        "super_dice": "Super Dice",
        "super_dice_function": "The next time you roll the dice, there must be a six.",
        "invisibility": "Invisibility",
        "invisibility_function": "The token will not be kicked home by any other pieces or items for 2 rounds.",
        "missile": "Missile",
        "missile_function": "The missile advances 5 squares, and the other pieces encountered midway will be kicked home.",
        "bets_setting": "BETS SETTING",
        "seat_is_full": "The seats are full and you cannot join the game. Please communicate with the owner.",
        "tap_screen_to_control": "Tap the screen to control",
        "host_ configure": "Only the room owner and host can configure",
        "pay_service_fee": " Winner Pays 5% service fee.",
        "yes": "Yes",
        "no": "No",
        "1_on_1": "1 ON 1",
        "play_game_tips": "Come to join this chatroom and play incredible game!",
        "player_word": "player",
        "start_prepare": "START PREPARE",
        "waiting": "Waiting..",
        "reset_game_model": "Reset Game Mode",
        "title": "Rules",
        "win_label": "WINNING THE GAME",
        "win2_label": "Each player wins when 2 playing pieces reach the end.",
        "items_label": "SPECIAL ITEMS",
        "ufo_title_label": "UFO",
        "ufo_label": "Pawns can randomly advance 3 to 8 squares.",
        "dice_title_label": "Super Dice",
        "dice_label": "The next time you roll the dice, there must be a six.",
        "invisi_title_label": "Invisibility",
        "invisi_label": "The token will not be kicked home by any other pieces or items for 2 rounds.",
        "miss_title_label": "Missile",
        "miss_label": "The missile advances 5 squares, and the other pieces encountered midway will be kicked home.",
        "regret_title": "Regret function",
        "regret_label": "when you are not satisfied with the result of dice, you can use this function to roll dice again with game coins.",
        "setbet": "BETS SETTING",
        "seatsfull": "The seats are full and you cannot join the game. Please communicate with the owner.",
        "ok": "OK",
        "tap_screen": "Tap the screen to control",
        "only": "Only the room owner and host can configure",
        "coin_type": "COIN TYPE",
        "bets": "BETS",
        "winner": "Winner Pays 5% service fee.",
        "confirm": "Confirm",
        "on": "ON",
        "quick": "QUICK",
        "classical": "CLASSICAL",
        "magic": "MAGIC",
        "set": "SET",
        "game_mode": "Game Mode",
        "quick_mode_rule": "Each player has 2 tokens and wins when they reach the end",
        "classical_mode_rule": "Each player has 4 tokens and wins when they reach the end",
        "magic_mode": "Magic Mode",
        "magic_mode_rule": "Items will appear randomly in the map.",
        "match_failed": "Match failed !",
        "try_again": "Try Again",
        "choose_friend_to": "Choose friend to",
        "yoyo_coins": "You do not have enough Coins, please recharge.",
        "game_coins": "You do not have enough Game Coins, please recharge.",
        "recharge": "Recharge",

        "under_maintenance": "The game is under maintenance, please try again later.",
        "system_busy": "Bet failed, the system is busy, please try again later.",
        "ban_user_game": "The account is banned and cannot play games, please contact customer service."
    }
     
    public static langDominoe = {
        "players": "PLAYERS",
        "select_mode": "Select Mode",
        "one_round": "ONE ROUND",
        "score": "SCORE",
        "choose_bets": "Choose Bets",
        "start": "START",
        "point": "Point",
        "balance_alert": "Your Game Coins balance is less than 200",
        "your_turn": "Your Turn",
        "pass": "Pass",
        "draw_card": "Draw Card",
        "yoyo_coins": "You do not have enough Coins, please recharge.",
        "game_coins": "You do not have enough Game Coins, please recharge.",
        "btn_join": "Join",
        "btn_exit": "Exit",
        "game_rules": "Game Rules",
        "win_or_lose": "Win or Lose",
        "rule1": "1. The game ends when one player finishes all the cards first, and the player who finishes the cards is the winner.",
        "rule2": "2. The game ends when all players cannot play cards, calculate the card score of each player, and the player with the least score wins.",
        "player": "Player Admits Defeat",
        "following": "In the following cases, the user will be deemed to have conceded and 200 game coins will be deducted.",
        "exit": "1. Exit the room during the game",
        "internet": "2. The internet is disconnected for more than 60 seconds",
        "anything": "3. Didn't do anything for 3 times in his round",
        "calculate": "Calculate Score",
        "points": "Loser points minus winner points, 5 game coins are deducted for every point, up to 200 game coins are deducted.",
        "winner": "The winner gets all game coins deducted by the loser. If there are multiple winners, then the winner splits all the losers' game coins equally.",
        "made": "You hava not made any action 3 times in a row,you hava been set to give up by the system.",
        "exit_game_lang": "Are you sure you quit the game?",
        "yes_lang": "Yes",
        "no_lang": "No",
        "play_again": "Play Again",
        "finding": "FINDING PLAYERS",
        "recharge": "Recharge",
        "cancel": "Cancel",
        "coin_game_exit": "200 game coins will be deducted after quitting the game. Are you sure you want to quit?",
        "yoyo_game_exit": "200 yoyo coins will be deducted after quitting the game. Are you sure you want to quit?",
        "no_match_player": "There are not enough player to match. Do you want to try again?",
        "continue": "Continue",
        "entry_fee": "Entry Fee",
        "game_mode": "Game Mode",
        "one_round_explain": "After a round of cards, the game ends and the player with the lowest score wins. Calculate the number of winning and losing game coins according to the score.",
        "score_100_explain": "After the end of a round of card games, start accumulating the scores of this round into their total scores. If someone's total score exceeds 100, the game is over. Users with more than 100 points win.",
        "one_round_calculation": "The winner gets the total amount of currencies bet by all losers. If there are multiple winners, the winner shares all the losers' currencies equally.",
        "next_round": "Next Round",
        "game_over": "Game Over",
        "score_100": "SCORE 100",
        "waiting": "Waiting",
        "match_failed": "Match failed !",
        "try_again": "Try Again",
        "limit": "Limits",
        "round": "Round",
        "confirm": "Confirm",
        "start_prepare": "START PREPARE",
        "total": "TOTAL",
        "player_word": "player",
        "tap_screen": "Tap the screen to control",
        "network_abnormality": "Network abnormality!"
    }
    

    public static langDominoeEnglish = {
        "players": "PLAYERS",
        "select_mode": "Select Mode",
        "one_round": "ONE ROUND",
        "score": "SCORE",
        "choose_bets": "Choose Bets",
        "start": "START",
        "point": "Point",
        "balance_alert": "Your Game Coins balance is less than 200",
        "your_turn": "Your Turn",
        "pass": "Pass",
        "draw_card": "Draw Card",
        "yoyo_coins": "You do not have enough Coins, please recharge.",
        "game_coins": "You do not have enough Game Coins, please recharge.",
        "btn_join": "Join",
        "btn_exit": "Exit",
        "game_rules": "Game Rules",
        "win_or_lose": "Win or Lose",
        "rule1": "1. The game ends when one player finishes all the cards first, and the player who finishes the cards is the winner.",
        "rule2": "2. The game ends when all players cannot play cards, calculate the card score of each player, and the player with the least score wins.",
        "player": "Player Admits Defeat",
        "following": "In the following cases, the user will be deemed to have conceded and 200 game coins will be deducted.",
        "exit": "1. Exit the room during the game",
        "internet": "2. The internet is disconnected for more than 60 seconds",
        "anything": "3. Didn't do anything for 3 times in his round",
        "calculate": "Calculate Score",
        "points": "Loser points minus winner points, 5 game coins are deducted for every point, up to 200 game coins are deducted.",
        "winner": "The winner gets all game coins deducted by the loser. If there are multiple winners, then the winner splits all the losers' game coins equally.",
        "made": "You hava not made any action 3 times in a row,you hava been set to give up by the system.",
        "exit_game_lang": "Are you sure you quit the game?",
        "yes_lang": "Yes",
        "no_lang": "No",
        "play_again": "Play Again",
        "finding": "FINDING PLAYERS",
        "recharge": "Recharge",
        "cancel": "Cancel",
        "coin_game_exit": "200 game coins will be deducted after quitting the game. Are you sure you want to quit?",
        "yoyo_game_exit": "200 yoyo coins will be deducted after quitting the game. Are you sure you want to quit?",
        "no_match_player": "There are not enough player to match. Do you want to try again?",
        "continue": "Continue",
        "entry_fee": "Entry Fee",
        "game_mode": "Game Mode",
        "one_round_explain": "After a round of cards, the game ends and the player with the lowest score wins. Calculate the number of winning and losing game coins according to the score.",
        "score_100_explain": "After the end of a round of card games, start accumulating the scores of this round into their total scores. If someone's total score exceeds 100, the game is over. Users with more than 100 points win.",
        "one_round_calculation": "The winner gets the total amount of currencies bet by all losers. If there are multiple winners, the winner shares all the losers' currencies equally.",
        "next_round": "Next Round",
        "game_over": "Game Over",
        "score_100": "SCORE 100",
        "waiting": "Waiting",
        "match_failed": "Match failed !",
        "try_again": "Try Again",
        "limit": "Limits",
        "round": "Round",
        "confirm": "Confirm",
        "start_prepare": "START PREPARE",
        "total": "TOTAL",
        "player_word": "player",
        "tap_screen": "Tap the screen to control",
        "network_abnormality": "Network abnormality!"
    }
}