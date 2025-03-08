package us.kilroyrobotics.kilroyscout

import android.annotation.SuppressLint
import android.content.SharedPreferences
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button;
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.MutableLiveData
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.textfield.MaterialAutoCompleteTextView
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import org.joda.time.format.DateTimeFormat
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeFragment(private val mainActivity: MainActivity, private var eventData: MutableLiveData<EventData?>,
                   private val preferences: SharedPreferences, private val apiService: ApiService, private val supportFragmentManager: FragmentManager
) : Fragment(R.layout.fragment_home) {
    private val parser = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss")
    private val outputFormat = DateTimeFormat.forPattern("MMMM dd, yyyy")

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        val baseUrlField: TextInputEditText = view.findViewById(R.id.baseUrlField)
        baseUrlField.setText(preferences.getString("baseUrl", "http://10.0.0.1:3000"))
        baseUrlField.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                updateBaseUrl(s.toString())
            }
        })

        val fetchDataButton: Button = view.findViewById(R.id.fetchDataButton)
        fetchDataButton.setOnClickListener(this::fetchData)

        val sendDataButton: Button = view.findViewById(R.id.sendDataButton)
        sendDataButton.setOnClickListener(this::sendData)

        val station: TextInputLayout = view.findViewById(R.id.station)
        val stationItems = arrayOf("Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3")
        val stationAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, stationItems)
        val stationEditText = station.editText as? MaterialAutoCompleteTextView
        stationEditText?.setAdapter(stationAdapter)
        stationEditText?.threshold = Integer.MAX_VALUE
        stationEditText?.setText(preferences.getString("station", "Blue 1"))
        stationEditText?.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                preferences.edit().putString("station", s.toString()).commit()
            }
        })

        val eventName: TextView = view.findViewById(R.id.eventName)
        val eventCodeWeekName: TextView = view.findViewById(R.id.eventCodeWeekNumber)
        val startDate: TextView = view.findViewById(R.id.startDate)
        val endDate: TextView = view.findViewById(R.id.endDate)
        val venue: TextView = view.findViewById(R.id.venue)

        if (eventData.value != null) {
            eventName.text = eventData.value!!.event.name
            eventCodeWeekName.text = "${eventData.value!!.event.eventCode.uppercase()} • Week ${eventData.value!!.event.weekNumber}"
            val parsedStartDate = parser.parseDateTime(eventData.value!!.event.dateStart)
            val parsedEndDate = parser.parseDateTime(eventData.value!!.event.dateEnd)
            startDate.text = "From: ${parsedStartDate.toString(outputFormat)}"
            endDate.text = "To: ${parsedEndDate.toString(outputFormat)}"
            venue.text = eventData.value!!.event.venue + "\n" + eventData.value!!.event.location

            eventCodeWeekName.visibility = View.VISIBLE
            startDate.visibility = View.VISIBLE
            endDate.visibility = View.VISIBLE
            venue.visibility = View.VISIBLE
        } else {
            eventName.text = eventData.value?.event?.name ?: "No Event Data"
            eventCodeWeekName.visibility = View.INVISIBLE
            startDate.visibility = View.INVISIBLE
            endDate.visibility = View.INVISIBLE
            venue.visibility = View.INVISIBLE
        }

        return view
    }

    @SuppressLint("ApplySharedPref")
    private fun updateBaseUrl(newBaseUrl: String) {
        preferences.edit().putString("baseUrl", newBaseUrl).commit()
    }

    private fun fetchData(view: View) {
        apiService.getEventData().enqueue(object: Callback<EventData> {
            @SuppressLint("SetTextI18n")
            override fun onResponse(call: Call<EventData>, response: Response<EventData>) {
                if (response.isSuccessful) {
                    val data = response.body()
                    // Do something with the data
                    if (data != null) {
                        MaterialAlertDialogBuilder(mainActivity)
                            .setTitle(resources.getString(R.string.event_dialog_title))
                            .setMessage(resources.getString(R.string.event_dialog_message))
                            .setNegativeButton(resources.getString(R.string.event_dialog_cancel)) { _, _ ->
                                println("User cancelled fetch event data")
                            }
                            .setPositiveButton(resources.getString(R.string.event_dialog_continue)) { _, _ ->
                                eventData.value = data

                                supportFragmentManager.beginTransaction()
                                    .replace(R.id.nav_host_fragment, HomeFragment(mainActivity, eventData, preferences, apiService, supportFragmentManager))
                                    .commitNow()
                            }
                            .show()
                    }
                } else {
                    // Handle error
                    println("Fetch Failed: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<EventData>, t: Throwable) {
                println("Fetch Failed: ${t.message}")
            }
        })
    }

    @OptIn(ExperimentalUnsignedTypes::class)
    private fun sendData(view: View) {
        if (eventData.value == null) {
            Toast.makeText(context, "No Event Data", Toast.LENGTH_SHORT).show()
            return
        }

        val recentlyModifiedTeams = eventData.value!!.teams.filter {
            it.scouting.recentlyModified
        }.map { team -> EventData.Team.BatchPrescoutData(teamNumber = team.teamNumber, scouting = team.scouting) }

        val recentlyModifiedMatchScoutingData = eventData.value!!.matches.flatMap { match ->
            val blueFiltered = match.scouting.blue.withIndex().filter { it.value.recentlyModified }
                .map { EventData.Match.MatchScoutingData.BatchTeamMatchScoutingData(matchNumber = match.matchNumber, teamNumber = match.blueAllianceTeams[it.index], scouting = it.value) }

            val redFiltered = match.scouting.red.withIndex().filter { it.value.recentlyModified }
                .map { EventData.Match.MatchScoutingData.BatchTeamMatchScoutingData(matchNumber = match.matchNumber, teamNumber = match.redAllianceTeams[it.index], scouting = it.value) }

            blueFiltered + redFiltered
        }

        MaterialAlertDialogBuilder(mainActivity)
            .setTitle(resources.getString(R.string.send_data_dialog_title))
            .setMessage(
                """Team Prescouting Data:
                ${
                    recentlyModifiedTeams.map { "   • Team ${it.teamNumber}\n" }.toString()
                        .substringAfter("[").substringBefore("]").split(",").joinToString("  ")
                }
                
Match Data:
                ${
                    recentlyModifiedMatchScoutingData.map { "   • Match ${it.matchNumber} - Team ${it.teamNumber}\n" }.toString()
                        .substringAfter("[").substringBefore("]").split(",").joinToString("  ")
                }

Pressing 'cancel' will not remove any local/edited data, and you can send at a later time."""
            )
            .setNeutralButton(resources.getString(R.string.event_dialog_cancel)) { _, _ -> }
            .setPositiveButton(resources.getString(R.string.event_dialog_continue)) { _, _ ->
                apiService.setBatchPrescoutData(recentlyModifiedTeams.toTypedArray()).enqueue(object: Callback<ApiService.GenericRequestResponse> {
                    override fun onResponse(call: Call<ApiService.GenericRequestResponse>, response: Response<ApiService.GenericRequestResponse>) {
                        if (response.isSuccessful) {
                            eventData.value = eventData.value?.copy(teams = eventData.value!!.teams.map { team ->
                                team.scouting.recentlyModified = false
                                return@map team
                            }.toTypedArray())
                            Toast.makeText(context, "Sent Data Successfully", Toast.LENGTH_SHORT).show()
                        } else {
                            // Handle error
                            Toast.makeText(context, "Some or all data failed to send, check server for details", Toast.LENGTH_SHORT).show()
                            println("Send Data Failed: ${response.code()} | ${response.errorBody()?.string()}")
                        }
                    }

                    override fun onFailure(call: Call<ApiService.GenericRequestResponse>, t: Throwable) {
                        Toast.makeText(context, "Some or all data failed to send, check server for details", Toast.LENGTH_SHORT).show()
                        println("Send Data Failed: ${t.message}")
                    }
                })

                apiService.setBatchMatchData(recentlyModifiedMatchScoutingData.toTypedArray()).enqueue(object: Callback<ApiService.GenericRequestResponse> {
                    override fun onResponse(call: Call<ApiService.GenericRequestResponse>, response: Response<ApiService.GenericRequestResponse>) {
                        if (response.isSuccessful) {
                            eventData.value = eventData.value?.copy(matches = eventData.value!!.matches.map { match ->
                                match.scouting.blue.forEach { it.recentlyModified = false }
                                match.scouting.red.forEach { it.recentlyModified = false }

                                return@map match
                            }.toTypedArray())
                            Toast.makeText(context, "Sent Data Successfully", Toast.LENGTH_SHORT).show()
                        } else {
                            // Handle error
                            Toast.makeText(context, "Some or all data failed to send, check server for details", Toast.LENGTH_SHORT).show()
                            println("Send Data Failed: ${response.code()} | ${response.errorBody()?.string()}")
                        }
                    }

                    override fun onFailure(call: Call<ApiService.GenericRequestResponse>, t: Throwable) {
                        Toast.makeText(context, "Some or all data failed to send, check server for details", Toast.LENGTH_SHORT).show()
                        println("Send Data Failed: ${t.message}")
                    }
                })
            }
            .show()
    }
}