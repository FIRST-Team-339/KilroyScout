package us.kilroyrobotics.kilroyscout
import android.annotation.SuppressLint
import android.graphics.Typeface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.MutableLiveData
import org.joda.time.format.DateTimeFormat

class EventInfoFragment(private var eventData: MutableLiveData<EventData?>, private val mainActivity: MainActivity, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_event_info) {
    private val parser = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss")
    private val outputFormat = DateTimeFormat.forPattern("MMMM dd, yyyy")

    @SuppressLint("SetTextI18n", "ResourceType")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_event_info, container, false)

        val eventName: TextView = view.findViewById(R.id.eventName)
        val eventCodeWeekName: TextView = view.findViewById(R.id.eventCodeWeekNumber)
        val startDate: TextView = view.findViewById(R.id.startDate)
        val endDate: TextView = view.findViewById(R.id.endDate)
        val venue: TextView = view.findViewById(R.id.venue)

        val teams: TableLayout = view.findViewById(R.id.teams)

        if (eventData.value != null) {
            eventName.text = eventData.value!!.event.name
            eventCodeWeekName.text = "${eventData.value!!.event.eventCode.uppercase()} • Week ${eventData.value!!.event.weekNumber}"
            val parsedStartDate = parser.parseDateTime(eventData.value!!.event.dateStart)
            val parsedEndDate = parser.parseDateTime(eventData.value!!.event.dateEnd)
            startDate.text = "From: ${parsedStartDate.toString(outputFormat)}"
            endDate.text = "To: ${parsedEndDate.toString(outputFormat)}"
            venue.text = eventData.value!!.event.venue + "\n" + eventData.value!!.event.location

            eventData.value!!.teams.forEach { team ->
                val teamNumber = TextView(context)
                teamNumber.text = team.teamNumber.toString()
                teamNumber.setTypeface(teamNumber.typeface, Typeface.BOLD)
                teamNumber.textSize = 15F

                val teamName = TextView(context)
                teamName.setTypeface(teamName.typeface, Typeface.BOLD)
                teamName.text = team.name
                teamName.textSize = 15F

                val tableRow = TableRow(context)
                tableRow.addView(teamNumber)
                tableRow.addView(teamName)
                tableRow.setPadding(0, 15, 0, 15)
                tableRow.isClickable = true

                tableRow.setOnClickListener(showTeamPage(team))

                teams.addView(tableRow)
            }

            eventCodeWeekName.visibility = View.VISIBLE
            startDate.visibility = View.VISIBLE
            endDate.visibility = View.VISIBLE
            venue.visibility = View.VISIBLE
            teams.visibility = View.VISIBLE
        } else {
            eventName.text = eventData.value?.event?.name ?: "No Event Data"
            eventCodeWeekName.visibility = View.INVISIBLE
            startDate.visibility = View.INVISIBLE
            endDate.visibility = View.INVISIBLE
            venue.visibility = View.INVISIBLE
            teams.visibility = View.INVISIBLE
        }

        return view
    }

    private fun showTeamPage(team: EventData.Team): (View) -> Unit {
        return fun(view: View) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, TeamFragment(team, eventData, supportFragmentManager))
                .commitNow()
        }
    }
}
