export default interface TournamentType {
    type: string;
    line1Label: string;
    line2Label?: string;
    line2: boolean;
    spotify: boolean;
    youtube: boolean;
}

export const DEFAULT_MISC_TYPE: TournamentType = {
    type: "MISC",
    line1Label: "Line 1",
    line2Label: "Line 2",
    line2: true,
    spotify: false,
    youtube: false
};