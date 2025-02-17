package us.kilroyrobotics.kilroyscout

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button;
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeFragment(private val mainActivity: MainActivity, private var eventData: MutableLiveData<EventData?>,
                   private val preferences: SharedPreferences, private val apiService: ApiService) : Fragment(R.layout.fragment_home) {
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

        return view
    }

    @SuppressLint("ApplySharedPref")
    private fun updateBaseUrl(newBaseUrl: String) {
        preferences.edit().putString("baseUrl", newBaseUrl).commit()
    }

    private fun fetchData(view: View) {
        apiService.getEventData().enqueue(object: Callback<EventData> {
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

    private fun sendData(view: View) {
        if (eventData.value == null) {
            Toast.makeText(context, "No Event Data", Toast.LENGTH_SHORT).show()
            return
        }

        val modifiedTeams = eventData.value!!.teams.filter {team ->
            return@filter team.scouting.modified
        }

        MaterialAlertDialogBuilder(mainActivity)
            .setTitle(resources.getString(R.string.send_data_dialog_title))
            .setMessage("Team Prescouting Data:\n   ${modifiedTeams.map { team -> "   • ${team.teamNumber}\n" }.toString().substringAfter("[").substringBefore("]").split(",").joinToString("  ")}\n\nPressing 'cancel' will not remove any local/edited data, and you can send at a later time.")
            .setNeutralButton(resources.getString(R.string.event_dialog_cancel)) { _, _ -> }
            .setPositiveButton(resources.getString(R.string.event_dialog_continue)) { _, _ ->
                modifiedTeams.forEach { team ->
                    apiService.setPrescoutData(team.teamNumber, team.scouting).enqueue(object: Callback<ApiService.GenericRequestResponse> {
                        override fun onResponse(call: Call<ApiService.GenericRequestResponse>, response: Response<ApiService.GenericRequestResponse>) {
                            if (response.isSuccessful) {
                                eventData.value = eventData.value?.copy(teams = eventData.value!!.teams.map { t ->
                                    if (t.teamNumber == team.teamNumber) team.scouting.modified = false
                                    t
                                }.toTypedArray())
                                Toast.makeText(context, "Sent Data Successfully", Toast.LENGTH_SHORT).show()
                            } else {
                                // Handle error
                                Toast.makeText(context, "Data for ${team.teamNumber} failed to send", Toast.LENGTH_SHORT).show()
                                println("Send Data Failed: ${response.code()} | ${response.errorBody()?.string()}")
                            }
                        }

                        override fun onFailure(call: Call<ApiService.GenericRequestResponse>, t: Throwable) {
                            Toast.makeText(context, "Data for ${team.teamNumber} failed to send", Toast.LENGTH_SHORT).show()
                            println("Send Data Failed: ${t.message}")
                        }
                    })
                }
            }
            .show()
    }
}