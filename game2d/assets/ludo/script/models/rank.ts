export default class RankModel {
    public IsRobot: boolean = false;

    public abandoned: boolean = false;

    public arrived: number = 0;
    public index: number = 0;

    public pieces: number;
    public points: number = 0;

    public user_id: number = 0;
}