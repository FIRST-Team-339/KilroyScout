package us.kilroyrobotics.kilroyscout

import android.annotation.SuppressLint
import android.content.SharedPreferences
import android.content.res.Configuration
import android.graphics.Typeface
import android.os.Bundle
import android.view.Gravity
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


class MatchesFragment(private var eventData: MutableLiveData<EventData?>, private val preferences: SharedPreferences, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_matches) {
    private val parser = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss")
    private val outputFormat = DateTimeFormat.forPattern("E, hh:mma")

    @OptIn(ExperimentalUnsignedTypes::class)
    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_matches, container, false)

        val matches: TableLayout = view.findViewById(R.id.matches)

        val blueAllianceColor = if (isDarkModeOn()) resources.getColor(R.color.blue_dark) else resources.getColor(R.color.blue_light)
        val redAllianceColor = if (isDarkModeOn()) resources.getColor(R.color.red_dark) else resources.getColor(R.color.red_light)
        val primaryTextColor = if (isDarkModeOn()) resources.getColor(R.color.white) else resources.getColor(R.color.black)

        val station = preferences.getString("station", "Blue 1") ?: "Blue 1"

        eventData.value?.matches?.forEach { match ->
            val matchNumber = TextView(context)
            matchNumber.text = match.matchNumber.toString()
            matchNumber.setTextColor(primaryTextColor)
            matchNumber.setTypeface(matchNumber.typeface, Typeface.BOLD)
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val parsedDate = parser.parseDateTime(match.startTime)
            val startTime = TextView(context)
            startTime.text = parsedDate.toString(outputFormat)
            startTime.setTextColor(primaryTextColor)
            startTime.setTypeface(startTime.typeface, Typeface.BOLD)
            startTime.textSize = 15F

            var team = match.blueAllianceTeams[0]
            var teamIndex = 0
            if (station == "Blue 2") {
                team = match.blueAllianceTeams[1]
                teamIndex = 0
            }
            if (station == "Blue 3") {
                team = match.blueAllianceTeams[2]
                teamIndex = 1
            }
            if (station == "Red 1") {
                team = match.redAllianceTeams[0]
                teamIndex = 0
            }
            if (station == "Red 2") {
                team = match.redAllianceTeams[1]
                teamIndex = 1
            }
            if (station == "Red 3") {
                team = match.redAllianceTeams[2]
                teamIndex = 2
            }

            val correctStation = TextView(context)
            correctStation.text = team.toString()
            if (station.contains("Blue")) correctStation.setTextColor(blueAllianceColor)
            if (station.contains("Red")) correctStation.setTextColor(redAllianceColor)
            correctStation.isClickable = true
            correctStation.textSize = 15F
            correctStation.setOnClickListener(showMatchPage(match, team, teamIndex, station.contains("Blue")))

            val tableRow = TableRow(context)
            tableRow.addView(matchNumber)
            tableRow.addView(startTime)
            tableRow.addView(correctStation)
            tableRow.setPadding(0, 15, 0, 15)

            matches.addView(tableRow)
        }


        return view
    }

    private fun isDarkModeOn(): Boolean {
        val nightModeFlags = resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES
    }

    private fun showMatchPage(match: EventData.Match, team: UInt, teamIndex: Int, blue: Boolean): (View) -> Unit {
        return fun(view: View) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, MatchFragment(match, team, teamIndex, blue, eventData, supportFragmentManager))
                .commitNow()
        }
    }
}
