package us.kilroyrobotics.kilroyscout
import android.annotation.SuppressLint
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.MutableLiveData
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.MaterialAutoCompleteTextView
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class MatchFragment(private val match: EventData.Match, private val team: UInt, private val teamIndex: Int, private val blue: Boolean, private val eventData: MutableLiveData<EventData?>, private val supportFragmentManager: FragmentManager) : Fragment(R.layout.fragment_match) {
    private var teamMatchScoutingData = if (blue) match.scouting.blue[teamIndex] else match.scouting.red[teamIndex]
    private var savebar: Snackbar? = null

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_match, container, false)

        val matchIdentifier: TextView = view.findViewById(R.id.matchIdentifier)
        matchIdentifier.text = "Match ${match.matchNumber} • $team • ${if (blue) "Blue" else "Red"} ${teamIndex + 1}"

        val brokeDown: CheckBox = view.findViewById(R.id.brokeDown)
        brokeDown.isChecked = teamMatchScoutingData.brokeDown
        brokeDown.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(brokeDown = state)
            runSaveCheck(view)
        }

        val autoLeave: CheckBox = view.findViewById(R.id.auto_leave)
        autoLeave.isChecked = teamMatchScoutingData.auto.leave
        autoLeave.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(leave = state))
            runSaveCheck(view)
        }

        val autoCoralL1Amount: TextView = view.findViewById(R.id.auto_coralL1Amount)
        autoCoralL1Amount.text = teamMatchScoutingData.auto.coralL1.toString()
        val autoCoralL1Add: Button = view.findViewById(R.id.auto_coralL1Add)
        autoCoralL1Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL1 = teamMatchScoutingData.auto.coralL1 + 1u))
            autoCoralL1Amount.text = teamMatchScoutingData.auto.coralL1.toString()
            runSaveCheck(view)
        }
        val autoCoralL1Remove: Button = view.findViewById(R.id.auto_coralL1Remove)
        autoCoralL1Remove.setOnClickListener {
            if (teamMatchScoutingData.auto.coralL1 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL1 = teamMatchScoutingData.auto.coralL1 - 1u))
                autoCoralL1Amount.text = teamMatchScoutingData.auto.coralL1.toString()
                runSaveCheck(view)
            }
        }

        val autoCoralL2Amount: TextView = view.findViewById(R.id.auto_coralL2Amount)
        autoCoralL2Amount.text = teamMatchScoutingData.auto.coralL2.toString()
        val autoCoralL2Add: Button = view.findViewById(R.id.auto_coralL2Add)
        autoCoralL2Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL2 = teamMatchScoutingData.auto.coralL2 + 1u))
            autoCoralL2Amount.text = teamMatchScoutingData.auto.coralL2.toString()
            runSaveCheck(view)
        }
        val autoCoralL2Remove: Button = view.findViewById(R.id.auto_coralL2Remove)
        autoCoralL2Remove.setOnClickListener {
            if (teamMatchScoutingData.auto.coralL2 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL2 = teamMatchScoutingData.auto.coralL2 - 1u))
                autoCoralL2Amount.text = teamMatchScoutingData.auto.coralL2.toString()
                runSaveCheck(view)
            }
        }

        val autoCoralL3Amount: TextView = view.findViewById(R.id.auto_coralL3Amount)
        autoCoralL3Amount.text = teamMatchScoutingData.auto.coralL3.toString()
        val autoCoralL3Add: Button = view.findViewById(R.id.auto_coralL3Add)
        autoCoralL3Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL3 = teamMatchScoutingData.auto.coralL3 + 1u))
            autoCoralL3Amount.text = teamMatchScoutingData.auto.coralL3.toString()
            runSaveCheck(view)
        }
        val autoCoralL3Remove: Button = view.findViewById(R.id.auto_coralL3Remove)
        autoCoralL3Remove.setOnClickListener {
            if (teamMatchScoutingData.auto.coralL3 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL3 = teamMatchScoutingData.auto.coralL3 - 1u))
                autoCoralL3Amount.text = teamMatchScoutingData.auto.coralL3.toString()
                runSaveCheck(view)
            }
        }

        val autoCoralL4Amount: TextView = view.findViewById(R.id.auto_coralL4Amount)
        autoCoralL4Amount.text = teamMatchScoutingData.auto.coralL4.toString()
        val autoCoralL4Add: Button = view.findViewById(R.id.auto_coralL4Add)
        autoCoralL4Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL4 = teamMatchScoutingData.auto.coralL4 + 1u))
            autoCoralL4Amount.text = teamMatchScoutingData.auto.coralL4.toString()
            runSaveCheck(view)
        }
        val autoCoralL4Remove: Button = view.findViewById(R.id.auto_coralL4Remove)
        autoCoralL4Remove.setOnClickListener {
            if (teamMatchScoutingData.auto.coralL4 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(coralL4 = teamMatchScoutingData.auto.coralL4 - 1u))
                autoCoralL4Amount.text = teamMatchScoutingData.auto.coralL4.toString()
                runSaveCheck(view)
            }
        }

        val autoAlgaeAmount: TextView = view.findViewById(R.id.auto_algaeAmount)
        autoAlgaeAmount.text = teamMatchScoutingData.auto.coralL4.toString()
        val autoAlgaeAdd: Button = view.findViewById(R.id.auto_algaeAdd)
        autoAlgaeAdd.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(algaeProcessor = teamMatchScoutingData.auto.algaeProcessor + 1u))
            autoAlgaeAmount.text = teamMatchScoutingData.auto.algaeProcessor.toString()
            runSaveCheck(view)
        }
        val autoAlgaeRemove: Button = view.findViewById(R.id.auto_algaeRemove)
        autoAlgaeRemove.setOnClickListener {
            if (teamMatchScoutingData.auto.algaeProcessor > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(algaeProcessor = teamMatchScoutingData.auto.algaeProcessor - 1u))
                autoAlgaeAmount.text = teamMatchScoutingData.auto.algaeProcessor.toString()
                runSaveCheck(view)
            }
        }

        val allianceGotAutoRP: CheckBox = view.findViewById(R.id.allianceGotAutoRP)
        allianceGotAutoRP.isChecked = teamMatchScoutingData.auto.allianceGotAutoRP
        allianceGotAutoRP.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(auto = teamMatchScoutingData.auto.copy(allianceGotAutoRP = state))
            runSaveCheck(view)
        }

        val teleopCoralL1Amount: TextView = view.findViewById(R.id.teleop_coralL1Amount)
        teleopCoralL1Amount.text = teamMatchScoutingData.teleop.coralL1.toString()
        val teleopCoralL1Add: Button = view.findViewById(R.id.teleop_coralL1Add)
        teleopCoralL1Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL1 = teamMatchScoutingData.teleop.coralL1 + 1u))
            teleopCoralL1Amount.text = teamMatchScoutingData.teleop.coralL1.toString()
            runSaveCheck(view)
        }
        val teleopCoralL1Remove: Button = view.findViewById(R.id.teleop_coralL1Remove)
        teleopCoralL1Remove.setOnClickListener {
            if (teamMatchScoutingData.teleop.coralL1 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL1 = teamMatchScoutingData.teleop.coralL1 - 1u))
                teleopCoralL1Amount.text = teamMatchScoutingData.teleop.coralL1.toString()
                runSaveCheck(view)
            }
        }

        val teleopCoralL2Amount: TextView = view.findViewById(R.id.teleop_coralL2Amount)
        teleopCoralL2Amount.text = teamMatchScoutingData.teleop.coralL2.toString()
        val teleopCoralL2Add: Button = view.findViewById(R.id.teleop_coralL2Add)
        teleopCoralL2Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL2 = teamMatchScoutingData.teleop.coralL2 + 1u))
            teleopCoralL2Amount.text = teamMatchScoutingData.teleop.coralL2.toString()
            runSaveCheck(view)
        }
        val teleopCoralL2Remove: Button = view.findViewById(R.id.teleop_coralL2Remove)
        teleopCoralL2Remove.setOnClickListener {
            if (teamMatchScoutingData.teleop.coralL2 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL2 = teamMatchScoutingData.teleop.coralL2 - 1u))
                teleopCoralL2Amount.text = teamMatchScoutingData.teleop.coralL2.toString()
                runSaveCheck(view)
            }
        }

        val teleopCoralL3Amount: TextView = view.findViewById(R.id.teleop_coralL3Amount)
        teleopCoralL3Amount.text = teamMatchScoutingData.teleop.coralL3.toString()
        val teleopCoralL3Add: Button = view.findViewById(R.id.teleop_coralL3Add)
        teleopCoralL3Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL3 = teamMatchScoutingData.teleop.coralL3 + 1u))
            teleopCoralL3Amount.text = teamMatchScoutingData.teleop.coralL3.toString()
            runSaveCheck(view)
        }
        val teleopCoralL3Remove: Button = view.findViewById(R.id.teleop_coralL3Remove)
        teleopCoralL3Remove.setOnClickListener {
            if (teamMatchScoutingData.teleop.coralL3 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL3 = teamMatchScoutingData.teleop.coralL3 - 1u))
                teleopCoralL3Amount.text = teamMatchScoutingData.teleop.coralL3.toString()
                runSaveCheck(view)
            }
        }

        val teleopCoralL4Amount: TextView = view.findViewById(R.id.teleop_coralL4Amount)
        teleopCoralL4Amount.text = teamMatchScoutingData.teleop.coralL4.toString()
        val teleopCoralL4Add: Button = view.findViewById(R.id.teleop_coralL4Add)
        teleopCoralL4Add.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL4 = teamMatchScoutingData.teleop.coralL4 + 1u))
            teleopCoralL4Amount.text = teamMatchScoutingData.teleop.coralL4.toString()
            runSaveCheck(view)
        }
        val teleopCoralL4Remove: Button = view.findViewById(R.id.teleop_coralL4Remove)
        teleopCoralL4Remove.setOnClickListener {
            if (teamMatchScoutingData.teleop.coralL4 > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(coralL4 = teamMatchScoutingData.teleop.coralL4 - 1u))
                teleopCoralL4Amount.text = teamMatchScoutingData.teleop.coralL4.toString()
                runSaveCheck(view)
            }
        }

        val teleopAlgaeProcessorAmount: TextView = view.findViewById(R.id.teleop_algaeProcessorAmount)
        teleopAlgaeProcessorAmount.text = teamMatchScoutingData.teleop.algaeProcessor.toString()
        val teleopAlgaeProcessorAdd: Button = view.findViewById(R.id.teleop_algaeProcessorAdd)
        teleopAlgaeProcessorAdd.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(algaeProcessor = teamMatchScoutingData.teleop.algaeProcessor + 1u))
            teleopAlgaeProcessorAmount.text = teamMatchScoutingData.teleop.algaeProcessor.toString()
            runSaveCheck(view)
        }
        val teleopAlgaeProcessorRemove: Button = view.findViewById(R.id.teleop_algaeProcessorRemove)
        teleopAlgaeProcessorRemove.setOnClickListener {
            if (teamMatchScoutingData.teleop.algaeProcessor > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(algaeProcessor = teamMatchScoutingData.teleop.algaeProcessor - 1u))
                teleopAlgaeProcessorAmount.text = teamMatchScoutingData.teleop.algaeProcessor.toString()
                runSaveCheck(view)
            }
        }

        val teleopAlgaeNetAmount: TextView = view.findViewById(R.id.teleop_algaeNetAmount)
        teleopAlgaeNetAmount.text = teamMatchScoutingData.teleop.algaeNet.toString()
        val teleopAlgaeNetAdd: Button = view.findViewById(R.id.teleop_algaeNetAdd)
        teleopAlgaeNetAdd.setOnClickListener {
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(algaeNet = teamMatchScoutingData.teleop.algaeNet + 1u))
            teleopAlgaeNetAmount.text = teamMatchScoutingData.teleop.algaeNet.toString()
            runSaveCheck(view)
        }
        val teleopAlgaeNetRemove: Button = view.findViewById(R.id.teleop_algaeNetRemove)
        teleopAlgaeNetRemove.setOnClickListener {
            if (teamMatchScoutingData.teleop.algaeNet > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(algaeNet = teamMatchScoutingData.teleop.algaeNet - 1u))
                teleopAlgaeNetAmount.text = teamMatchScoutingData.teleop.algaeNet.toString()
                runSaveCheck(view)
            }
        }

        val allianceDidCoopertition: CheckBox = view.findViewById(R.id.allianceDidCoopertition)
        allianceDidCoopertition.isChecked = teamMatchScoutingData.allianceDidCoopertition
        allianceDidCoopertition.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(allianceDidCoopertition = state)
            runSaveCheck(view)
        }

        val teleopParked: CheckBox = view.findViewById(R.id.teleop_parked)
        teleopParked.isChecked = teamMatchScoutingData.teleop.parked
        teleopParked.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(parked = state))
            runSaveCheck(view)
        }

        val teleopShallowCageClimbed: CheckBox = view.findViewById(R.id.teleop_shallowCageClimbed)
        teleopShallowCageClimbed.isChecked = teamMatchScoutingData.teleop.shallowCageClimbed
        teleopShallowCageClimbed.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(shallowCageClimbed = state))
            runSaveCheck(view)
        }

        val teleopDeepCageClimbed: CheckBox = view.findViewById(R.id.teleop_deepCageClimbed)
        teleopDeepCageClimbed.isChecked = teamMatchScoutingData.teleop.deepCageClimbed
        teleopDeepCageClimbed.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(deepCageClimbed = state))
            runSaveCheck(view)
        }

        val teleopAllianceGotCoralRP: CheckBox = view.findViewById(R.id.allianceGotCoralRP)
        teleopAllianceGotCoralRP.isChecked = teamMatchScoutingData.teleop.allianceGotCoralRP
        teleopAllianceGotCoralRP.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(allianceGotCoralRP = state))
            runSaveCheck(view)
        }

        val teleopAllianceGotBargeRP: CheckBox = view.findViewById(R.id.allianceGotBargeRP)
        teleopAllianceGotBargeRP.isChecked = teamMatchScoutingData.teleop.allianceGotBargeRP
        teleopAllianceGotBargeRP.setOnCheckedChangeListener { _, state ->
            teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(allianceGotBargeRP = state))
            runSaveCheck(view)
        }

        val teleopDrivingSkillAmount: TextView = view.findViewById(R.id.teleop_drivingSkillAmount)
        teleopDrivingSkillAmount.text = teamMatchScoutingData.teleop.drivingSkill.toString()
        val teleopDrivingSkillAdd: Button = view.findViewById(R.id.teleop_drivingSkillAdd)
        teleopDrivingSkillAdd.setOnClickListener {
            if (teamMatchScoutingData.teleop.drivingSkill < 5u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(drivingSkill = teamMatchScoutingData.teleop.drivingSkill + 1u))
                teleopDrivingSkillAmount.text = teamMatchScoutingData.teleop.drivingSkill.toString()
                runSaveCheck(view)
            }
        }
        val teleopDrivingSkillRemove: Button = view.findViewById(R.id.teleop_drivingSkillRemove)
        teleopDrivingSkillRemove.setOnClickListener {
            if (teamMatchScoutingData.teleop.drivingSkill > 0u) {
                teamMatchScoutingData = teamMatchScoutingData.copy(teleop = teamMatchScoutingData.teleop.copy(drivingSkill = teamMatchScoutingData.teleop.drivingSkill - 1u))
                teleopDrivingSkillAmount.text = teamMatchScoutingData.teleop.drivingSkill.toString()
                runSaveCheck(view)
            }
        }

        val comments: TextInputEditText = view.findViewById(R.id.comments)
        comments.setText(teamMatchScoutingData.comments)
        comments.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
                // Called *before* the text is changed.  Useful for tracking changes.
                // 's' is the current text
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                // Called *during* the text change.  Also useful for tracking changes.
                // 's' is the current text
            }

            override fun afterTextChanged(s: Editable?) {
                teamMatchScoutingData = teamMatchScoutingData.copy(comments = s.toString())
                runSaveCheck(view)
            }
        })

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        savebar?.dismiss()
    }

    private fun runSaveCheck(view: View) {
        if (teamMatchScoutingData != if (blue) match.scouting.blue.elementAt(teamIndex) else match.scouting.red.elementAt(teamIndex)) {
            savebar = Snackbar.make(view, R.string.savebar_message, Snackbar.LENGTH_INDEFINITE)
                .setAction(R.string.savebar_save) {
                    MaterialAlertDialogBuilder(requireContext())
                        .setTitle(resources.getString(R.string.event_dialog_title))
                        .setMessage(resources.getString(R.string.savebar_dialog_message))
                        .setNegativeButton(resources.getString(R.string.event_dialog_cancel)) { _, _ ->
                            val currentMatchData = eventData.value!!.matches.find { m -> m.matchNumber == match.matchNumber }

                            supportFragmentManager.beginTransaction()
                                .replace(R.id.nav_host_fragment, MatchFragment(currentMatchData!!, team, teamIndex, blue, eventData, supportFragmentManager))
                                .commitNow()
                        }
                        .setPositiveButton(resources.getString(R.string.event_dialog_continue)) { _, _ ->
                            val updatedBlueMatchScoutingData = match.scouting.blue.clone()
                            if (blue) updatedBlueMatchScoutingData[teamIndex] = teamMatchScoutingData
                            val updatedRedMatchScoutingData = match.scouting.red.clone()
                            if (!blue) updatedRedMatchScoutingData[teamIndex] = teamMatchScoutingData
                            val updatedMatchScoutingData = match.scouting.copy(blue = updatedBlueMatchScoutingData, red = updatedRedMatchScoutingData)

                            teamMatchScoutingData.recentlyModified = true
                            teamMatchScoutingData.modified = true
                            val updatedMatches = eventData.value!!.matches.map { if (it.matchNumber == match.matchNumber) match.copy(rankMatchData = true, scouting = updatedMatchScoutingData) else it }

                            eventData.value = eventData.value!!.copy(matches = updatedMatches.toTypedArray())
                            Toast.makeText(context, "Saved Team Match Data for $team in Match ${match.matchNumber}", Toast.LENGTH_SHORT).show()
                        }
                        .show()
                }
                .addCallback(object : Snackbar.Callback() {
                    override fun onDismissed(snackbar: Snackbar, event: Int) {
                        if (event == DISMISS_EVENT_SWIPE) {
                            val currentMatchData = eventData.value!!.matches.find { m -> m.matchNumber == match.matchNumber }

                            supportFragmentManager.beginTransaction()
                                .replace(R.id.nav_host_fragment, MatchFragment(currentMatchData!!, team, teamIndex, blue, eventData, supportFragmentManager))
                                .commitNow()
                        }
                    }
                })

            savebar!!.show()
        } else {
            savebar?.dismiss()
        }
    }
}
