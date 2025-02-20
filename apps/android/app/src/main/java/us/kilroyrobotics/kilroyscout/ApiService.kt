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

    data class GenericRequestResponse(val message: String) {}
}