package us.kilroyrobotics.kilroyscout

data class EventData(
    var event: Event,
    var teams: Array<Team>,
    var matches: Array<Match>
) {
    data class Event(
        var eventCode: String,
        var weekNumber: UInt,
        var name: String,
        var venue: String,
        var location: String,
        var dateStart: String,
        var dateEnd: String
    ) {}

    data class Team(
        var teamNumber: UInt,
        var name: String,
        var location: String,
        var rookieYear: UInt,
        var robotName: String,
        var scouting: PrescoutData
    ) {
        data class PrescoutData(
            @Volatile var modified: Boolean = false,
            var drivetrain: String,
            var programmingLanguage: String,
            var canScoreCoral: Boolean,
            var canScoreAlgae: Boolean,
            var maxCoralScoringLevel: UInt,
            var averageCoralCycled: UInt,
            var mostCoralCycled: UInt,
            var maxCoralScoredInAuto: UInt,
            var canLeaveInAuto: Boolean,
            var canScoreCoralInAuto: Boolean,
            var canScoreAlgaeInAuto: Boolean,
            var canShallowCageClimb: Boolean,
            var canDeepCageClimb: Boolean,
            var comments: String
        ) {}
    }

    data class Match(
        var matchNumber: UInt,
        var startTime: String,
        var rankMatchData: Boolean,
        var blueAllianceTeams: UIntArray,
        var redAllianceTeams: UIntArray,
        var scouting: MatchScoutingData
    ) {

        data class MatchScoutingData(
            var blue: Collection<TeamMatchScoutingData>,
            var red: Collection<TeamMatchScoutingData>
        ) {
            data class TeamMatchScoutingData(
                @Volatile var modified: Boolean,
                var auto: AutoScoutingData,
                var teleop: TeleopScoutingData,
                var allianceDidCoopertition: Boolean,
                var brokeDown: Boolean,
                var comments: String
            ) {
                data class AutoScoutingData(
                    var leave: Boolean,
                    var coralL1: UInt,
                    var coralL2: UInt,
                    var coralL3: UInt,
                    var coralL4: UInt,
                    var algaeProcessor: UInt,
                    var allianceGotAutoRP: Boolean
                ) {}

                data class TeleopScoutingData(
                    var coralL1: UInt,
                    var coralL2: UInt,
                    var coralL3: UInt,
                    var coralL4: UInt,
                    var algaeProcessor: UInt,
                    var algaeNet: UInt,
                    var parked: Boolean,
                    var shallowCageClimbed: Boolean,
                    var deepCageClimbed: Boolean,
                    var allianceGotCoralRP: Boolean,
                    var allianceGotBargeRP: Boolean,
                    var drivingSkill: UInt
                ) {}
            }
        }
    }
}
