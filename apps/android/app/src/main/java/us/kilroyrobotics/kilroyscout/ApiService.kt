package us.kilroyrobotics.kilroyscout

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @GET("/api/getEventData")
    fun getEventData(): Call<EventData>

    @POST("/api/setData/prescout/{team}")
    fun setPrescoutData(@Path("team") team: UInt, @Body body: EventData.Team.PrescoutData): Call<GenericRequestResponse>

    @POST("/api/setData/match/{match}/{team}")
    fun setMatchDataForTeam(@Path("match") match: UInt, @Path("team") team: UInt, @Body body: EventData.Match.MatchScoutingData.TeamMatchScoutingData): Call<GenericRequestResponse>

    @POST("/api/setData/batch/prescout")
    fun setBatchPrescoutData(@Body body: Array<EventData.Team.BatchPrescoutData>): Call<GenericRequestResponse>

    @POST("/api/setData/batch/match")
    fun setBatchMatchData(@Body body: Array<EventData.Match.MatchScoutingData.BatchTeamMatchScoutingData>): Call<GenericRequestResponse>

    data class GenericRequestResponse(val message: String) {}
}