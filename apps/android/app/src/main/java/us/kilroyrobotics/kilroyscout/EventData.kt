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
            @Volatile var recentlyModified: Boolean = false,
            var drivetrain: String,
            var programmingLanguage: String,
            var canScoreCoral: Boolean,
            var canRemoveAlgae: Boolean,
            var canScoreAlgae: Boolean,
            var maxCoralScoringLevel: UInt,
            var averageCoralCycled: UInt,
            var mostCoralCycled: UInt,
            var maxCoralScoredInAuto: UInt,
            var canLeaveInAuto: Boolean,
            var canScoreCoralInAuto: Boolean,
            var canRemoveAlgaeInAuto: Boolean,
            var canScoreAlgaeInAuto: Boolean,
            var canShallowCageClimb: Boolean,
            var canDeepCageClimb: Boolean,
            var comments: String
        ) {}

        data class BatchPrescoutData(
            var teamNumber: UInt,
            var scouting: PrescoutData
        )
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
            var blue: Array<TeamMatchScoutingData>,
            var red: Array<TeamMatchScoutingData>
        ) {
            data class TeamMatchScoutingData(
                @Volatile var modified: Boolean = false,
                @Volatile var recentlyModified: Boolean = false,
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
                    var algaeRemoved: UInt,
                    var algaeProcessor: UInt,
                ) {}

                data class TeleopScoutingData(
                    var coralL1: UInt,
                    var coralL2: UInt,
                    var coralL3: UInt,
                    var coralL4: UInt,
                    var algaeRemoved: UInt,
                    var algaeProcessor: UInt,
                    var algaeNet: UInt,
                    var parked: Boolean,
                    var shallowCageClimbed: Boolean,
                    var deepCageClimbed: Boolean,
                    var drivingSkill: UInt
                ) {}
            }

            data class BatchTeamMatchScoutingData(
                var matchNumber: UInt,
                var teamNumber: UInt,
                var scouting: TeamMatchScoutingData
            )
        }
    }
}
