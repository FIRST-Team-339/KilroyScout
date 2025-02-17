package us.kilroyrobotics.kilroyscout
import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TableLayout
import android.widget.TableRow
import android.widget.TextView
import androidx.annotation.IdRes
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.MutableLiveData
import org.joda.time.format.DateTimeFormat

class MatchesFragment(private var eventData: MutableLiveData<EventData?>, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_matches) {
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

        eventData.value?.matches?.forEach { match ->
            val matchNumber = TextView(context)
            matchNumber.text = match.matchNumber.toString()
            matchNumber.setTextColor(resources.getColor(R.color.black))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val parsedDate = parser.parseDateTime(match.startTime)
            val startTime = TextView(context)
            startTime.text = parsedDate.toString(outputFormat)
            startTime.setTextColor(resources.getColor(R.color.black))
            startTime.textSize = 15F

            val blue1 = TextView(context)
            blue1.text = match.blueAllianceTeams[0].toString()
            blue1.setTextColor(resources.getColor(R.color.blue))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val blue2 = TextView(context)
            blue2.text = match.blueAllianceTeams[1].toString()
            blue2.setTextColor(resources.getColor(R.color.blue))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val blue3 = TextView(context)
            blue3.text = match.blueAllianceTeams[2].toString()
            blue3.setTextColor(resources.getColor(R.color.blue))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val red1 = TextView(context)
            red1.text = match.redAllianceTeams[0].toString()
            red1.setTextColor(resources.getColor(R.color.red))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val red2 = TextView(context)
            red2.text = match.redAllianceTeams[1].toString()
            red2.setTextColor(resources.getColor(R.color.red))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val red3 = TextView(context)
            red3.text = match.redAllianceTeams[2].toString()
            red3.setTextColor(resources.getColor(R.color.red))
            matchNumber.isClickable = true
            matchNumber.textSize = 15F

            val tableRow = TableRow(context)
            tableRow.addView(matchNumber)
            tableRow.addView(startTime)
            tableRow.addView(blue1)
            tableRow.addView(blue2)
            tableRow.addView(blue3)
            tableRow.addView(red1)
            tableRow.addView(red2)
            tableRow.addView(red3)
            tableRow.setPadding(0, 10, 0, 10)

            matches.addView(tableRow)
        }


        return view
    }
}
