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

        val station = preferences.getString("station", "Blue 1")

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

            val blue1 = TextView(context)
            blue1.text = match.blueAllianceTeams[0].toString()
            blue1.setTextColor(blueAllianceColor)
            if (station == "Blue 1") {
                blue1.paint.isUnderlineText = true;
                blue1.setTypeface(blue1.typeface, Typeface.BOLD_ITALIC)
            }
            blue1.isClickable = true
            blue1.textSize = 15F
            blue1.setOnClickListener(showMatchPage(match, match.blueAllianceTeams[0], 0, true))

            val blue2 = TextView(context)
            blue2.text = match.blueAllianceTeams[1].toString()
            blue2.setTextColor(blueAllianceColor)
            if (station == "Blue 2") {
                blue2.paint.isUnderlineText = true;
                blue2.setTypeface(blue2.typeface, Typeface.BOLD_ITALIC)
            }
            blue2.isClickable = true
            blue2.textSize = 15F
            blue2.setOnClickListener(showMatchPage(match, match.blueAllianceTeams[1], 1, true))

            val blue3 = TextView(context)
            blue3.text = match.blueAllianceTeams[2].toString()
            blue3.setTextColor(blueAllianceColor)
            if (station == "Blue 3") {
                blue3.paint.isUnderlineText = true;
                blue3.setTypeface(blue3.typeface, Typeface.BOLD_ITALIC)
            }
            blue3.isClickable = true
            blue3.textSize = 15F
            blue3.setOnClickListener(showMatchPage(match, match.blueAllianceTeams[2], 2, true))

            val red1 = TextView(context)
            red1.text = match.redAllianceTeams[0].toString()
            red1.setTextColor(redAllianceColor)
            if (station == "Red 1") {
                red1.paint.isUnderlineText = true;
                red1.setTypeface(red1.typeface, Typeface.BOLD_ITALIC)
            }
            red1.isClickable = true
            red1.textSize = 15F
            red1.setOnClickListener(showMatchPage(match, match.redAllianceTeams[0], 0, false))

            val red2 = TextView(context)
            red2.text = match.redAllianceTeams[1].toString()
            red2.setTextColor(redAllianceColor)
            if (station == "Red 2") {
                red2.paint.isUnderlineText = true;
                red2.setTypeface(red2.typeface, Typeface.BOLD_ITALIC)
            }
            red2.isClickable = true
            red2.textSize = 15F
            red2.setOnClickListener(showMatchPage(match, match.redAllianceTeams[1], 1, false))

            val red3 = TextView(context)
            red3.text = match.redAllianceTeams[2].toString()
            red3.setTextColor(redAllianceColor)
            if (station == "Red 3") {
                red3.paint.isUnderlineText = true;
                red3.setTypeface(red3.typeface, Typeface.BOLD_ITALIC)
            }
            red3.isClickable = true
            red3.textSize = 15F
            red3.setOnClickListener(showMatchPage(match, match.redAllianceTeams[2], 2, false))

            val tableRow = TableRow(context)
            tableRow.addView(matchNumber)
            tableRow.addView(startTime)
            tableRow.addView(blue1)
            tableRow.addView(blue2)
            tableRow.addView(blue3)
            tableRow.addView(red1)
            tableRow.addView(red2)
            tableRow.addView(red3)
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
