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

class TeamsFragment(private var eventData: MutableLiveData<EventData?>, private val mainActivity: MainActivity, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_teams) {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_teams, container, false)

        val teams: TableLayout = view.findViewById(R.id.teams)

        if (eventData.value != null) {
            eventData.value!!.teams.forEach { team ->
                val teamNumber = TextView(context)
                teamNumber.text = team.teamNumber.toString()
                teamNumber.setTypeface(teamNumber.typeface, Typeface.BOLD)
                teamNumber.setPadding(0, 0, 20, 0)
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
